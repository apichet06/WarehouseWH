/* eslint-disable react-refresh/only-export-components */
// AppContext.tsx
import { createContext, useReducer, useContext, ReactNode, Dispatch, FC } from 'react';

interface State {
    amount: number;
}

type Action = { type: 'SET_AMOUNT'; payload: number };

const initialState: State = {
    amount: 0,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_AMOUNT':
            return { ...state, amount: action.payload };
        default:
            return state;
    }
};

const AppContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
