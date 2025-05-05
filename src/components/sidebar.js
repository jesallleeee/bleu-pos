import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import './sidebar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faHome, faChartBar, faFileAlt, faTags, faBoxes,
  faList, faReceipt, faCog, faUserTie, faUsers
} from '@fortawesome/free-solid-svg-icons';

function SidebarComponent() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="sidebar-wrapper">
      {/* Sidebar Panel */}
      <Sidebar collapsed={collapsed} className={`sidebar-container ${collapsed ? 'ps-collapsed' : ''}`}>
        <div className="side-container">
          <div className={`logo-wrapper ${collapsed ? 'collapsed' : ''}`}>
            <img src={logo} alt="Logo" className="logo" />
          </div>

          {!collapsed && <div className="section-title">GENERAL</div>}
          <Menu>
            <MenuItem icon={<FontAwesomeIcon icon={faHome} />} component={<Link to="/admin/dashboard" />}>
              Dashboard
            </MenuItem>

            {!collapsed && <div className="section-title">SALES & ORDERS</div>}
            <MenuItem icon={<FontAwesomeIcon icon={faChartBar} />} component={<Link to="/sales-monitoring" />}>
              Sales Monitoring
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faFileAlt} />} component={<Link to="/transaction-history" />}>
              Transaction History
            </MenuItem>

            {!collapsed && <div className="section-title">PRODUCT MANAGEMENT</div>}
            <MenuItem icon={<FontAwesomeIcon icon={faBoxes} />} component={<Link to="/product-list" />}>
              Product List
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faList} />} component={<Link to="/categories" />}>
              Categories
            </MenuItem>

            {!collapsed && <div className="section-title">PROMOTIONS</div>}
            <MenuItem icon={<FontAwesomeIcon icon={faTags} />} component={<Link to="/manage-discounts" />}>
              Manage Discounts
            </MenuItem>

            {!collapsed && <div className="section-title">REPORTS</div>}
            <MenuItem icon={<FontAwesomeIcon icon={faReceipt} />} component={<Link to="/sales-reports" />}>
              Sales Reports
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faCog} />} component={<Link to="/transaction-reports" />}>
              Transaction Reports
            </MenuItem>

            {!collapsed && <div className="section-title">EMPLOYEES</div>}
            <MenuItem icon={<FontAwesomeIcon icon={faUsers} />} component={<Link to="/employee-records" />}>
              Employee Records
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faUserTie} />} component={<Link to="/role-management" />}>
              Role Management
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>

      {/* TOGGLE BUTTON ON THE RIGHT OF SIDEBAR */}
      <button className="toggle-btn-right" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
}

export default SidebarComponent;
