import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { useCallback, useState } from "react";
import { changeUserStatusAsync, clearError, clearSelectedUser, fetchActiveUsersAsync, fetchAllUsersAsync, fetchBlockedUsersAsync, fetchMyProfileAsync, fetchUserByIdAsync, searchUsersAsync, setUserQuery, updateUserByIdAsync, updateUserByUserAsync } from "../store/userSlice";
import { ChangeStatusUserRequest, StatusKey, UpdateUserRequest, UserSearchParams } from "../types/user";
import toast from "react-hot-toast";


export const useUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, selectedUser, users, blockedUsers, activeUsers, loading, updateLoading, error, pagedUsers, userQuery } = useSelector((state: RootState) => state.user);

    //lấy profile của user đang đăng nhập
    const getMyProfile = useCallback(async () => {
        return await dispatch(fetchMyProfileAsync()).unwrap();
    }, [dispatch]);

    //user update profile
    const updateProfile = useCallback(async (profileDate: UpdateUserRequest) => {
        try {
            const result = await dispatch(updateUserByUserAsync(profileDate)).unwrap();
            toast.success("Profile updated successfully!");
            return result;
        }
        catch (err: any) {
            toast.error(err || "Failed to update profile");
            throw err;
        }
    }, [dispatch]);

    //admin lấy user theo id
    const getUserById = useCallback(
        async (id: number) => await dispatch(fetchUserByIdAsync(id)).unwrap(),
        [dispatch]
    );


    //get all users
    const getAllUsers = useCallback(
        async () => await dispatch(fetchAllUsersAsync()).unwrap(),
        [dispatch]
    );

    //search + phân trang
    const searchUsers = useCallback(
        async (params?: Partial<UserSearchParams>) => {
            const merged = { ...userQuery, ...(params ?? {}) };
            return await dispatch(searchUsersAsync(merged)).unwrap();
        }
        , [dispatch, userQuery]
    );

    // ➕ Helpers thay đổi query
    const setQuery = useCallback(
        (patch: Partial<UserSearchParams>) => dispatch(setUserQuery(patch)),
        [dispatch]
    );

    const goToPage = useCallback((page: number) => setQuery({ page }), [setQuery]);
    const setSize = useCallback((size: number) => setQuery({ page: 0, size }), [setQuery]);
    const setSort = useCallback((sort: string) => setQuery({ page: 0, sort }), [setQuery]);
    const setName = useCallback((name: string) => setQuery({ page: 0, name }), [setQuery]);

    const [statusFilter, setStatusFilter] = useState<StatusKey>('ALL');

    //lấy danh sách user bị block
    const getBlockedUsers = useCallback(
        async () => await dispatch(fetchBlockedUsersAsync()).unwrap(),
        [dispatch]
    );

    //lấy danh sách user active
    const getActiveUsers = useCallback(
        async () => await dispatch(fetchActiveUsersAsync()).unwrap(),
        [dispatch]
    );

    //update user by admin
    const updateUserByAdmin = useCallback(
        async (id: number, request: UpdateUserRequest) => {
            try {
                const result = await dispatch(updateUserByIdAsync({ id, request })).unwrap();
                toast.success("User updated successfully!");
                return result;
            }
            catch (err: any) {
                toast.error(err || "Failed to update user");
                throw err;
            }
        }, [dispatch]
    );

    const changeUserStatus = useCallback(
        async (id: number, request: ChangeStatusUserRequest) => {
            try {
                const result = await dispatch(changeUserStatusAsync({ id, request })).unwrap();
                toast.success("User status changed successfully!");
                return result;
            } catch (err: any) {
                toast.error(err || "Failed to change user status");
                throw err;
            }
        },
        [dispatch]
    );

    return {
        //state
        currentUser, selectedUser, users, blockedUsers,
        activeUsers,
        loading,
        updateLoading,
        error,
        pagedUsers,
        userQuery,
        statusFilter,

        // Profile
        getMyProfile,
        updateProfile,

        // Admin
        getUserById,
        getAllUsers,
        getBlockedUsers,
        getActiveUsers,
        updateUserByAdmin,
        changeUserStatus,
        searchUsers,
        setQuery,
        goToPage,
        setSize,
        setSort,
        setName,
        setStatusFilter,

        // Slice utilities
        clearError: () => dispatch(clearError()),
        clearSelectedUser: () => dispatch(clearSelectedUser()),
    }

}