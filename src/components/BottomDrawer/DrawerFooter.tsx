import Image from 'components/Image';
import Wrapper from 'components/Wrapper';
import { DrawerIconLink } from './styles';
import phoneCallIcon from 'assets/icons/svg/social-phone-call.svg';
import instagramIcon from 'assets/icons/svg/social-instagram.svg';
import facebookIcon from 'assets/icons/svg/social-facebook.svg';
import twitterIcon from 'assets/icons/svg/social-twitter.svg';
import tiktokIcon from 'assets/icons/svg/social-tiktok.svg';
import emailIcon from 'assets/icons/svg/social-email.svg';

export type SocialsType =
  | {
      phone?: string | undefined;
      email?: string | undefined;
      twitter?: string | undefined;
      instagram?: string | undefined;
      facebook?: string | undefined;
      tiktok?: string | undefined;
    }
  | undefined;

const DrawerFooter = (socials: SocialsType) => {
  return (
    <Wrapper
      width='100%'
      padding='1.5rem 2rem'
      position='relative'
      justifyContent='space-evenly'
      alignItems='center'
      gap='1rem'
    >
      {socials?.phone && (
        <DrawerIconLink href={`tel:+${socials?.phone}`}>
          <Image src={phoneCallIcon} alt='phone-icon' />
        </DrawerIconLink>
      )}
      {socials?.email && (
        <DrawerIconLink href={`mailto:${socials?.email}`}>
          <Image src={emailIcon} alt='email-icon' />
        </DrawerIconLink>
      )}
      {socials?.tiktok && (
        <DrawerIconLink
          href={
            socials?.tiktok.includes('https://') ||
            socials?.tiktok.includes('http://')
              ? socials?.tiktok
              : `https://${socials?.tiktok}`
          }
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image src={tiktokIcon} alt='tiktok-icon' />
        </DrawerIconLink>
      )}
      {socials?.twitter && (
        <DrawerIconLink
          href={
            socials?.twitter.includes('https://') ||
            socials?.twitter.includes('http://')
              ? socials?.twitter
              : `https://${socials?.twitter}`
          }
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image src={twitterIcon} alt='twitter-icon' />
        </DrawerIconLink>
      )}
      {socials?.instagram && (
        <DrawerIconLink
          href={
            socials?.instagram.includes('https://') ||
            socials?.instagram.includes('http://')
              ? socials?.instagram
              : `https://${socials?.instagram}`
          }
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image src={instagramIcon} alt='instagram-icon' />
        </DrawerIconLink>
      )}
      {socials?.facebook && (
        <DrawerIconLink
          href={
            socials?.facebook.includes('https://') ||
            socials?.facebook.includes('http://')
              ? socials?.facebook
              : `https://${socials?.facebook}`
          }
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image src={facebookIcon} alt='facebook-icon' />
        </DrawerIconLink>
      )}
    </Wrapper>
  );
};

export default DrawerFooter;
