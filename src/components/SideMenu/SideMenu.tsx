import React, { useCallback, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalContext } from 'context';
import Menu from './styles';
import Image from 'components/Image';
import DrawerMask from 'components/DrawerMask';
import brijLogo from 'assets/logos/svg/brij.svg';
import { ReactComponent as Logout } from 'assets/icons/svg/log-out.svg';
import { ReactComponent as Profile } from 'assets/icons/svg/person.svg';
import { ReactComponent as Close } from 'assets/icons/svg/close-white.svg';
import { ReactComponent as External } from 'assets/icons/svg/external.svg';
import { ReactComponent as Collection } from 'assets/icons/svg/collection.svg';

const SideMenu: React.FC = () => {
  const location = useLocation();
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);

  const handleLogoutButtonClicked = useCallback(() => {
    setIsMenuOpen(false);
    // logout the user

    // logout();
  }, [setIsMenuOpen]);
  // }, [logout, setIsMenuOpen]);

  return (
    <>
      <DrawerMask
        isDrawerOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        zIndex={9}
      />

      <Menu isMenuOpen={isMenuOpen}>
        <div>
          <span>
            <button onClick={() => setIsMenuOpen(false)}>
              <Close />
            </button>
          </span>
          <nav>
            <Link to='/profile' onClick={() => setIsMenuOpen(false)}>
              My Profile
              <Profile />
            </Link>
            {location.pathname !== '/collection' ? (
              <>
                <Link to='/collection' onClick={() => setIsMenuOpen(false)}>
                  My Collection
                  <Collection />
                </Link>
                <a
                  href='https://www.gucci.com/us/en/'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Visit Website
                  <External />
                </a>
              </>
            ) : (
              <></>
            )}
            <Link to='/' onClick={handleLogoutButtonClicked}>
              Sign Out
              <Logout />
            </Link>
          </nav>
          <span>
            <Image width="auto" src={brijLogo} alt='Brij logo' />
          </span>
        </div>
      </Menu>
    </>
  );
};

export default SideMenu;
