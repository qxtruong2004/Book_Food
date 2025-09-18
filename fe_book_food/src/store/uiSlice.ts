import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//để quản lý trạng thái giao diện (UI state) của ứng dụng trong Redux, thay vì để rải rác trong nhiều component.
interface UIState {
    sidebarOpen: boolean;
    cartOpen: boolean;
    mobileMenuOpen: boolean;
    modalOpen: boolean;
    modalType: string | null;
    modalData: any;
    loading: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
    searchQuery: string;
    currentView: 'list' | 'grid';
    filterPanelOpen: boolean;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    autoHide?: boolean;
    duration?: number;
}

const initialState: UIState = {
    sidebarOpen: false,
    cartOpen: false,
    mobileMenuOpen: false,
    modalOpen: false,
    modalType: null,
    modalData: null,
    loading: false,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    notifications: [],
    searchQuery: '',
    currentView: (localStorage.getItem('viewMode') as 'list' | 'grid') || 'grid',
    filterPanelOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Sidebar actions
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },

        // Cart actions
        toggleCart: (state) => {
            state.cartOpen = !state.cartOpen;
        },
        setCartOpen: (state, action: PayloadAction<boolean>) => {
            state.cartOpen = action.payload;
        },

        // Mobile menu actions
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.mobileMenuOpen = action.payload;
        },

        // Modal actions
        openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
            state.modalOpen = true;
            state.modalType = action.payload.type;
            state.modalData = action.payload.data;
        },
        closeModal: (state) => {
            state.modalOpen = false;
            state.modalType = null;
            state.modalData = null;
        },

        // Loading actions
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Theme actions
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
        },

        // Notification actions
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
                autoHide: action.payload.autoHide ?? true,
                duration: action.payload.duration ?? 5000,
            };
            state.notifications.unshift(notification);

            // Keep only last 10 notifications
            if (state.notifications.length > 10) {
                state.notifications = state.notifications.slice(0, 10);
            }
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },

        // Search actions
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        },

        // View mode actions
        setCurrentView: (state, action: PayloadAction<'list' | 'grid'>) => {
            state.currentView = action.payload;
            localStorage.setItem('viewMode', action.payload);
        },
        toggleView: (state) => {
            state.currentView = state.currentView === 'grid' ? 'list' : 'grid';
            localStorage.setItem('viewMode', state.currentView);
        },

        // Filter panel actions
        toggleFilterPanel: (state) => {
            state.filterPanelOpen = !state.filterPanelOpen;
        },
        setFilterPanelOpen: (state, action: PayloadAction<boolean>) => {
            state.filterPanelOpen = action.payload;
        },

        // Reset UI state
        resetUI: (state) => {
            state.sidebarOpen = false;
            state.cartOpen = false;
            state.mobileMenuOpen = false;
            state.modalOpen = false;
            state.modalType = null;
            state.modalData = null;
            state.loading = false;
            state.searchQuery = '';
            state.filterPanelOpen = false;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    toggleCart,
    setCartOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    openModal,
    closeModal,
    setLoading,
    toggleTheme,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    setSearchQuery,
    clearSearchQuery,
    setCurrentView,
    toggleView,
    toggleFilterPanel,
    setFilterPanelOpen,
    resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectCurrentView = (state: { ui: UIState }) => state.ui.currentView;