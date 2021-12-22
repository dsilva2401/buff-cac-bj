import React from "react";
import Text from "components/Text";
import Wrapper from "components/Wrapper";
import { CustomModuleType } from "types/ProductDetailsType"

type CustomDrawerProps = {
  drawerTitle: string;
  drawerData: CustomModuleType;
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerTitle,
  drawerData,
}) => {
  return (
    <Wrapper
      direction="column"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Text
        fontSize="1rem"
        fontWeight="600"
        margin="1.25rem 3rem 1.25rem 1rem"
      >
        <h1>{drawerTitle}</h1>
      </Text>
      <Wrapper
        width="100%"
        gap="0.75rem"
        direction="column"
        padding="0.5rem 1rem"
        dangerouslySetInnerHTML={{ __html: drawerData.content }}
      />
    </Wrapper>
  );
};

export default CustomDrawer;
