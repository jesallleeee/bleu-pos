import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admin/discounts.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaBell, FaFolderOpen, FaEdit, FaArchive, FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { DEFAULT_PROFILE_IMAGE } from "./employeeRecords";

const currentDate = new Date().toLocaleString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

function Discounts() {
  const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({ role: "User", name: "Current User" });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const [editingDiscountId, setEditingDiscountId] = useState(null);
  const [viewingDiscount, setViewingDiscount] = useState(null);
  const navigate = useNavigate();

  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      name: "Valentine's Day Special",
      discount: "15%",
      minSpend: 500,
      application: "Foods & Drinks",
      validFrom: "2025-02-01",
      validTo: "2025-02-14",
      status: "Active",
    },
    {
      id: 2,
      name: "Back to School",
      discount: "₱50",
      minSpend: 500,
      application: "Foods & Drinks",
      validFrom: "2025-02-01",
      validTo: "2025-02-14",
      status: "Active",
    },
  ]);

  useEffect(() => {
    const todayISO = new Date().toISOString().split("T")[0];
    setDiscounts(prev =>
      prev.map(d => {
        if (d.status === "Active" && d.validTo < todayISO) {
          return { ...d, status: "Inactive" };
        }
        return d;
      })
    );
  }, []);

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    discountName: '',
    appliesTo: '',
    discountPercentage: '',
    minSpend: '',
    validFrom: '',
    validTo: '',
  });

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const getAuthToken = () => localStorage.getItem("access_token");

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setLoggedInUserDisplay({
          name: decodedToken.sub || "Current User",
          role: decodedToken.role || "User",
        });
      } catch (error) {
        console.error("Error decoding token for display:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleDiscountModalOpen = () => setShowDiscountModal(true);
  const handleDiscountModalClose = () => {
    setShowDiscountModal(false);
    setDiscountForm({
      discountName: "",
      discountPercentage: "",
      discountCode: "",
      status: "",
      validFrom: "",
      validTo: "",
    });
  };

  const handleDiscountFormChange = (e) => {
    const { name, value } = e.target;
    setDiscountForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDiscount = () => {
    if (editingDiscountId !== null) {
      // Edit existing discount
      setDiscounts(discounts.map(d => {
        if (d.id === editingDiscountId) {
          return {
            ...d,
            name: discountForm.discountName,
            discount: `${discountForm.discountPercentage}%`,  // or handle "₱" logic if needed
            minSpend: discountForm.minSpend,
            application: discountForm.appliesTo,
            validFrom: discountForm.validFrom,
            validTo: discountForm.validTo,
            status: discountForm.status === "active" ? "Active" : "Inactive",
          };
        }
        return d;
      }));
    } else {
      // Add new discount
      const newId = discounts.length + 1;
      const newDiscount = {
        id: newId,
        name: discountForm.discountName,
        discount: `${discountForm.discountPercentage}%`,
        minSpend: discountForm.minSpend || 0,
        application: discountForm.appliesTo,
        validFrom: discountForm.validFrom,
        validTo: discountForm.validTo,
        status: discountForm.status === "active" ? "Active" : "Inactive",
      };
      setDiscounts([...discounts, newDiscount]);
    }

    setEditingDiscountId(null);
    handleDiscountModalClose();
  };

  const handleEditClick = (discount) => {
    setEditingDiscountId(discount.id);
    setDiscountForm({
      discountName: discount.name,
      appliesTo: discount.application,
      discountPercentage: parseInt(discount.discount), // Assuming discount is "15%" or "₱50"
      minSpend: discount.minSpend,
      validFrom: discount.validFrom,
      validTo: discount.validTo,
      status: discount.status.toLowerCase(), // "active" or "inactive"
    });
    setShowDiscountModal(true);
  };

  const handleViewClick = (discount) => {
    setViewingDiscount(discount);
  };

  const handleDeleteClick = (discount) => {
    if (discount.status === "Active") {
      // Soft-delete: mark as inactive
      setDiscounts(prev =>
        prev.map(d =>
          d.id === discount.id ? { ...d, status: "Inactive" } : d
        )
      );
    } else {
      // Already inactive, just delete it
      setDiscounts(prev => prev.filter(d => d.id !== discount.id));
    }
  };

  const discountList = [
    {
      name: "NAME",
      selector: row => row.name,
      sortable: true,
      width: "15%",
    },
    {
      name: "DISCOUNT",
      selector: row => row.discount,
      sortable: true,
      width: "12%",
    },
    {
      name: "MIN. SPEND",
      selector: row => `₱${row.minSpend}`,
      sortable: true,
      width: "12%",
    },
    {
      name: "APPLICATION",
      selector: row => row.application,
      width: "15%",
    },
    {
      name: "VALID PERIOD",
      selector: row => `${row.validFrom} - ${row.validTo}`,
      width: "15%",
    },
    {
      name: "STATUS",
      cell: row => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>{row.status}</span>
      ),
      center: true,
      width: "16%",
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div className="action-buttons">
          <button className="view-button" onClick={() => handleViewClick(row)}><FaFolderOpen /></button>
          <button className="edit-button" onClick={() => handleEditClick(row)}><FaEdit /></button>
          <button className="delete-button"onClick={() => handleDeleteClick(row)}><FaArchive /></button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: "15%",
    },
  ];

  const filteredDiscounts = discounts.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (applicationFilter === "" || d.application === applicationFilter) &&
    (statusFilter === "" || d.status === statusFilter)
  );

  const handleRowClick = (row) => {
    if (row.status === "Inactive") {
      // Delete discount from list
      setDiscounts(prev => prev.filter(d => d.id !== row.id));
    } else {
      // Show view modal or do nothing
      handleViewClick(row);
    }
  };

  return (
    <div className="mng-discounts">
      <Sidebar />
      <div className="discounts">
        <header className="header">
          <div className="header-left">
            <h2 className="page-title">Discounts</h2>
          </div>
          <div className="header-right">
            <div className="header-date">{currentDate}</div>
            <div className="header-profile">
              <div className="profile-left">
                <div
                  className="profile-pic"
                  style={{ backgroundImage: `url(${DEFAULT_PROFILE_IMAGE})` }}
                ></div>
                <div className="profile-info">
                  <div className="profile-role">Hi! I'm {loggedInUserDisplay.role}</div>
                  <div className="profile-name">{loggedInUserDisplay.name}</div>
                </div>
              </div>
              <div className="profile-right">
                <div className="dropdown-icon" onClick={toggleDropdown}>
                  <FaChevronDown />
                </div>
                <div className="bell-icon">
                  <FaBell className="bell-outline" />
                </div>
              </div>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <ul><li onClick={handleLogout}>Logout</li></ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="discounts-content">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search Discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={applicationFilter} onChange={(e) => setApplicationFilter(e.target.value)}>
              <option value="">Application: All</option>
              <option value="Foods & Drinks">Foods & Drinks</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Status: All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="add-btn" onClick={handleDiscountModalOpen}>
              <FaPlus /> Add Discount
            </button>
          </div>

          {showDiscountModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>Add Discount</h2>
                  <button className="modal-close" onClick={handleDiscountModalClose}>×</button>
                </div>
                <div className="modal-body">
                  <form className="form-grid" onSubmit={(e) => { e.preventDefault(); handleSaveDiscount(); }}>
                    
                    <label>
                      Discount Name
                    </label>
                    <input
                      type="text"
                      name="discountName"
                      placeholder="Enter discount name"
                      value={discountForm.discountName}
                      onChange={handleDiscountFormChange}
                      required
                    />

                    <label>
                      Applies To
                    </label>
                    <input
                      type="text"
                      name="appliesTo"
                      placeholder="e.g. Food, Drinks, Merchandise"
                      value={discountForm.appliesTo}
                      onChange={handleDiscountFormChange}
                      required
                    />

                    <div className="row">
                      <div>
                        <label>Percentage</label>
                        <input
                          type="number"
                          name="discountPercentage"
                          placeholder="Enter percentage"
                          value={discountForm.discountPercentage}
                          onChange={handleDiscountFormChange}
                          required
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label>Minimum Spend</label>
                        <input
                          type="number"
                          name="minSpend"
                          placeholder="Enter minimum spend"
                          value={discountForm.minSpend}
                          onChange={handleDiscountFormChange}
                          min="0"
                        />
                      </div>
                    </div>

                     <div className="row">
                      <div>
                        <label>Valid From</label>
                        <input
                          type="date"
                          name="validFrom"
                          value={discountForm.validFrom}
                          onChange={handleDiscountFormChange}
                          min={today}  // <-- restrict to today or future dates
                        />
                      </div>
                      <div>
                        <label>Valid Until</label>
                        <input
                          type="date"
                          name="validTo"
                          value={discountForm.validTo}
                          onChange={handleDiscountFormChange}
                          min={discountForm.validFrom || today}
                        />
                      </div>
                    </div>
                    <button type="submit" className="save-btn">Save Discount</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {viewingDiscount && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>View Discount</h2>
                <button className="modal-close" onClick={() => setViewingDiscount(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <label>Discount Name</label>
                  <input type="text" value={viewingDiscount.name} readOnly />

                  <label>Applies To</label>
                  <input type="text" value={viewingDiscount.application} readOnly />

                  <div className="row">
                    <div>
                      <label>Discount</label>
                      <input type="text" value={viewingDiscount.discount} readOnly />
                    </div>
                    <div>
                      <label>Minimum Spend</label>
                      <input type="text" value={`₱${viewingDiscount.minSpend}`} readOnly />
                    </div>
                  </div>

                  <div className="row">
                    <div>
                      <label>Valid From</label>
                      <input type="date" value={viewingDiscount.validFrom} readOnly />
                    </div>
                    <div>
                      <label>Valid Until</label>
                      <input type="date" value={viewingDiscount.validTo} readOnly />
                    </div>
                  </div>

                  <label>Status</label>
                  <input type="text" value={viewingDiscount.status} readOnly />
                </div>
              </div>
            </div>
          </div>
        )}

          <DataTable
            columns={discountList}
            data={filteredDiscounts}
            onRowClicked={handleRowClick}
            striped
            highlightOnHover
            responsive
            pagination
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: "#4B929D",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                  padding: "12px",
                  textTransform: "uppercase",
                  textAlign: "center",
                  letterSpacing: "1px",
                },
              },
              rows: {
                style: {
                  minHeight: "55px",
                  padding: "5px",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Discounts;
