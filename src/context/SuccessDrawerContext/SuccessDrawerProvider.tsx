import React, { useReducer } from 'react';
import { SuccessDrawerContext } from './SuccessDrawerContext';

interface MetaProps {
  title: string;
  description?: string;
}

interface SuccessDrawerInitStateType {
  open: boolean;
  success: boolean;
  meta: MetaProps;
}

const initState: SuccessDrawerInitStateType = {
  open: false,
  success: false,
  meta: {
    title: '',
    description: '',
  },
};

const reducer = (state: SuccessDrawerInitStateType, action: any) => {
  switch (action.type) {
    case 'OPEN': {
      return {
        ...state,
        open: true,
      };
    }
    case 'CLOSE': {
      return {
        ...state,
        open: false,
      };
    }
    case 'SET_META': {
      return {
        ...state,
        meta: { ...action.payload },
      };
    }
    case 'SHOW_SUCCESS': {
      return {
        ...state,
        success: true,
      };
    }
    case 'CLOSE_SUCCESS': {
      return {
        ...state,
        success: false,
      };
    }
    default: {
      return state;
    }
  }
};

export const SuccessDrawerProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { open, success, meta } = state;

  const openDrawer = () => {
    dispatch({ type: 'OPEN' });
  };

  const closeDrawer = () => {
    dispatch({ type: 'CLOSE' });
  };

  const showSuccess = () => {
    dispatch({ type: 'SHOW_SUCCESS' });
  };

  const closeSuccess = () => {
    dispatch({ type: 'CLOSE_SUCCESS' });
  };

  const setMeta = (meta: MetaProps) => {
    dispatch({
      type: 'SET_META',
      payload: { ...meta },
    });
  };

  return (
    <SuccessDrawerContext.Provider
      value={{
        openDrawer,
        closeDrawer,
        showSuccess,
        closeSuccess,
        setMeta,
        meta,
        open,
        success,
      }}
    >
      {children}
    </SuccessDrawerContext.Provider>
  );
};
