package com.example.ecommerce.book_food.mapper;

import com.example.ecommerce.book_food.dto.respone.*;
import com.example.ecommerce.book_food.entity.Food;
import com.example.ecommerce.book_food.entity.Order;
import com.example.ecommerce.book_food.entity.OrderItem;
import com.example.ecommerce.book_food.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    private final ModelMapper modelMapper;
    private final OrderItemMapper orderItemMapper;
    private final UserMapper userMapper;

    public OrderMapper(ModelMapper modelMapper, OrderItemMapper orderItemMapper, UserMapper userMapper) {
        this.modelMapper = modelMapper;
        this.orderItemMapper = orderItemMapper;
        this.userMapper = userMapper;
    }

    //ở đây sẽ ánh xạ thủ công, k sd modelmapper để tránh lỗi lazy ở orderitem và user
    public OrderResponse convertToOrderResponse(Order order) {
        // Chuyển đổi danh sách OrderItem thủ công
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::convertToOrderItemResponse)
                .collect(Collectors.toList());

        // Chuyển đổi User thủ công
        UserResponse userResponse = convertToUserResponse(order.getUser());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryPhone(order.getDeliveryPhone())
                .notes(order.getNotes())
                .estimatedDeliveryTime(order.getEstimatedDeliveryTime())
                .items(itemResponses)
                .user(userResponse)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

//    public DashboardResponse convertToDashBoardResponse(Order order){
//        // Chuyển đổi danh sách OrderItem thủ công
//        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
//                .map(this::convertToOrderItemResponse)
//                .collect(Collectors.toList());
//
//        return DashboardResponse.builder()
//                .totalOrders()
//                .totalSucceededOrders()
//                .totalRevenue()
//                .totalRevenue_success()
//                .totalRevenue_pending()
//                .totalRevenue_failed()
//                .totalRevenue_preparing()
//                .totalFoodsSold()
//                .topFoods()
//                .build();
//    }

    public OrderResponse convertToOrderResponse(Order order, Set<Long> reviewedSet) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(oi -> convertToOrderItemResponse(oi, reviewedSet))
                .collect(Collectors.toList());

        UserResponse userResponse = convertToUserResponse(order.getUser());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryPhone(order.getDeliveryPhone())
                .notes(order.getNotes())
                .estimatedDeliveryTime(order.getEstimatedDeliveryTime())
                .items(itemResponses)
                .user(userResponse)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }


    //chuyển đổi order sang orderResponse để tránh lỗi do Lazy gây ra
    public List<OrderResponse> convertToOrderResponseList(List<Order> orders) {
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }
    //chuyển đổi orderitem sang orderitem respone
    public OrderItemResponse convertToOrderItemResponse(OrderItem orderItem) {
        return OrderItemResponse.builder()
                .foodId(orderItem.getFood().getId())
                .foodName(orderItem.getFood().getName())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getUnitPrice())
                .totalPrice(orderItem.getTotalPrice())
                .build();
    }

    // ====== 3) Map 1 OrderItem + set isReviewed ======
    public OrderItemResponse convertToOrderItemResponse(OrderItem orderItem, Set<Long> reviewedSet) {
        Long foodId = orderItem.getFood().getId();
        boolean reviewed = reviewedSet.contains(foodId);

        return OrderItemResponse.builder()
                .foodId(foodId)
                .foodName(orderItem.getFood().getName())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getUnitPrice())
                .totalPrice(orderItem.getTotalPrice())
                .isReviewed(reviewed) // <-- gán cờ
                .build();
    }

    //chuyển đổi user sang userresponse
    public UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    // chuyển
}