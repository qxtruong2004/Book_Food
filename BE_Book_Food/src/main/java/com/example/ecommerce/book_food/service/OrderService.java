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
import com.example.ecommerce.book_food.repository.ReviewRepository;
import com.example.ecommerce.book_food.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final ReviewRepository reviewRepository;


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

    //lay danh sách order của user kèm theo số lượng đơn hàng (admin)
    public UserOrderResponse getUserOrders(Long userId, int page, int size) {

        boolean exists = userRepository.existsById(userId);
        if (!exists) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        // đếm tong so đơn hàng của user
        long totalOrderByUser = orderRepository.countByUserId(userId);
        // Chuyển đổi danh sách đơn hàng thành OrderResponse
        Page<OrderResponse> orderResponses = orders.map(orderMapper::convertToOrderResponse);

        // Tạo phản hồi
        return new UserOrderResponse(
                orderResponses,
                totalOrderByUser
        );
    }

    //lay danh sách order của bản thân (user)
    public UserOrderResponse getMyOrders(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> myOrders = orderRepository.findByUser_Username(username, pageable);

        //đếm tổng sl đơn hàng
        long totalOrders = orderRepository.countByUser_Username(username);
        Page<OrderResponse> orderResponsesPage = myOrders.map(orderMapper::convertToOrderResponse);

        return new UserOrderResponse(orderResponsesPage, totalOrders);
    }

    //cập nhật trạng thái order
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) throws OrderNotFoundException {
        //tìm kiếm order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);


        if (newStatus == OrderStatus.PREPARING) {
            // Tính lại estimatedDeliveryTime dựa trên tổng thời gian chế biến
            //Tổng thời gian chế biến = Σ (thời gian chế biến món × số lượng).
            int totalPrepTime = order.getOrderItems().stream()
                    .mapToInt(item -> item.getFood().getPreparationTime() * item.getQuantity())
                    .sum();
            order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(totalPrepTime + 15)); // +15 for delivery
        }

        //nếu đã giao thành công thì + 1 đã bán cho món trong đó
        // chỉ cộng khi trc đó chưa succeeded và soldApplied = false
        if(newStatus == OrderStatus.SUCCEEDED && !order.isSoldApplied() ) {
            for(OrderItem orderItem : order.getOrderItems()) {
                //cập nhật atomic để tránh race condition
                foodRepository.incrementSoldCount(orderItem.getFood().getId(), orderItem.getQuantity());
            }
            order.setSoldApplied(true); // đánh dấu đã áp dụng doanh số cho đơn này
        }

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.convertToOrderResponse(updatedOrder);
    }


    //tính tổng doanh thu đơn hàng theo thời giann
    public long getTotalRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        // Kiểm tra đầu vào
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        //khi truy vấn khoảng thời gian, muốn tính từ đầu ngày  Ví dụ: 2025-09-01 → 2025-09-01T00:00:00
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        long totalRevenue = orderRepository.getTotalRevenueByDateRange(startDateTime, endDateTime);

        return totalRevenue;
    }

    //lấy chi tiet đơn hàng( admin)
    public OrderResponse getOrderDetailByAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        return orderMapper.convertToOrderResponse(order);
    }

    //lấy chi tiet đơn hàng (user)
    public OrderResponse getOrderDetailByUser(Long orderId, String username) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        if(!order.getUser().getUsername().equals(username)) {
            throw new SecurityException("Bạn không có quyền xem chi tiết đơn hàng nguowfi khác");
        }
        Long userId = order.getUser().getId();
        //món nào trong đơn này đã được user review( trả về list long tức danh sách id của món ăn
        List<Long> reviewedFoodIds = reviewRepository.findFoodIdsReviewedByUserAndOrder(userId, orderId);

        //chuển ds reviewedFoodIds thành 1 tập hợp set để loại bỏ các giá trị trùng lặp
        Set<Long> reviewedSet = new HashSet<>(reviewedFoodIds);
        return orderMapper.convertToOrderResponse(order, reviewedSet);
    }

    //huỷ đơn hàng
    public void cancelOrder(Long orderId, String username, boolean isAdmin){
        Order order =  orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        //nếu không phải admin thì chỉ được phesp hủy của bản thân
        if(!isAdmin && !order.getUser().getUsername().equals(username)) {
            throw new UserNotFoundException("Bạn không có quyền huy order này");
        }

        if(order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("Order cannot be cancelled once it is processed");
        }
        order.setStatus(OrderStatus.FAILED);
        orderRepository.save(order);
    }

    //lấy danh sách order ( lọc theo trạng thái, nếu kh có trạng thái thì lấy tất cả )
    public Page<OrderResponse> getAllOrders(OrderStatus orderStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders;
        if(orderStatus != null) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus, pageable);
        }
        else{
            orders = orderRepository.findAll(pageable);
        }
        return orders.map(orderMapper::convertToOrderResponse);
    }

    //lấy số lượng đơn hang theo ngay
    public Page<OrderResponse> getOrdersByDay(OrderStatus orderStatus, LocalDate startdate, LocalDate enddate , int page, int size) {
        LocalDateTime start =  startdate.atStartOfDay();
        LocalDateTime end = enddate.atTime(LocalTime.MAX);
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders;
        if(orderStatus == null){
            orders = orderRepository.getOrdersOnDay(null, start, end, pageable);
        }
        else{
            orders = orderRepository.getOrdersOnDay(orderStatus, start, end, pageable);
        }

        return orders.map(orderMapper::convertToOrderResponse);
    }

    //lay so lượng đơn hàng thành công trong ngày
    public Long getCountSuccessByDay(OrderStatus status, LocalDate startdate, LocalDate enddate) {
        LocalDateTime start =  startdate.atStartOfDay();
        LocalDateTime end = enddate.atTime(LocalTime.MAX);
        status = OrderStatus.SUCCEEDED;

        Long totalSuccess = orderRepository.countByStatusAndCreatedAtBetween(status, start, end);
        return totalSuccess;
    }
}