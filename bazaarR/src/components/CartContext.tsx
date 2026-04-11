
import { createContext, useContext, useReducer, useState, ReactNode, useEffect } from "react";
import { getUser } from "@/lib/actions/auth";
import { syncCartAction, getCartAction } from "@/lib/actions/user_data";
import { useNotification } from "@/components/NotificationContext";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "LOAD_CART": {
            const items = action.payload || [];
            return {
                items,
                totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
        }
        case "ADD_ITEM": {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );

                return {
                    ...state,
                    items: updatedItems,
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + action.payload.price,
                };
            }

            const newItems = [...state.items, { ...action.payload, quantity: 1 }];

            return {
                ...state,
                items: newItems,
                totalItems: state.totalItems + 1,
                totalPrice: state.totalPrice + action.payload.price,
            };
        }

        case "REMOVE_ITEM": {
            const itemToRemove = state.items.find(item => item.id === action.payload);
            if (!itemToRemove) return state;

            const newItems = state.items.filter(item => item.id !== action.payload);

            return {
                ...state,
                items: newItems,
                totalItems: state.totalItems - itemToRemove.quantity,
                totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
            };
        }

        case "UPDATE_QUANTITY": {
            const item = state.items.find(item => item.id === action.payload.id);
            if (!item) return state;

            const quantityDiff = action.payload.quantity - item.quantity;
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );

            return {
                ...state,
                items: updatedItems,
                totalItems: state.totalItems + quantityDiff,
                totalPrice: state.totalPrice + (item.price * quantityDiff),
            };
        }

        case "CLEAR_CART":
            return initialState;

        default:
            return state;
    }
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    cart: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addNotification } = useNotification();
    const [userId, setUserId] = useState<string | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                const items = JSON.parse(storedCart);
                dispatch({ type: "LOAD_CART", payload: items });
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }

        // Check for user
        getUser().then(user => {
            if (user?.id) {
                setUserId(user.id);
                // Load from Firestore
                getCartAction(user.id).then(res => {
                    if (res?.data && res.data.length > 0) {
                        dispatch({ type: "LOAD_CART", payload: res.data });
                    }
                });
            }
        });
    }, []);

    // Sync to localStorage and Firestore on every change
    useEffect(() => {
        if (state.items.length > 0) {
            localStorage.setItem("cart", JSON.stringify(state.items));
        } else {
            localStorage.removeItem("cart");
        }

        if (userId) {
            syncCartAction(userId, state.items);
        }
    }, [state.items, userId]);

    const addItem = (item: Omit<CartItem, "quantity">) => {
        dispatch({ type: "ADD_ITEM", payload: item });
        addNotification(`Produit ajouté au panier`);
    };

    const removeItem = (id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: id });
    };

    const removeFromCart = (id: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
        } else {
            dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const value: CartContextType = {
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        cart: state.items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
