import React, { useContext, useEffect } from 'react';
import classnames from 'classnames';
import { HeaderSideNavItems, SideNav, SideNavItems } from 'carbon-components-react';
import { useNavItems } from 'gatsby-theme-carbon/src/components/LeftNav/LeftNavItemProvider';
import NavContext from 'gatsby-theme-carbon/src/util/context/NavContext';
import LeftNavItem from 'gatsby-theme-carbon/src/components/LeftNav/LeftNavItem';
import LeftNavHeaderMenus from '../Header/LeftNavHeaderMenus';

import Title from './Title';
import Content from '../Header/Content';
import { sideNav } from './LeftNav.module.scss';

const LeftNav = ({ location, homepage }) => {
  let { leftNavIsOpen } = useContext(NavContext);

  let navItems = useNavItems();

  useEffect(() => {
    leftNavIsOpen = !!navItems.length;
  }, [navItems]);

  if (!location) {
    return '';
  }

  const { pathname } = location;
  let mainPathName = '';
  const availableMainPaths = {
    'api-basics': 'API basics',
    'channel-api': 'Channel API',
    'viewer-authentication-api': 'Viewer Authentication API',
    'player-api': 'Player API',
    'analytics-api': 'Analytics API',
    'broadcaster-sdk': 'Broadcaster SDK',
    'player-sdk': 'Player SDK',
  };

  Object.keys(availableMainPaths).forEach((availableMainPath) => {
    if (pathname.indexOf(availableMainPath) >= 0) {
      mainPathName = availableMainPath;
    }
  });

  let title = null;

  if (mainPathName) {
    title = availableMainPaths[mainPathName];
  }

  if (pathname.indexOf(`/${mainPathName}`) >= 0 && mainPathName) {
    navItems = navItems.filter((item) => {
      let showMainMenu = false;
      const { pages } = item;

      pages.forEach((subItem) => {
        const showSubMenu = subItem.path.indexOf(`/${mainPathName}`) === 0;

        if (showSubMenu) {
          showMainMenu = true;
        }
      });

      return showMainMenu;
    });
  } else {
    navItems = Content;
  }

  const renderNavItems = () =>
    navItems.map((item, i) => <LeftNavItem items={item.pages} category={item.title} key={i} />);

  if (!navItems.length && !leftNavIsOpen) {
    return '';
  }

  // TODO: replace old addon website styles with sass modules, move to wrapper
  return (
    <SideNav
      expanded={leftNavIsOpen}
      aria-label="Side navigation"
      className={classnames(
        {
          'bx--side-nav--website': true,
          'bx--side-nav--website--light': !homepage,
        },
        sideNav
      )}
    >
      <SideNavItems>
        <HeaderSideNavItems>
          <LeftNavHeaderMenus />
        </HeaderSideNavItems>
        {title && <Title>{title}</Title>}
        {renderNavItems()}
      </SideNavItems>
    </SideNav>
  );
};

export default LeftNav;
