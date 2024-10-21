import React, { createContext, useContext, useState } from 'react';

// Define the types for each state
interface FocusContextType {
    focusedKey: string | null;
    setFocusedKey: (key: string | null) => void;
}

// Combine all types into a single type
interface GlobalContextType {
    focus: FocusContextType;
}

// Create the GlobalContext
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [focusedKey, setFocusedKey] = useState<string | null>(null);

    return (
        <GlobalContext.Provider value={{
            focus: { focusedKey, setFocusedKey },
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Create hooks to access each part of the context
export const useGlobalFocus = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalFocus must be used within a GlobalProvider');
    }
    return context.focus;
};
