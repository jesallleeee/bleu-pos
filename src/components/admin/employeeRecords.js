import React, { useState, useRef } from "react";
import "../admin/employeeRecords.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaBell, FaEdit, FaArchive , FaPlus, FaFolderOpen } from "react-icons/fa";
import DataTable from "react-data-table-component";

function EmployeeRecords() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [employees, setEmployees] = useState([
        {
            id: "EMP1",
            name: "Limuel Alcovendas",
            email: "limuel.alcovendas@example.com",
            role: "Admin",
            phone: "09171234567",
            status: "Active",
            hireDate: "2023-01-15", // Hire date added
            image: "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__",
        },
    ]);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        hireDate: "",
        status: "Active",
        image: null,
    });
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewEmployee({ ...newEmployee, image: URL.createObjectURL(file) });
        }
    };

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

    const userRole = "Admin";
    const userName = "Lim Alcovendas";

    const handleModalClose = () => {
        setShowModal(false);
        setEditingEmployee(null); // Clear editing employee
        setNewEmployee({
            name: "",
            email: "",
            phone: "",
            role: "",
            hireDate: "",
            status: "Active",
            image: null,
        });
    };

    const handleSaveEmployee = () => {
        if (editingEmployee) {
            // If we are editing an existing employee, update their data in the employee list
            setEmployees(
                employees.map((emp) =>
                    emp.id === editingEmployee.id ? { ...editingEmployee, ...newEmployee } : emp
                )
            );
        } else {
            // If we are adding a new employee, create a new ID and add them to the list
            const newEmployeeData = { ...newEmployee, id: `EMP${employees.length + 1}` };
            setEmployees([...employees, newEmployeeData]);
        }
        handleModalClose(); // Close modal and reset fields
    };

    const handleViewEmployee = (emp) => {
        setViewingEmployee(emp);
    };    

    const handleEditEmployee = (emp) => {
        setEditingEmployee(emp);
        setNewEmployee(emp); // Populate form with the selected employee's data
        setShowModal(true);
    };

    const handleDeleteEmployee = (empId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            const updatedEmployees = employees.filter(emp => emp.id !== empId);
            setEmployees(updatedEmployees);
        }
    };    

    const filteredData = employees.filter(emp => {
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
            width: '18%',
        },
        { 
            name: "EMAIL", 
            selector: row => row.email, 
            sortable: false,
            width: '20%',
        },
        { 
            name: "ROLE", 
            selector: row => row.role, 
            sortable: false,
            width: '12%',
        },
        { 
            name: "PHONE", 
            selector: row => row.phone,
            width: '13%',
        },
        {
            name: "STATUS",
            selector: row => (
                <span className={`status-badge ${row.status === "Active" ? "active" : "inactive"}`}>
                    {row.status}
                </span>
            ),
            width: '12%',
        },
        {
            name: "HIRE DATE",
            selector: row => row.hireDate,
            width: '12%',
        },
        {
            name: "ACTION",
            cell: row => (
                <div className="action-buttons">
                    <button className="view-button" onClick={() => handleViewEmployee(row)}>
                        <FaFolderOpen />
                    </button>
                    <button className="edit-button" onClick={() => handleEditEmployee(row)}>
                        <FaEdit />
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteEmployee(row.id)}>
                        <FaArchive  />
                    </button>
                </div>
            ),
            width: '13%',
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
                                <div className="profile-role">Hi! I'm {userRole}</div>
                                <div className="profile-name">{userName}</div>
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
                        <div className="modal-header">
                            <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>
                            <button className="modal-close" onClick={handleModalClose}>×</button>
                        </div>

                        <div className="modal-container">
                            <div className="modal-body">
                            <div className="profile-upload-wrapper">
                                <div className="profile-upload" onClick={() => fileInputRef.current.click()}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                                {newEmployee.image ? (
                                    <img src={newEmployee.image} alt="Profile" className="profile-image" />
                                ) : (
                                    <div className="upload-placeholder">Upload</div>
                                )}
                                </div>
                            </div>
                            <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
                                <label>Full Name<span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    required
                                />

                                <label>Email Address<span className="required">*</span></label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    required
                                />

                                <label>Phone Number<span className="required">*</span></label>
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                    required
                                />

                                <div className="row">
                                    <div>
                                        <label>Role<span className="required">*</span></label>
                                        <select
                                            value={newEmployee.role}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                            required
                                        >
                                            <option value="">Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Cashier">Cashier</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Hire Date<span className="required">*</span></label>
                                        <input
                                            type="date"
                                            value={newEmployee.hireDate}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="save-btn" onClick={handleSaveEmployee}>
                                    Save Employee
                                </button>
                            </form>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}

                    {viewingEmployee && (
                        <div className="modal-overlay">
                            <div className="modal-border">
                                <div className="modal-header">
                                    <h2>Employee Details</h2>
                                    <button className="modal-close" onClick={() => setViewingEmployee(null)}>×</button>
                                </div>

                                <div className="modal-container">
                                    <div className="modal-body">
                                        <div className="profile-upload-wrapper">
                                            <div className="profile-upload">
                                                {viewingEmployee.image ? (
                                                    <img src={viewingEmployee.image} alt="Profile" className="profile-image" />
                                                ) : (
                                                    <div className="upload-placeholder">No Image</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-grid view-mode">
                                            <div className="row">
                                                <div>
                                                    <label>Employee ID</label>
                                                    <input type="text" value={viewingEmployee.id} disabled />
                                                </div>

                                                <div>
                                                    <label>Full Name</label>
                                                    <input type="text" value={viewingEmployee.name} disabled />
                                                </div>
                                            </div>
                                            <div>
                                                <label>Email Address</label>
                                                <input type="email" value={viewingEmployee.email} disabled />
                                            </div>

                                            <div>
                                                <label>Phone Number</label>
                                                <input type="tel" value={viewingEmployee.phone} disabled />
                                            </div>

                                            <div className="row">
                                                <div>
                                                    <label>Role</label>
                                                    <input type="text" value={viewingEmployee.role} disabled />
                                                </div>
                                                <div>
                                                    <label>Hire Date</label>
                                                    <input type="date" value={viewingEmployee.hireDate} disabled />
                                                </div>
                                            </div>
                                            <div>
                                                <label>Status</label>
                                                <input type="text" value={viewingEmployee.status} disabled />
                                            </div>
                                        </div>
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
