import React, { useState } from "react";
import "../admin/employeeRecords.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaBell, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";

function EmployeeRecords() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const currentDate = new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });

    const employeeData = [
        {
            id: "EMP001",
            name: "Limuel Alcovendas",
            email: "alcovendaslim@gmail.com",
            role: "Admin",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP002",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP003",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP004",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP005",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP006",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP007",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP008",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP009",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Active",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP010",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Manager",
            phone: "09090909090",
            status: "Inactive",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
        {
            id: "EMP011",
            name: "Regie Magtangob",
            email: "magtangobregie@gmail.com",
            role: "Cashier",
            phone: "09090909090",
            status: "Inactive",
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
    ];

    const filteredData = employeeData.filter(emp => {
        return (
            (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (roleFilter ? emp.role === roleFilter : true) &&
            (statusFilter ? emp.status === statusFilter : true)
        );
    });

    const columns = [
        {
            name: "EMPLOYEE",
            selector: row => (
                <div className="employee-info">
                    <img src={row.image} alt="profile" className="employee-photo" />
                    <div>
                        <div className="employee-name">{row.name}</div>
                        <div className="employee-id">{row.id}</div>
                    </div>
                </div>
            ),
            sortable: false,
        },        
        { 
            name: "EMAIL", 
            selector: row => row.email, 
            sortable: false,
        },
        { 
            name: "ROLE", 
            selector: row => row.role, 
            sortable: false,
        },
        { 
            name: "PHONE", 
            selector: row => row.phone,
        },
        {
            name: "STATUS",
            selector: row => (
                <span className={`status-badge ${row.status === "Active" ? "active" : "inactive"}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: "ACTION",
            cell: row => (
                <div className="action-buttons">
                    <button className="edit-button">
                        <FaEdit />
                    </button>
                    <button className="delete-button">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="empRecords">
            <Sidebar /> 
            <div className="employees">
                <header className="header">
                    <div className="header-left">
                        <h2 className="page-title">Employee Records</h2>
                    </div>
                    <div className="header-right">
                        <div className="header-date">{currentDate}</div>
                        <div className="header-profile">
                            <div className="profile-pic"></div>
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

                <div className="empRecords-content">
                    <div className="filter-bar">
                        <input
                            type="text"
                            placeholder="Search Employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="">Role: All</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Status: All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <button className="add-btn" onClick={() => setShowModal(true)}>
                            <FaPlus /> Add Employee
                        </button>
                    </div>

                    {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-border">
                        {/* Fixed header at top */}
                        <div className="modal-header">
                            <h2>Add Employee</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        {/* Centered content area */}
                        <div className="modal-container">
                            <div className="modal-body">
                            <div className="modal-profile-icon">
                                <div className="circle">
                                <span className="plus">+</span>
                                </div>
                            </div>
                            <form className="form-grid">
                                <label>Full Name<span className="required">*</span></label>
                                <input type="text" placeholder="Name" required />

                                <label>Email Address<span className="required">*</span></label>
                                <input type="email" placeholder="Email" required />

                                <label>Phone Number<span className="required">*</span></label>
                                <input type="tel" placeholder="Number" required />

                                <div className="row">
                                <div>
                                    <label>Role<span className="required">*</span></label>
                                    <select required>
                                    <option value="">Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Cashier">Cashier</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Hire Date<span className="required">*</span></label>
                                    <input type="date" required />
                                </div>
                                </div>

                                <button type="submit" className="save-btn">Save Employee</button>
                            </form>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}
                    
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        responsive
                        customStyles={{
                            headCells: {
                                style: {
                                    backgroundColor: '#4B929D',
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    padding: '12px',
                                    textTransform: 'uppercase',
                                    textAlign: 'center',
                                    letterSpacing: '1px',
                                },
                            },
                            header: {
                                style: {
                                    minHeight: '60px',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                },
                            },
                            rows: {
                                style: {
                                    minHeight: '55px',
                                    padding: '5px',
                                },
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default EmployeeRecords;