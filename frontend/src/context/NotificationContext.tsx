import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
    id: number;
    title: string;
    message: string;
    date: Date;
    variant: string;
}

interface NotificationContextProps {
    notifications: Notification[];
    addNotification: (title: string, message: string, variant: string) => void;
    removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

let notificationId = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (title: string, message: string, variant: string) => {
        const id = notificationId++;
        const date = new Date();
        setNotifications([...notifications, { id, title, message, date, variant }]);
    };

    const removeNotification = (id: number) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
