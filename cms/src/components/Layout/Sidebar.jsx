import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart,
  Cog,
  ChevronDown,
  FolderCog,
  BookOpenCheck,
  Flame,
  ChartCandlestick,
  Workflow,
  BaggageClaim,
  LandPlot,
} from 'lucide-react';
import apiClient from '../../api/apiClient';

const iconComponents = {
  LayoutDashboard,
  Settings,
  Users,
  BarChart,
  Cog,
  ChevronDown,
  FolderCog,
  BookOpenCheck,
  Flame,
  ChartCandlestick,
  Workflow,
  BaggageClaim,
  LandPlot,
};

const complaintsLinks = [
  { to: '/complaints/add-complaints', label: 'Add Complaints', page: 'complaints', action: 'add' },
  { to: '/complaints/view-complaints', label: 'View Complaints', page: 'complaints', action: 'view' },
];
const bluebrigadeLinks = [
  { to: '/bluebrigade/consumer', label: 'Consumer', page: 'bluebrigade', action: 'view' },
  { to: '/bluebrigade/general', label: 'General', page: 'bluebrigade', action: 'view' },
];
const runningcontractLinks = [
  { to: '/runningcontract/rcconsumer', label: 'Consumer', page: 'runningcontract', action: 'view' },
  { to: '/runningcontract/rcgeneral', label: 'General', page: 'runningcontract', action: 'view' },
];
const valvesLinks = [
  { to: '/valves/add-valves', label: 'Add Valves', page: 'valves', action: 'add' },
  { to: '/valves/view-valves', label: 'View Valves', page: 'valves', action: 'view' },
];
const userManagementLinks = [
  { to: '/user-roles', label: 'User Roles', page: 'user_management', action: 'view' },
  { to: '/roles', label: 'Roles', page: 'role', action: 'view' },
  { to: '/permissions', label: 'Permissions', page: 'permission', action: 'view' },
];

const Dropdown = ({ label, links, icon, permissions, isSuperadmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconComponents[icon];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const filteredLinks = links.filter((link) => {
    if (isSuperadmin) return true;
    const perm = permissions.find((p) => p.page === link.page);
    return perm && perm[`can_${link.action}`];
  });

  if (filteredLinks.length === 0) return null;

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleDropdown}
        className="text-sm font-medium group flex items-center p-2 rounded-xs transition-all duration-200 relative overflow-hidden text-gray-800 w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <IconComponent className="w-5 h-5 mr-3 transition-colors duration-300" />
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute right-0"
        >
          <ChevronDown className="w-4 h-4 ml-2" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: {
                opacity: 1,
                height: 'auto',
                transition: {
                  duration: 0.3,
                  when: 'beforeChildren',
                  staggerChildren: 0.05,
                },
              },
              exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
            }}
            className="w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto mt-2"
          >
            {filteredLinks.map((link) => (
              <motion.div key={link.to} variants={dropdownVariants}>
                <NavLink
                  to={link.to}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    apiClient
      .get('/auth/profile/')
      .then((response) => {
        const userRole = response.data.role?.name;
        setIsSuperadmin(response.data.is_superuser || userRole === 'Superadmin');
        if (response.data.role?.id) {
          apiClient
            .get(`/auth/roles/${response.data.role.id}/`)
            .then((res) => {
              setPermissions(res.data.permissions || []);
              console.log('Sidebar Permissions:', res.data.permissions);
            })
            .catch((error) => {
              console.error('Failed to fetch permissions:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Failed to fetch profile:', error);
      });
  }, []);

  const handleItemClick = (to) => {
    setActiveItem(to);
  };

  const handleExternalLink = (url) => {
    window.location.href = url;
  };

  const sidebarVariants = {
    open: {
      width: 300,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      width: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  const navigationItems = [
    {
      type: 'link',
      to: '/',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      page: 'dashboard',
      action: 'view',
      activeStyles: { background: 'bg-blue-50', text: 'text-blue-800' },
      inactiveStyles: { text: 'text-gray-800' },
      hoverStyles: { background: 'bg-gray-100', text: 'text-gray-800' },
    },
    {
      type: 'dropdown',
      label: 'Complaints',
      icon: 'BookOpenCheck',
      links: complaintsLinks,
      page: 'complaints',
    },
    {
      type: 'dropdown',
      label: 'Bluebrigade',
      icon: 'Flame',
      links: bluebrigadeLinks,
      page: 'bluebrigade',
    },
    {
      type: 'dropdown',
      label: 'RunningContract',
      icon: 'BaggageClaim',
      links: runningcontractLinks,
      page: 'runningcontract',
    },
    {
      type: 'dropdown',
      label: 'Valves',
      icon: 'ChartCandlestick',
      links: valvesLinks,
      page: 'valves',
    },
    {
      type: 'link',
      to: '/area',
      label: 'Area',
      icon: 'LandPlot',
      page: 'area',
      action: 'view',
      activeStyles: { background: 'bg-blue-50', text: 'text-blue-800' },
      inactiveStyles: { text: 'text-gray-800' },
      hoverStyles: { background: 'bg-gray-100', text: 'text-gray-800' },
    },
    {
      type: 'external',
      url: 'http://61.2.215.3:3002/Dashboard/RTUDashboard/47',
      label: 'Flows',
      icon: 'Workflow',
      page: 'flows',
      action: 'view',
      activeStyles: { background: 'bg-blue-50', text: 'text-blue-800' },
      inactiveStyles: { text: 'text-gray-800' },
      hoverStyles: { background: 'bg-gray-100', text: 'text-gray-800' },
    },
    {
      type: 'link',
      to: '/profile',
      label: 'Profile Settings',
      icon: 'Settings',
      page: 'profile',
      action: 'view',
      activeStyles: { background: 'bg-blue-50', text: 'text-blue-800' },
      inactiveStyles: { text: 'text-gray-800' },
      hoverStyles: { background: 'bg-gray-100', text: 'text-gray-800' },
    },
    {
      type: 'dropdown',
      label: 'User Management',
      icon: 'Users',
      links: userManagementLinks,
      page: 'user_management',
      superadminOnly: true,
    },
  ];

  return (
    <motion.aside
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed top-16 bottom-0 bg-white shadow-md overflow-hidden flex flex-col z-40"
    >
      <motion.div
        className="h-full p-4 pt-4 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            if (item.superadminOnly && !isSuperadmin) return null;

            const perm = permissions.find((p) => p.page === item.page);
            if (item.type === 'link' && (!perm || !perm[`can_${item.action}`]) && !isSuperadmin)
              return null;
            if (item.type === 'external' && (!perm || !perm[`can_${item.action}`]) && !isSuperadmin)
              return null;

            if (item.type === 'link') {
              const IconComponent = iconComponents[item.icon];
              return (
                <motion.div
                  key={item.to}
                  custom={index}
                  initial="hidden"
                  animate={isOpen ? 'visible' : 'hidden'}
                  variants={itemVariants}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => handleItemClick(item.to)}
                    className={({ isActive }) =>
                      `text-sm font-medium group flex items-center p-2 rounded-xs transition-all duration-200 relative overflow-hidden ${
                        activeItem === item.to || isActive
                          ? `${item.activeStyles.background} ${item.activeStyles.text}`
                          : item.inactiveStyles.text
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <motion.div
                          className={`absolute inset-0 ${item.hoverStyles.background}`}
                          initial={{ opacity: 0 }}
                          whileHover={{
                            opacity: activeItem === item.to || isActive ? 0 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="relative flex items-center">
                          <IconComponent
                            className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                              activeItem === item.to || isActive
                                ? item.activeStyles.text
                                : `${item.inactiveStyles.text} group-hover:${item.hoverStyles.text}`
                            }`}
                          />
                          <span
                            className={`${
                              activeItem === item.to || isActive
                                ? item.activeStyles.text
                                : `${item.inactiveStyles.text} group-hover:${item.hoverStyles.text}`
                            } transition-colors duration-300`}
                          >
                            {item.label}
                          </span>
                        </div>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            } else if (item.type === 'dropdown') {
              return (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate={isOpen ? 'visible' : 'hidden'}
                  variants={itemVariants}
                >
                  <Dropdown
                    label={item.label}
                    links={item.links}
                    icon={item.icon}
                    permissions={permissions}
                    isSuperadmin={isSuperadmin}
                  />
                </motion.div>
              );
            } else if (item.type === 'external') {
              const IconComponent = iconComponents[item.icon];
              return (
                <motion.div
                  key={item.url}
                  custom={index}
                  initial="hidden"
                  animate={isOpen ? 'visible' : 'hidden'}
                  variants={itemVariants}
                >
                  <button
                    onClick={() => handleExternalLink(item.url)}
                    className={`text-sm font-medium group flex items-center p-2 rounded-xs transition-all duration-200 relative overflow-hidden w-full ${
                      activeItem === item.url
                        ? `${item.activeStyles.background} ${item.activeStyles.text}`
                        : item.inactiveStyles.text
                    }`}
                  >
                    <motion.div
                      className={`absolute inset-0 ${item.hoverStyles.background}`}
                      initial={{ opacity: 0 }}
                      whileHover={{
                        opacity: activeItem === item.url ? 0 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative flex items-center">
                      <IconComponent
                        className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                          activeItem === item.url
                            ? item.activeStyles.text
                            : `${item.inactiveStyles.text} group-hover:${item.hoverStyles.text}`
                        }`}
                      />
                      <span
                        className={`${
                          activeItem === item.url
                            ? item.activeStyles.text
                            : `${item.inactiveStyles.text} group-hover:${item.hoverStyles.text}`
                        } transition-colors duration-300`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </button>
                </motion.div>
              );
            }
            return null;
          })}
        </nav>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;