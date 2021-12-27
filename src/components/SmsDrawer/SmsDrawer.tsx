import React from "react";
import { useTranslation } from "react-i18next";
import Text from "components/Text";
import Image from "components/Image";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import SmsBanner from "assets/images/png/sms-banner.png";

type SmsDrawerProps = {
  smsModuleData: any;
};

const SmsDrawer: React.FC<SmsDrawerProps> = ({ smsModuleData }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.smsDrawer",
  });

  return (
    <Wrapper direction="column" responsiveImg>
      <Image src={SmsBanner} alt="Sms Banner" rounded />
      <Wrapper direction="column" padding="1.5rem 0.5rem" gap="0.5rem">
        <Text fontSize="0.88rem" fontWeight="600" textAlign="center">
          <p>{smsModuleData.details}</p>
        </Text>
        <Text fontSize="0.563rem" color="#636369">
          <p>{t("subscriptionDisclaimer")}</p>
        </Text>
      </Wrapper>
      <Button variant="dark">{t('signUpButton')}</Button>
    </Wrapper>
  );
};

export default SmsDrawer;
