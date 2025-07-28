package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.Enum.OrderStatus;
import com.example.ecommerce.book_food.dto.request.CreateOrderRequest;
import com.example.ecommerce.book_food.dto.respone.OrderResponse;
import com.example.ecommerce.book_food.entity.*;
import com.example.ecommerce.book_food.exception.FoodNotAvailableException;
import com.example.ecommerce.book_food.exception.FoodNotFoundException;
import com.example.ecommerce.book_food.exception.OrderNotFoundException;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.mapper.OrderMapper;
import com.example.ecommerce.book_food.repository.FoodRepository;
import com.example.ecommerce.book_food.repository.OrderRepository;
import com.example.ecommerce.book_food.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    public OrderResponse createOrder(CreateOrderRequest request, Long userId) throws UserNotFoundException, FoodNotFoundException, FoodNotAvailableException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        Order order = Order.builder()
                .user(user)
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryPhone(request.getDeliveryPhone())
                .notes(request.getNotes())
                .status(OrderStatus.PENDING)
                .estimatedDeliveryTime(LocalDateTime.now().plusMinutes(30))
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Food food = foodRepository.findById(itemRequest.getFoodId())
                    .orElseThrow(() -> new FoodNotFoundException("Food not found with id: " + itemRequest.getFoodId()));

            if (!food.getIsAvailable()) {
                throw new FoodNotAvailableException("Food is not available: " + food.getName());
            }

            BigDecimal itemTotal = food.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .food(food)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(food.getPrice())
                    .totalPrice(itemTotal)
                    //.specialInstructions(itemRequest.getSpecialInstructions())
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    public List<OrderResponse> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return orderMapper.toResponseList(orders);
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.PREPARING) {
            // Calculate estimated delivery time based on preparation time
            int totalPrepTime = order.getOrderItems().stream()
                    .mapToInt(item -> item.getFood().getPreparationTime() * item.getQuantity())
                    .sum();
            order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(totalPrepTime + 15)); // +15 for delivery
        }

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toResponse(updatedOrder);
    }
}
