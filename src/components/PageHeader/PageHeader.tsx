import IconButton from "components/IconButton";
import Wrapper from "components/Wrapper";
import React from "react";
import Header from "./styles";

type PageHeaderProps = {
  title?: string;
  logo?: React.ReactNode;
  actionButton?: React.ReactNode;
  border?: boolean;
  goBack?: () => void;
};

export default function PageHeader({
  title,
  logo,
  actionButton,
  border = true,
  goBack,
}: PageHeaderProps) {
  return (
    <Header border={border}>
      <Wrapper width="33%" justifyContent="flex-start" alignItems="center">
        {logo ? (
          logo
        ) : goBack ? (
          <IconButton
            theme="light"
            iconName="chevron-left"
            onClick={() => goBack()}
          />
        ) : (
          <></>
        )}
      </Wrapper>
      <Wrapper width="33%" justifyContent="center" alignItems="center">
        {title ? <h1>{title}</h1> : <></>}
      </Wrapper>
      <Wrapper width="33%" justifyContent="flex-end" alignItems="center">
        {actionButton ? actionButton : <></>}
      </Wrapper>
    </Header>
  );
}
