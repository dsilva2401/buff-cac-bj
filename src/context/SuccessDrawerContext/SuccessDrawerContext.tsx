import { createContext, useContext } from 'react';

interface MetaProps {
  title: string;
  description?: string;
}

export type SuccessDrawerContextProps = {
  openDrawer: () => void;
  closeDrawer: () => void;
  showSuccess: () => void;
  closeSuccess: () => void;
  setMeta: (meta: MetaProps) => void;
  meta: MetaProps;
  open: boolean;
  success: boolean;
};

export const SuccessDrawerContext = createContext<SuccessDrawerContextProps>({
  openDrawer: () => {},
  closeDrawer: () => {},
  showSuccess: () => {},
  closeSuccess: () => {},
  setMeta: (meta) => {},
  meta: { title: '', description: '' },
  open: false,
  success: false,
});

export const useSuccessDrawerContext = () => useContext(SuccessDrawerContext);
