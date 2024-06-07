import React from 'react';
import { Toast } from 'react-bootstrap';
import { getColor } from '../../utils/styles/global-styles';

interface ToastNotificationProps {
    id: number;
    title: string;
    message: string;
    date: Date;
    variant: string;
    onClose: (id: number) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ id, title, message, date, variant, onClose }) => {
    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <Toast onClose={() => onClose(id)} autohide delay={3000} style={{ position: 'fixed', top: 50, right: 10, zIndex: 99 }}>
            <Toast.Header className='justify-content-between py-0'>
                <svg className="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                    role="img" aria-label=" :  " preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title> </title>
                    <rect height="100%" fill={getColor(variant)} width="100%" />
                    <text x="50%" y="50%" fill="#dee2e6" dy=".3em"> </text>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong className="mr-auto">{title}</strong>
                    <small>{formatTime(date)}</small>
                </div>
            </Toast.Header>
            <Toast.Body>
                <strong>{message}</strong>
            </Toast.Body>
        </Toast>
    );
};

export default ToastNotification;
