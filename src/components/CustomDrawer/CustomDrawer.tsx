import React from 'react';
import HtmlWrapper from 'components/HtmlWrapper';
import ModuleWrapper from 'components/ModuleWrapper';
import { useIframeModifier } from 'hooks/useIframeModifier';
import { CustomModuleType } from 'types/ProductDetailsType';

type CustomDrawerProps = {
  drawerTitle: string;
  drawerData: CustomModuleType;
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerTitle,
  drawerData,
}) => {
  return (
    <ModuleWrapper drawerTitle={drawerTitle}>
      <HtmlWrapper
        width='100%'
        direction='column'
        dangerouslySetInnerHTML={{
          __html: useIframeModifier(drawerData?.content),
        }}
      />
    </ModuleWrapper>
  );
};

export default CustomDrawer;
