import React from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReferralModuleType } from 'types/ProductDetailsType';
import AnimatedWrapper from 'components/AnimatedWrapper';
import qrcode from 'assets/images/png/qrcode.png';
import logEvent from 'utils/eventLogger';
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
      <AnimatedWrapper direction='LEFT'>
        <Wrapper
          width='100%'
          height='100%'
          direction='column'
          padding='0 0.25rem'
          justifyContent='flex-start'
          alignItems='center'
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
                  eventType: 'EVENT_MODULE',
                  event: 'REFERRAL_COPIED',
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
                  eventType: 'EVENT_MODULE',
                  event: 'REFERRAL_SHARED',
                  data: referralData,
                });
              }}
            >
              {t('shareLinkButton')}
            </Button>
          </Wrapper>
          <Text fontSize='1.125rem' color='#98A3AA' margin='0.75rem 0'>
            <p>or</p>
          </Text>
          <Wrapper
            width='100%'
            responsiveImg

            alignItems='center'
            justifyContent='space-between'
            style={{ background: '#F7F7F7', borderRadius: '12px' }}
          >
            <Text
              fontSize='1rem'
              fontWeight='600'
              color='#414149'
              padding='0 0.25rem 0 1rem'
            >
              <p>{t('helpText')}</p>
            </Text>
            <Image src={qrcode} alt='qr-code' maxWidth='45%' margin='12px' />
          </Wrapper>
        </Wrapper>
      </AnimatedWrapper>
    </Wrapper>
  );
};

export default ReferralDrawer;
