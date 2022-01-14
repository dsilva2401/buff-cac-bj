import React from 'react';
import { Animated } from 'react-animated-css';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReferralModuleType } from 'types/ProductDetailsType';
import qrcode from 'assets/images/png/qrcode.png';
import useLogEvent from 'hooks/useLogEvent';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import Input from 'components/Input';
import Text from 'components/Text';

type ReferralDrawerProps = {
  drawerTitle: string;
  referralData: ReferralModuleType;
};

const ReferralDrawer: React.FC<ReferralDrawerProps> = ({
  drawerTitle,
  referralData,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.referralDrawer',
  });

  const logEvent = useLogEvent();

  const handleShare = async () => {
    const shareData = {
      title: referralData?.url,
      text: t('shareText'),
      url: referralData?.url,
    };
    const resultPara = document.querySelector('.result');
    try {
      await navigator.share(shareData);
      if (resultPara) resultPara.textContent = 'Shared successfully';
    } catch (err) {
      if (resultPara) resultPara.textContent = 'Error: ' + err;
    }
  };

  return (
    <Wrapper
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <Text
        fontSize='1rem'
        fontWeight='600'
        margin='1.25rem 3rem 1.25rem 1rem'
      >
        <h1>{drawerTitle}</h1>
      </Text>
      <Animated
        animationIn="slideInRight"
        animationOut="slideOutLeft"
        isVisible={true}
      >
        <Wrapper
          width='100%'
          gap='0.75rem'
          direction='column'
          padding='0 0.75rem'
          dangerouslySetInnerHTML={{ __html: referralData?.details }}
        />
        <Input value={referralData?.url} disabled margin='0.75rem 0' />
        <Wrapper
          width='100%'
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          gap='0.625rem'
        >
          <CopyToClipboard
            text={referralData?.url}
            onCopy={() => {
              showToast({ message: t('copyLinkToastMessage'), type: 'success' });
              logEvent({
                type: 'EVENT_MODULE',
                name: 'REFERRAL_COPIED',
                data: referralData,
              });
            }}
          >
            <Button variant='light'>{t('copyLinkButton')}</Button>
          </CopyToClipboard>
          <Button
            variant='light'
            id='shareButton'
            onClick={() => {
              handleShare();
              logEvent({
                type: 'EVENT_MODULE',
                name: 'REFERRAL_SHARED',
                data: referralData,
              });
            }}
          >
            {t('shareLinkButton')}
          </Button>
        </Wrapper>
      </Animated>
    </Wrapper>
  );
};

export default ReferralDrawer;
