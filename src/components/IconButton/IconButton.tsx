import React from 'react';
import Button from './styles';
import { useGlobal } from 'context/global/GlobalContext';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import { ReactComponent as CloseLight } from 'assets/icons/svg/close-white.svg';
import { ReactComponent as ChevronLeft } from 'assets/icons/svg/chevron-left.svg';
import { ReactComponent as Menu } from 'assets/icons/svg/menu.svg';
import { ReactComponent as Edit } from 'assets/icons/svg/edit.svg';
/**
 * An icon button component
 * @param {'dark' | 'light'} theme Defines de background color. Must be 'light' or 'dark'. Default: 'light'
 * @param {'close' | 'chevron-left' | 'menu' | 'edit'} iconName Choose the icon that will be rendered if there is no children. Default: 'close'
 * @param {React.ReactNode} children Render a children element instead of predefined icons.
 */

type IconButtonProps = {
  variant?: 'dark' | 'light';
  iconName?: 'close' | 'close-light' | 'chevron-left' | 'menu' | 'edit';
  children?: React.ReactNode;
  onClick: () => void;
};

export default function IconButton({
  iconName,
  variant = 'light',
  children,
  onClick,
}: IconButtonProps) {
  const { brandTheme } = useGlobal();

  const renderIcon = () => {
    switch (iconName) {
      case 'close':
        return <Close />;
      case 'close-light':
        return <CloseLight />;
      case 'chevron-left':
        return <ChevronLeft />;
      case 'menu':
        return <Menu />;
      case 'edit':
        return <Edit />;
      default:
        return <Close />;
    }
  };

  return (
    <Button brandTheme={brandTheme} variant={variant} onClick={onClick}>
      {children ? children : renderIcon()}
    </Button>
  );
}
