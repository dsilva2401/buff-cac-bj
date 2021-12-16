import React from "react";
import { useTranslation } from "react-i18next";
import { ReferralModuleType } from "types/ProductDetailsType";
import { CopyToClipboard } from "react-copy-to-clipboard";
import qrcode from "assets/images/png/qrcode.png";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Image from "components/Image";
import Input from "components/Input";
import Text from "components/Text";

type ReferralDrawerProps = {
  referralData: ReferralModuleType;
};

const ReferralDrawer: React.FC<ReferralDrawerProps> = ({ referralData }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.referralDrawer",
  });

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      padding="0 0.25rem"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Wrapper
        width="100%"
        gap="0.75rem"
        direction="column"
        padding="0 0.75rem"
        dangerouslySetInnerHTML={{ __html: referralData?.details }}
      />
      <Input value={referralData?.url} disabled margin="0.75rem 0" />
      <Wrapper
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="0.625rem"
      >
        {/* <CopyToClipboard text={referralData?.url} onCopy={() => toast()}> */}
        <CopyToClipboard text={referralData?.url}>
          <Button theme="light">{t("copyLinkButton")}</Button>
        </CopyToClipboard>
        <Button theme="light">{t("shareLinkButton")}</Button>
      </Wrapper>
      <Text fontSize="1.125rem" color="#98A3AA" margin="0.75rem 0">
        <p>or</p>
      </Text>
      <Wrapper
        width="100%"
        responsiveImg
        padding="0.75rem"
        alignItems="center"
        justifyContent="space-between"
        style={{ background: "#F7F7F7", borderRadius: "12px" }}
      >
        <Text
          fontSize="1rem"
          fontWeight="600"
          color="#414149"
          padding="0rem 0.25rem"
        >
          <p>{t("helpText")}</p>
        </Text>
        <Image src={qrcode} alt="qr-code" maxWidth="45%" />
      </Wrapper>
    </Wrapper>
  );
};

export default ReferralDrawer;
