import React from "react";
import Wrapper from "components/Wrapper";

type CustomDrawerProps = {
  drawerData: any;
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({ drawerData }) => {
  return (
    <Wrapper
      width="100%"
      gap="0.75rem"
      direction="column"
      padding="0 0.5rem"
      dangerouslySetInnerHTML={{ __html: drawerData.content }}
    />
  );
};

export default CustomDrawer;
