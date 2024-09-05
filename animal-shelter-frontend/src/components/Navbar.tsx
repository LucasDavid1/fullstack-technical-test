import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { NavLink, useNavigate } from 'react-router-dom';
import { UnstyledButton, Tooltip, rem, Group, Text } from '@mantine/core'; 
import { IconHome2, IconLogout, IconSettings } from '@tabler/icons-react';
import classes from './Navbar.module.css';


const Navbar: React.FC = () => {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLinkClick = (label: string, to: string) => {
    setActive(label);
    if (label === 'Logout') {
      logout(); 
      navigate(to);
    }
  };

  const adminLinks = [
    { icon: IconHome2, label: 'Home', to: '/' },
    { icon: IconSettings, label: 'Admin Management', to: '/admin' },
    { icon: IconLogout, label: 'Logout', to: '/login' },
  ];

  const nonAdminLinks = [
    { icon: IconHome2, label: 'Home', to: '/' },
    { icon: IconLogout, label: 'Logout', to: '/login' },
  ];

  const navLinks = (user && user.role === 'admin' ? adminLinks : nonAdminLinks).map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        component={NavLink}
        to={link.to}
        onClick={() => handleLinkClick(link.label, link.to)} 
        className={classes.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <nav className={classes.navbar}>
      <Group>
        <Text size="lg">
          Animal Shelter
        </Text>
        {navLinks} 
      </Group>
    </nav>
  );
};

export default Navbar;
