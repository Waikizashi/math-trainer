import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CenterContextProps {
    centerX: number;
    centerY: number;
    setCenter: (x: number, y: number) => void;
}

const CenterContext = createContext<CenterContextProps | undefined>(undefined);

export const CenterProvider = ({ children }: { children: ReactNode }) => {
    const [centerX, setCenterX] = useState(0);
    const [centerY, setCenterY] = useState(0);

    const setCenter = (x: number, y: number) => {
        setCenterX(x);
        setCenterY(y);
    };

    return (
        <CenterContext.Provider value={{ centerX, centerY, setCenter }}>
            {children}
        </CenterContext.Provider>
    );
};

export const useCenter = () => {
    const context = useContext(CenterContext);
    if (!context) {
        throw new Error('useCenter must be used within a CenterProvider');
    }
    return context;
};
