"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ordersService } from '../services/servicesOrders/Orders';

interface NotificationContextType {
  pendingOrdersCount: number;
  refreshPendingOrders: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshPendingOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ordersService.filterOrdersByStatus('PENDING', 1);
      const count = response.data?.meta?.total || 0;
      setPendingOrdersCount(count);
    } catch (error) {
      console.error("Failed to fetch pending orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    refreshPendingOrders();
    const interval = setInterval(refreshPendingOrders, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [refreshPendingOrders]);

  return (
    <NotificationContext.Provider value={{ pendingOrdersCount, refreshPendingOrders, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
