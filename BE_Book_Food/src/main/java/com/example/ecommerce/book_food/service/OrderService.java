package com.example.ecommerce.book_food.service;

import com.example.ecommerce.book_food.Enum.OrderStatus;
import com.example.ecommerce.book_food.dto.request.CreateOrderRequest;
import com.example.ecommerce.book_food.dto.request.OrderItemRequest;
import com.example.ecommerce.book_food.dto.respone.OrderItemResponse;
import com.example.ecommerce.book_food.dto.respone.OrderResponse;
import com.example.ecommerce.book_food.dto.respone.UserOrderResponse;
import com.example.ecommerce.book_food.dto.respone.UserResponse;
import com.example.ecommerce.book_food.entity.*;
import com.example.ecommerce.book_food.exception.FoodNotAvailableException;
import com.example.ecommerce.book_food.exception.FoodNotFoundException;
import com.example.ecommerce.book_food.exception.OrderNotFoundException;
import com.example.ecommerce.book_food.exception.UserNotFoundException;
import com.example.ecommerce.book_food.mapper.OrderItemMapper;
import com.example.ecommerce.book_food.mapper.OrderMapper;
import com.example.ecommerce.book_food.repository.FoodRepository;
import com.example.ecommerce.book_food.repository.OrderRepository;
import com.example.ecommerce.book_food.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;


    //tạo order
    public OrderResponse createOrder(CreateOrderRequest request, Long userId) throws UserNotFoundException, FoodNotFoundException, FoodNotAvailableException {
        //kiểm tra user
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

        // xử lý danh sách món ăn
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            //kiểm tra món có tồn tại khog
            Food food = foodRepository.findById(itemRequest.getFoodId())
                    .orElseThrow(() -> new FoodNotFoundException("Food not found with id: " + itemRequest.getFoodId()));
            if (!food.getIsAvailable()) { //kiem tra món có còn bán không
                throw new FoodNotAvailableException("Food is not available: " + food.getName());
            }

            BigDecimal itemTotal = food.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            //khởi tạo order
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
        return orderMapper.convertToOrderResponse(savedOrder);
    }

    //lay danh sách order của user kèm theo số lượng đơn hàng
    public UserOrderResponse getUserOrders(Long userId, int page, int size) {

        boolean exists = userRepository.existsById(userId);
        if (!exists) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        // đếm tong so đơn hàng của user
        long totalOrderByUser = orderRepository.countByUserId(userId);
        //chuyển đổi danh sách đơn hàng thành reponse
        // Chuyển đổi danh sách đơn hàng thành OrderResponse
        List<OrderResponse> orderResponses = orderMapper.convertToOrderResponseList(orders.getContent());

        // Tạo phản hồi
        return new UserOrderResponse(
                orderResponses,
                totalOrderByUser
        );

    }

    //cập nhật trạng thái order
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) throws OrderNotFoundException {
        //tìm kiếm order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.PREPARING) {
            // Tính lại estimatedDeliveryTime dựa trên tổng thời gian chế biến
            //Tổng thời gian chế biến = Σ (thời gian chế biến món × số lượng).
            int totalPrepTime = order.getOrderItems().stream()
                    .mapToInt(item -> item.getFood().getPreparationTime() * item.getQuantity())
                    .sum();
            order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(totalPrepTime + 15)); // +15 for delivery
        }

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.convertToOrderResponse(updatedOrder);
    }

    // Lấy tất cả các đơn hàng
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orderMapper.convertToOrderResponseList(orders);
    }

    //tính tổng doanh thu đơn hàng theo thời giann
    public BigDecimal getTotalRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        // Kiểm tra đầu vào
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        BigDecimal totalRevenue = orderRepository.getTotalRevenueByDateRange(startDate, endDate);

        return totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }


}
