import { FC, MouseEventHandler } from 'react';

const CatchLinkWrapper: FC<{ onLinkClick: (href: string) => void }> = ({
  children,
  onLinkClick,
}) => {
  const catchEvents: MouseEventHandler<HTMLDivElement> = (e) => {
    const element = e.target as HTMLAnchorElement;
    if (element.tagName === 'A') {
      onLinkClick(element.href);
    }
  };

  return <div onClick={catchEvents}>{children}</div>;
};

export default CatchLinkWrapper;
