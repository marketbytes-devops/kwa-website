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
  Search,
  Link,
  Repeat,
} from 'lucide-react';
import apiClient from '../../api/apiClient';

// Unified icon mapping
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
  Search,
  Link,
  Repeat,
};

// Link definitions
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
  { to: '/user-roles', label: 'Users', page: 'user_management', action: 'view' },
  { to: '/roles', label: 'Roles', page: 'role', action: 'view' },
  { to: '/permissions', label: 'Permissions', page: 'permission', action: 'view' },
];
const connectionLinks = [
  { to: '/e-tap/connection/type', label: 'Connection Type', page: 'e-tapp', action: 'view', icon: 'Link' },
  { to: '/e-tap/connection/add', label: 'New Connection', page: 'e-tapp', action: 'add', icon: 'Link' },
  { to: '/e-tap/connection/view', label: 'View Connection', page: 'e-tapp', action: 'view', icon: 'Link' },
];
const conversionLinks = [
  { to: '/e-tap/conversion/add', label: 'Add New Applications', page: 'e-tapp', action: 'add', icon: 'Repeat' },
  { to: '/e-tap/conversion/view', label: 'View Applications', page: 'e-tapp', action: 'view', icon: 'Repeat' },
];
const eTapLinks = [
  {
    type: 'external',
    url: 'https://etapp.kwa.kerala.gov.in/login/staff',
    label: 'E-Tap Portal',
    page: 'e-tapp',
    action: 'view',
  },
  { type: 'dropdown', label: 'Connection', icon: 'Link', links: connectionLinks, page: 'e-tapp', action: 'view' },
  { type: 'dropdown', label: 'Conversion', icon: 'Repeat', links: conversionLinks, page: 'e-tapp', action: 'view' },
];

// Extract unique pages for export
export const pages = [
  ...new Set([
    'dashboard',
    'profile',
    'user_management',
    'role',
    'permission',
    'complaints',
    'valves',
    'area',
    'flows',
    'bluebrigade',
    'runningcontract',
    'e-tapp',
  ]),
];

// Dropdown component with improved styling
const Dropdown = ({ label, links, icon, permissions, isSuperadmin, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconComponents[icon] || Cog;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const filteredLinks = links.filter((link) => {
    if (isSuperadmin) return true;
    const perm = permissions.find((p) => p.page === link.page);
    return perm && perm[`can_${link.action}`];
  });

  if (filteredLinks.length === 0) return null;

  return (
    <div className={`relative ${level > 0 ? 'ml-6' : ''}`}>
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center w-full p-3 text-sm font-medium text-gray-800 hover:bg-gradient-to-r from-blue-50 to-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600 transition-colors" />
        <span className="flex-1 text-left font-semibold text-gray-800">{label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1 bg-white border border-gray-100 rounded-lg shadow-lg"
          >
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.to || link.url}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="group"
              >
                {link.type === 'external' ? (
                  <button
                    onClick={() => window.open(link.url, '_blank')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r from-blue-50 to-white hover:text-blue-800 rounded-md transition-all duration-200"
                  >
                    {link.label}
                  </button>
                ) : link.type === 'dropdown' ? (
                  <Dropdown
                    label={link.label}
                    links={link.links}
                    icon={link.icon}
                    permissions={permissions}
                    isSuperadmin={isSuperadmin}
                    level={level + 1}
                  />
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-100 to-white text-gray-900 font-semibold shadow-inner'
                          : 'text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white hover:text-blue-800'
                      } rounded-md transition-all duration-200`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center">
                        {iconComponents[link.icon] && React.createElement(iconComponents[link.icon], {
                          className: `w-4 h-4 mr-2 ${
                            isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-blue-600'
                          }`,
                        })}
                        <span>{link.label}</span>
                      </div>
                    )}
                  </NavLink>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Section component for grouping navigation items
const Section = ({ title, children, isOpen, toggleOpen }) => (
  <div className="mb-4">
    <button
      onClick={toggleOpen}
      className="flex items-center w-full px-3 py-2 text-xs font-semibold text-gray-800 uppercase tracking-wide bg-gradient-to-r from-gray-50 to-white hover:bg-gray-100 rounded-md shadow-sm transition-all duration-200"
    >
      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
        <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
      </motion.div>
      {title}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionStates, setSectionStates] = useState({
    core: true,
    operations: true,
    admin: true,
    etap: true,
  });

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

  const toggleSection = (section) => {
    setSectionStates((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasPermission = (page, action) => {
    if (isSuperadmin) return true;
    const perm = permissions.find((p) => p.page === page);
    return perm && perm[`can_${action}`];
  };

  const navigationItems = [
    {
      section: 'core',
      items: [
        {
          type: 'link',
          to: '/',
          label: 'Dashboard',
          icon: 'LayoutDashboard',
          page: 'dashboard',
          action: 'view',
        },
        {
          type: 'link',
          to: '/profile',
          label: 'Profile Settings',
          icon: 'Settings',
          page: 'profile',
          action: 'view',
        },
      ],
    },
    {
      section: 'operations',
      items: [
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
          label: 'Running Contract',
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
        },
        {
          type: 'external',
          url: 'http://61.2.215.3:3002/Dashboard/RTUDashboard/47',
          label: 'Flows',
          icon: 'Workflow',
          page: 'flows',
          action: 'view',
        },
      ],
    },
    {
      section: 'admin',
      superadminOnly: true,
      items: [
        {
          type: 'dropdown',
          label: 'User Management',
          icon: 'Users',
          links: userManagementLinks,
          page: 'user_management',
        },
      ],
    },
    {
      section: 'etap',
      superadminOnly: true,
      items: [
        {
          type: 'dropdown',
          label: 'E-Tap',
          icon: 'FolderCog',
          links: eTapLinks,
          page: 'e-tapp',
        },
      ],
    },
  ];

  const filteredNavigationItems = navigationItems.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (section.superadminOnly && !isSuperadmin) return false;
      if (item.type === 'link' || item.type === 'external') {
        return hasPermission(item.page, item.action);
      }
      return true; // Dropdowns are filtered internally
    }),
  })).filter((section) => section.items.length > 0);

  const sidebarVariants = {
    open: { width: 280, opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { width: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <motion.aside
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed top-16 bottom-0 bg-gradient-to-b from-gray-50 to-white shadow-lg z-40 flex flex-col overflow-hidden"
    >
      <motion.div
        className="flex-grow p-4 pt-6 overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm text-gray-800 placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4">
          {filteredNavigationItems.map((section) => (
            <Section
              key={section.section}
              title={section.section.charAt(0).toUpperCase() + section.section.slice(1)}
              isOpen={sectionStates[section.section]}
              toggleOpen={() => toggleSection(section.section)}
            >
              {section.items.map((item, index) => {
                if (searchQuery && !item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null;
                }
                return item.type === 'link' ? (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setActiveItem(item.to)}
                      className={({ isActive }) =>
                        `flex items-center p-3 text-sm font-medium rounded-lg ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-100 to-white text-gray-900 font-semibold shadow-inner'
                            : 'text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white hover:text-blue-800'
                        } transition-all duration-200`
                      }
                      title={item.label}
                    >
                      {({ isActive }) => (
                        <>
                          {iconComponents[item.icon] &&
                            React.createElement(iconComponents[item.icon], {
                              className: `w-5 h-5 mr-3 ${
                                isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-blue-600'
                              }`,
                            })}
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ) : item.type === 'external' ? (
                  <motion.div
                    key={item.url}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className={`flex items-center p-3 text-sm font-medium w-full text-left rounded-lg ${
                        activeItem === item.url
                          ? 'bg-gradient-to-r from-blue-100 to-white text-gray-900 font-semibold shadow-inner'
                          : 'text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white hover:text-blue-800'
                      } transition-all duration-200`}
                      title={item.label}
                    >
                      {iconComponents[item.icon] &&
                        React.createElement(iconComponents[item.icon], {
                          className: `w-5 h-5 mr-3 ${
                            activeItem === item.url ? 'text-gray-900' : 'text-gray-500 group-hover:text-blue-600'
                          }`,
                        })}
                      <span>{item.label}</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
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
              })}
            </Section>
          ))}
        </nav>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;