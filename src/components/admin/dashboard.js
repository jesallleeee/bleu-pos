import React, { useState } from "react";
import "../admin/dashboard.css";
import Sidebar from "../sidebar";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faChartLine,
  faShoppingCart,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FaChevronDown, FaBell } from "react-icons/fa";

const revenueData = [
  { name: 'Jan', income: 5000, expense: 3000 },
  { name: 'Feb', income: 14000, expense: 10000 },
  { name: 'Mar', income: 15000, expense: 12000 },
  { name: 'Apr', income: 11000, expense: 9000 },
  { name: 'May', income: 13000, expense: 7000 },
  { name: 'June', income: 18000, expense: 10000 },
  { name: 'July', income: 18000, expense: 13000 },
];

const salesData = [
  { name: 'Mon', sales: 60 },
  { name: 'Tue', sales: 95 },
  { name: 'Wed', sales: 70 },
  { name: 'Thu', sales: 25 },
  { name: 'Fri', sales: 60 },
  { name: 'Sat', sales: 68 },
  { name: 'Sun', sales: 63 },
];

const Dashboard = () => {
  const [revenueFilter, setRevenueFilter] = useState("Yearly");
  const [salesFilter, setSalesFilter] = useState("Yearly");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
        <div className="header-left">
            <h2 className="dashboard-title">Dashboard</h2>
        </div>

        <div className="header-right">
            <div className="header-date">SATURDAY, APRIL 12 2025, 11:53:38 AM</div>
            <div className="header-profile">
            <div className="profile-pic" />
            <div className="profile-info">
                <div className="profile-role">Hi! I'm Admin</div>
                <div className="profile-name">Lim Alcovendas</div>
            </div>
            <div className="dropdown-icon" onClick={toggleDropdown}>
            <FaChevronDown />
            </div>
            <div className="bell-icon">
                <FaBell className="bell-outline" />
            </div>
            {isDropdownOpen && (
            <div className="profile-dropdown">
              <ul>
                <li>Edit Profile</li>
                <li>Logout</li>
              </ul>
            </div>
             )}
            </div>
        </div>
        </header>


        <div className="dashboard-cards">
          <div className="card blue">
            <div className="card-icon"><FontAwesomeIcon icon={faMoneyBillWave} /></div>
            <div className="card-text">
              <div className="card-title">Today's Sales</div>
              <div className="card-value">₱28,123.00</div>
              <div className="card-percent green">↑ 10.5%</div>
            </div>
          </div>
          <div className="card green">
            <div className="card-icon"><FontAwesomeIcon icon={faChartLine} /></div>
            <div className="card-text">
              <div className="card-title">Today's Revenue</div>
              <div className="card-value">₱18,003.00</div>
              <div className="card-percent green">↑ 10.5%</div>
            </div>
          </div>
          <div className="card teal">
            <div className="card-icon"><FontAwesomeIcon icon={faShoppingCart} /></div>
            <div className="card-text">
              <div className="card-title">Today's Orders</div>
              <div className="card-value">45</div>
              <div className="card-percent green">↑ 10.5%</div>
            </div>
          </div>
          <div className="card orange">
            <div className="card-icon"><FontAwesomeIcon icon={faClock} /></div>
            <div className="card-text">
              <div className="card-title">Pending Orders</div>
              <div className="card-value">5</div>
            </div>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-box">
            <div className="chart-header">
              <span>Revenue</span>
              <select
                className="chart-dropdown"
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00b4d8" />
                <Line type="monotone" dataKey="expense" stroke="#ff4d6d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <div className="chart-header">
              <span>Sales</span>
              <select
                className="chart-dropdown"
                value={salesFilter}
                onChange={(e) => setSalesFilter(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#00b4d8" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;