export type ThemeType = {
  primary: string;
  secondary: string;
  background: string;
  button: {
    primary: string;
    secondary: string;
    disabled: string;
    warning: string;
    border: string;
  };
  toast: {
    info: string;
    success: string;
    error: string;
    warn: string;
  };
};

export const theme: ThemeType = {
  primary: '#4B6EFA',
  secondary: '#FFFFFF',
  background: '#FEF',
  button: {
    primary: '#4B6EFA',
    secondary: '#FFFFFF',
    disabled: 'rgba(0, 0, 0, 0.3)',
    warning: '#FD6157',
    border: '#A5B7FD',
  },
  toast: {
    info: '#4B6EFA',
    success: '#25AE88',
    error: '#FD6157',
    warn: '#FE931E',
  },
};
