import React, { useState, useEffect, useCallback } from "react";
import "./orders.css";
import Navbar from "../navbar";
import DataTable from "react-data-table-component";
import OrderPanel from "./orderPanel";

function Orders() {
  const [activeTab, setActiveTab] = useState("store");
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Remove isPanelOpen state since panel should always be open

  // Initialize store orders from localStorage
  const [storeOrders, setStoreOrders] = useState([]);

  const [onlineOrders, setOnlineOrders] = useState([
    {
      id: "OL-001",
      date: "June 17, 2025 10:18 AM",
      items: 1,
      total: 450.0,
      status: "REQUEST TO ORDER",
      orderItems: [
        {
          name: "Caramel Macchiato",
          size: "Large",
          quantity: 1,
          price: 450,
          extras: [],
        },
      ],
      paymentMethod: "GCash",
      orderType: "Online",
      appliedDiscounts: []
    },
  ]);

  // Helper function to get local date string in YYYY-MM-DD format
  const getLocalDateString = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Helper function to get today's date in local timezone
  const getTodayLocalDate = useCallback(() => {
    return getLocalDateString(new Date());
  }, [getLocalDateString]);

  // Helper function to get the most recent date with orders
  const getMostRecentOrderDate = useCallback((orders) => {
    if (!orders || orders.length === 0) return null;

    const orderDates = orders.map(order => {
      // Use localDateString if available
      if (order.localDateString) {
        return order.localDateString;
      }
      
      // Fallback for orders without localDateString
      try {
        let orderDate;
        
        if (order.date && typeof order.date === 'string') {
          if (order.date.includes('T') || order.date.includes('Z')) {
            orderDate = new Date(order.date);
          } else {
            orderDate = new Date(order.date);
          }
        } else {
          orderDate = new Date(order.date);
        }
        
        if (isNaN(orderDate.getTime())) {
          return null;
        }
        
        return getLocalDateString(orderDate);
      } catch (error) {
        console.error(`Error parsing date for order ${order.id}:`, error);
        return null;
      }
    }).filter(date => date !== null);

    if (orderDates.length === 0) return null;

    // Sort dates in descending order and return the most recent
    return orderDates.sort((a, b) => new Date(b) - new Date(a))[0];
  }, [getLocalDateString]);

  // Load store orders from localStorage on component mount
  useEffect(() => {
    const loadStoreOrders = () => {
      try {
        const existingOrders = JSON.parse(localStorage.getItem('storeOrders') || '[]');
        setStoreOrders(existingOrders);
      } catch (error) {
        console.error('Error loading store orders from localStorage:', error);
        setStoreOrders([]);
      }
    };

    loadStoreOrders();

    // Optional: Set up an interval to periodically check for new orders
    // This ensures the orders page stays updated if transactions happen in another tab
    const interval = setInterval(loadStoreOrders, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to update localStorage when store orders change
  const updateStoreOrdersInStorage = (updatedOrders) => {
    try {
      localStorage.setItem('storeOrders', JSON.stringify(updatedOrders));
      setStoreOrders(updatedOrders);
    } catch (error) {
      console.error('Error saving store orders to localStorage:', error);
    }
  };

  const ordersData = activeTab === "store" ? storeOrders : onlineOrders;

  const filteredData = ordersData.filter(order => {
    const text = searchText.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(text) ||
      order.date.toLowerCase().includes(text) ||
      order.items.toString().includes(text) ||
      order.total.toString().includes(text) ||
      order.status.toLowerCase().includes(text);

    // Fixed date filtering logic with proper timezone handling
    const matchesDate = filterDate
      ? (() => {
          try {
            // For store orders, use the localDateString if available (from CartPanel)
            if (order.localDateString) {
              return order.localDateString === filterDate;
            }
            
            // Fallback for orders without localDateString
            let orderDate;
            
            // Handle different date formats
            if (order.date && typeof order.date === 'string') {
              // Try parsing ISO string first
              if (order.date.includes('T') || order.date.includes('Z')) {
                orderDate = new Date(order.date);
              } else {
                // Handle display format like "June 17, 2025 10:18 AM"
                orderDate = new Date(order.date);
              }
            } else {
              orderDate = new Date(order.date);
            }
            
            // Check if the date is valid
            if (isNaN(orderDate.getTime())) {
              console.warn(`Invalid date format for order ${order.id}: ${order.date}`);
              return false;
            }
            
            // Get the local date string for comparison
            const orderLocalDateString = getLocalDateString(orderDate);
            
            return orderLocalDateString === filterDate;
          } catch (error) {
            console.error(`Error parsing date for order ${order.id}:`, error);
            return false;
          }
        })()
      : true;

    const matchesStatus = filterStatus ? order.status === filterStatus : true;

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Auto-adjust filter date when no orders are found
  useEffect(() => {
    // Only auto-adjust if there are orders available but none match current filters
    if (ordersData.length > 0 && filteredData.length === 0 && !searchText && !filterStatus) {
      const mostRecentDate = getMostRecentOrderDate(ordersData);
      if (mostRecentDate && mostRecentDate !== filterDate) {
        setFilterDate(mostRecentDate);
      }
    }
  }, [ordersData, filteredData, searchText, filterStatus, filterDate, getMostRecentOrderDate]);

  const clearFilters = () => {
    setSearchText("");
    setFilterDate(getTodayLocalDate());
    setFilterStatus("");
  };

  const handleCompleteOrder = (orderId) => {
    if (activeTab === "store") {
      const updatedOrders = storeOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "COMPLETED" }
          : order
      );
      updateStoreOrdersInStorage(updatedOrders);
      
      // Update selected order if it's the one being completed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: "COMPLETED" }));
      }
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    if (activeTab === "online") {
      setOnlineOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } else if (activeTab === "store") {
      // Also handle store order status updates
      const updatedOrders = storeOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      );
      updateStoreOrdersInStorage(updatedOrders);

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  const columns = [
    {
      name: "ORDER ID",
      selector: (row) => row.id,
      sortable: true,
      width: "20%",
    },
    {
      name: "DATE & TIME",
      selector: (row) => {
        // Handle different date formats for display
        let displayDate;
        
        if (row.dateDisplay) {
          // Use the formatted display date from CartPanel if available
          return row.dateDisplay;
        } else if (row.date) {
          // Parse and format the date
          const orderDate = new Date(row.date);
          if (!isNaN(orderDate.getTime())) {
            displayDate = orderDate.toLocaleString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          } else {
            displayDate = row.date; // Fallback to original string
          }
        } else {
          displayDate = "Invalid Date";
        }
        
        return displayDate;
      },
      sortable: true,
      width: "25%",
    },
    {
      name: "ITEMS",
      selector: (row) => `${row.items} Items`,
      sortable: true,
      width: "20%",
    },
    {
      name: "TOTAL",
      selector: (row) => `₱${row.total.toFixed(2)}`,
      sortable: true,
      width: "20%",
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      cell: (row) => (
        <span
        className={`orderpanel-status-badge ${
          row.status === "COMPLETED"
            ? "orderpanel-completed"
            : row.status === "REQUEST TO ORDER"
            ? "orderpanel-request"
            : row.status === "PROCESSING"
            ? "orderpanel-processing"
            : row.status === "FOR PICK UP"
            ? "orderpanel-forpickup"
            : "orderpanel-cancelled"
        }`}
      >
        {row.status}
      </span>

      ),
      width: "15%",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset filters when switching tabs
    setSearchText("");
    setFilterStatus("");
    setFilterDate(getTodayLocalDate());
  };

  // Always set the first order as selected when tab changes or orders change
  useEffect(() => {
    const firstOrder = filteredData[0] || ordersData[0];
    if (firstOrder && (!selectedOrder || !ordersData.find(order => order.id === selectedOrder.id))) {
      setSelectedOrder(firstOrder);
    }
  }, [activeTab, storeOrders, onlineOrders, selectedOrder, ordersData, filteredData]);

  // Set initial filter date when component mounts and when tab changes
  useEffect(() => {
    const currentOrders = activeTab === "store" ? storeOrders : onlineOrders;
    
    if (currentOrders.length > 0) {
      // Check if there are orders for today
      const todayDate = getTodayLocalDate();
      const hasOrdersToday = currentOrders.some(order => {
        if (order.localDateString) {
          return order.localDateString === todayDate;
        }
        
        try {
          let orderDate;
          if (order.date && typeof order.date === 'string') {
            if (order.date.includes('T') || order.date.includes('Z')) {
              orderDate = new Date(order.date);
            } else {
              orderDate = new Date(order.date);
            }
          } else {
            orderDate = new Date(order.date);
          }
          
          if (isNaN(orderDate.getTime())) {
            return false;
          }
          
          return getLocalDateString(orderDate) === todayDate;
        } catch (error) {
          return false;
        }
      });

      if (hasOrdersToday) {
        setFilterDate(todayDate);
      } else {
        // No orders for today, set to most recent date with orders
        const mostRecentDate = getMostRecentOrderDate(currentOrders);
        if (mostRecentDate) {
          setFilterDate(mostRecentDate);
        } else {
          setFilterDate(todayDate);
        }
      }
    } else {
      setFilterDate(getTodayLocalDate());
    }
  }, [activeTab, storeOrders, onlineOrders, getTodayLocalDate, getMostRecentOrderDate, getLocalDateString]);

  return (
    <div className="orders-main-container">
      {/* Panel is always open, so pass true */}
      <Navbar isOrderPanelOpen={true} />
      <div className="orders-content-container orders-panel-open">
        {/* Tabs */}
        <div className="orders-tab-container">
        <button
            className={`orders-tab ${activeTab === "store" ? "active" : ""}`}
            onClick={() => handleTabChange("store")}
        >
            Store
        </button>
        <button
            className={`orders-tab ${activeTab === "online" ? "active" : ""}`}
            onClick={() => handleTabChange("online")}
        >
            Online
        </button>
        </div>

        <div className="orders-filter-bar">
        <input
          type="text"
          placeholder="Search Order ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="orders-filter-input"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="orders-filter-input"
          max={getTodayLocalDate()}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="orders-filter-input"
        >
          <option value="">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="CANCELLED">Cancelled</option>
          {activeTab === "online" && (
            <>
              <option value="REQUEST TO ORDER">Request to Order</option>
              <option value="FOR PICK UP">For Pick Up</option>
            </>
          )}
        </select>
        <button className="orders-clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

        <div className="orders-table-container">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            fixedHeader
            fixedHeaderScrollHeight="60vh"
            conditionalRowStyles={[
              {
                when: row => row.id === selectedOrder?.id, // your active row logic
                style: {
                  backgroundColor: "#e9f9ff",
                  boxShadow: "inset 0 0 0 1px #2a9fbf",
                },
              },
            ]}
            onRowClicked={(row) => {
              setSelectedOrder(row);
              // No need to set isPanelOpen since panel is always open
            }}
            noDataComponent={
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                {activeTab === 'store' 
                  ? 'No store orders found. Orders from the menu will appear here.' 
                  : 'No online orders found.'
                }
              </div>
            }
            customStyles={{
            headCells: {
                style: {
                backgroundColor: "#4B929D",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",     // Increased font size
                padding: "15px",
                textTransform: "uppercase",
                textAlign: "center",
                letterSpacing: "1px",
                },
            },
            header: {
                style: {
                minHeight: "60px",
                paddingTop: "5px",
                paddingBottom: "5px",
                },
            },
            rows: {
                style: {
                minHeight: "60px",
                padding: "10px",
                fontSize: "14px",     // Increased row text size
                color: "#333",
                },
            },
            cells: {
                style: {
                fontSize: "14px",     // Also apply size to individual cells
                },
            },
            }}
          />
          </div>
        {/* Always render the OrderPanel when there's a selected order */}
        {selectedOrder && (
          <OrderPanel
            order={selectedOrder}
            isOpen={true} // Always open
            onClose={() => {
              const firstOrder = filteredData[0] || ordersData[0];
              setSelectedOrder(firstOrder);
            }}
            isStore={activeTab === 'store'}
            onCompleteOrder={handleCompleteOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;