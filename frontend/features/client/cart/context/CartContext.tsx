"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface ProductItem {
  id: number | string;
  name: string;
  code: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export interface CartItem extends ProductItem {
  quantity: number;
  selected: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  toggleSelection: (id: number | string) => void;
  toggleAll: (selected: boolean) => void;
  removeSelected: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount and listen for changes
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("shopping-cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          // Ensure new 'selected' property exists for old data
          const cartWithSelection = parsed.map((item: any) => ({
            ...item,
            selected: item.selected ?? true,
          }));
          setCartItems(cartWithSelection);
        } catch (error) {
          console.error("Failed to parse cart data", error);
        }
      }
    };

    loadCart();
    setIsInitialized(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "shopping-cart") {
        loadCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("shopping-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product: ProductItem) => {
    // Check if item exists BEFORE state update to determine message
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      toast.success(`Đã cập nhật số lượng cho ${product.name}`);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
      setCartItems((prev) => [
        ...prev,
        { ...product, quantity: 1, selected: true },
      ]);
    }
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleSelection = (id: number | string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAll = (selected: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const removeSelected = () => {
    setCartItems((prev) => {
      const keptItems = prev.filter((item) => !item.selected);
      if (keptItems.length === prev.length) {
        toast.warning("Vui lòng chọn sản phẩm để xóa");
        return prev;
      }
      toast.info(`Đã xóa ${prev.length - keptItems.length} sản phẩm đã chọn`);
      return keptItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Đã xóa toàn bộ giỏ hàng");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Only sum Price of SELECTED items
  const totalPrice = cartItems.reduce(
    (acc, item) => (item.selected ? acc + item.price * item.quantity : acc),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelection,
        toggleAll,
        removeSelected,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
