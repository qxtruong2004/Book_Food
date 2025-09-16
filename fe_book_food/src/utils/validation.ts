//kiểm tra tính hợp lệ của dữ liệu đầu vào
import { z } from "zod";
import { UserStatus } from "../types/user";
import { OrderStatus } from "../types/order";

//đăng kí
export const registerSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
    email: z.string().email("Email không hợp lệ"),
    password : z.string()
        .min(4, "Mật khẩu ít nhất 4 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
        .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
        .regex(/\d/, "Mật khẩu phải có ít nhất 1 số"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
});

//đăng nhập
export const loginSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu")
})
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token không được để trống"),
});

//cập nhật user
export const updateUserSchema = z.object({
    name: z.string().min(1, { message: 'Tên không được để trống' }).trim(),
    phone: z.string().regex(/^\d{9,11}$/, { message: 'Số điện thoại không hợp lệ' }).optional(),
    email: z.string().email({ message: 'Email không hợp lệ' }).min(1, { message: 'Email không được để trống' }),
    address: z.string().optional(),
    password: z.string().min(1, { message: 'Mật khẩu phải có ít nhất 1 ký tự' }).optional(),
});

//thay đổi trạng thái user
export const changeStatusUserSchema = z.object({
    status: z.nativeEnum(UserStatus),
});

//tạo review
export const createReviewSchema  = z.object({
    foodId: z.number().int().positive("foodId must be a positice interger"),
    orderId:  z.number().int().positive("orderId must be a positice interger"),
    rating: z.number().min(0).max(5),
    comment: z.string().max(500).optional(),
})

export const updateReviewSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty").max(500),
  rating: z.number().min(1).max(5),
});

//order
export const orderItemSchema = z.object({
  foodId: z.number().int().positive("foodId must be a positive integer"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least 1 item"),
  deliveryAddress: z.string().min(1, "Delivery address is required").max(200),
  deliveryPhone: z.string().regex(/^\d{9,11}$/, "Invalid phone number"),
  notes: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.nativeEnum(OrderStatus)
});

//foods
export const createFoodSchema = z.object({
  name: z.string().min(1, "Tên món ăn không được để trống"),
  description: z.string().optional(),
  price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  imageUrl: z.string().optional(),
  categoryId: z.number().int().positive("Danh mục không hợp lệ"),
  preparationTime: z.number().int().min(1, "Thời gian chế biến tối thiểu 1 phút"),
});

export const updateFoodSchema = createFoodSchema.extend({
  isAvailable: z.boolean().optional(),
});

export const foodSearchSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.number().int().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  page: z.number().min(0).optional(),
  size: z.number().min(1).optional(),
});

//category
export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

// Types từ schema
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusSchema = z.infer<typeof updateOrderStatusSchema>;

export type CreateFoodSchema = z.infer<typeof createFoodSchema>;
export type UpdateFoodSchema = z.infer<typeof updateFoodSchema>;
export type FoodSearchSchema = z.infer<typeof foodSearchSchema>;

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>;

export type ChangeStatusUserSchema = z.infer<typeof changeStatusUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;



