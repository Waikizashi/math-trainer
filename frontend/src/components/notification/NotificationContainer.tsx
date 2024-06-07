import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import ToastNotification from './ToastNotification';

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div>
            {notifications.map(notification => (
                <ToastNotification
                    key={notification.id}
                    id={notification.id}
                    title={notification.title}
                    message={notification.message}
                    date={notification.date}
                    variant={notification.variant}
                    onClose={removeNotification}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;
