import React from 'react';
import { Animated } from 'react-animated-css';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { useGlobal } from 'context/global/GlobalContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReferralModuleType } from 'types/ProductDetailsType';
import placeholder from 'assets/images/png/qr-placeholder.png';
import ProgressiveImage from 'react-progressive-image';
import HtmlWrapper from 'components/HtmlWrapper';
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

  const { retractDrawer } = useGlobal();
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
      width='100%'
      direction='column'
      padding='0 0.75rem'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <Text
        fontSize='1rem'
        fontWeight='600'
        margin='1.25rem 3rem 1.25rem 0'
      >
        <h1>{drawerTitle}</h1>
      </Text>
      <Wrapper width='100%' direction='column'>
        <Animated
          animationIn="slideInRight"
          animationOut="slideOutLeft"
          animationInDuration={300}
          animationOutDuration={300}
          animationInDelay={retractDrawer ? 200 : 0}
          isVisible={true}
        >
          <HtmlWrapper
            width='100%'
            gap='0.75rem'
            direction='column'
            dangerouslySetInnerHTML={{ __html: referralData?.details }}
          />
          <Input
            margin='0.75rem 0'
            pointerEvents='none'
            value={referralData?.url}
          />
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
          <Text fontSize='1.125rem' color='#98A3AA' margin='0.75rem 0' textAlign='center'>
            <p>or</p>
          </Text>
          <Wrapper
            width='100%'
            alignItems='center'
            justifyContent='space-between'
            borderRadius='0.75rem'
            background='#F7F7F7'
          >
            <Text
              fontSize='1rem'
              fontWeight='600'
              color='#414149'
              padding='0 0.25rem 0 1rem'
            >
              <p>{t('helpText')}</p>
            </Text>
            <Wrapper
              margin='0.75rem'
              padding='0.5rem'
              maxWidth='45%'
              alignItems='center'
              justifyContent='center'
              background='#FFFFFF'
              borderRadius='0.75rem'
            >
              <ProgressiveImage src={referralData?.qrcode} placeholder={placeholder}>
                {(src: string, loading: boolean) => (
                  <Image
                    src={src}
                    alt='qr-code'
                    width='100%'
                    margin='0.5rem 0 0 0'
                    objectFit='cover'
                    transition='0.3s'
                    opacity={loading ? 0.5 : 1}
                  />
                )}
              </ProgressiveImage>
            </Wrapper>
          </Wrapper>
        </Animated>
      </Wrapper>
    </Wrapper>
  );
};

export default ReferralDrawer;
