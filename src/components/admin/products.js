import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admin/products.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaBell } from "react-icons/fa";
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

function Products() {
  const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({
    role: "User",
    name: "Current User",
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("drinks");
  const navigate = useNavigate();

  const [drinkSearch, setDrinkSearch] = useState("");
  const [drinkCategoryFilter, setDrinkCategoryFilter] = useState("");
  const [drinkTypeFilter, setDrinkTypeFilter] = useState("");
  const [drinkSizeFilter, setDrinkSizeFilter] = useState("");

  const [foodSearch, setFoodSearch] = useState("");
  const [foodCategoryFilter, setFoodCategoryFilter] = useState("");

  const [merchSearch, setMerchSearch] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

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

  const drinksList = [
    {
      name: "PRODUCT",
      selector: (row) => row.name,
      cell: (row) => (
        <div className="drink-info">
          <img
            src={row.image || DEFAULT_PROFILE_IMAGE}
            alt={row.name}
            className="drink-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PROFILE_IMAGE;
            }}
          />
          <div>
            <div className="drink-name">{row.name}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "16%",
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      wrap: true,
      width: "20%",
    },
    {
      name: "CATEGORY",
      selector: (row) => row.category,
      center: true,
      sortable: true,
      width: "16%",
    },
    { name: "TYPES", selector: (row) => row.types, center: true, width: "16%" },
    { name: "SIZES", selector: (row) => row.sizes, center: true, width: "16%" },
    { name: "PRICE", selector: (row) => row.price, center: true, width: "16%" },
  ];

  const [drinks] = useState([
    {
      id: 1,
      name: "Americano",
      description:
        "A coffee drink made by adding hot water to espresso.",
      category: "Specialty Coffee",
      types: "Hot & Iced",
      sizes: "12oz & 16oz",
      price: "₱90",
    },
    {
      id: 2,
      name: "Tiramisu Latte",
      description:
        "A coffee drink made by adding hot water to espresso.",
      category: "Barista Choice",
      types: "Iced",
      sizes: "16oz",
      price: "₱129",
    },
    {
      id: 3,
      name: "Cafe Latte",
      description:
        "A coffee drink made by adding hot water to espresso.",
      category: "Premium Coffee",
      types: "Iced",
      sizes: "16oz",
      price: "₱59",
    },
    {
      id: 4,
      name: "Belgian Chocolate",
      description:
        "A coffee drink made by adding hot water to espresso.",
      category: "Non-Coffee",
      types: "Hot & Iced",
      sizes: "12oz & 16oz",
      price: "₱135",
    },
  ]);

  const uniqueCategories = [...new Set(drinks.map((item) => item.category))];
  const uniqueTypes = [...new Set(drinks.map((item) => item.types))];
  const uniqueSizes = [...new Set(drinks.map((item) => item.sizes))];

  const foodsList = [
    {
      name: "PRODUCT",
      selector: (row) => row.name,
      cell: (row) => (
        <div className="food-info">
          <img
            src={row.image || DEFAULT_PROFILE_IMAGE}
            alt={row.name}
            className="food-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PROFILE_IMAGE;
            }}
          />
          <div>
            <div className="food-name">{row.name}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "25%",
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      wrap: true,
      width: "25%",
    },
    {
      name: "CATEGORY",
      selector: (row) => row.category,
      center: true,
      sortable: true,
      width: "25%",
    },
    { name: "PRICE", selector: (row) => row.price, center: true, width: "25%" },
  ];

  const [foods] = useState([
    {
      id: 1,
      name: "Carbonara",
      description:
        "A creamy Italian pasta made with eggs, cheese, guanciale, and black pepper—rich, savory, and simple.",
      category: "Pasta",
      price: "₱120",
    },
    {
      id: 2,
      name: "Americano",
      description:
        "A creamy Italian pasta made with eggs, cheese, guanciale, and black pepper—rich, savory, and simple.",
      category: "Pasta",
      price: "₱120",
    },
    {
      id: 3,
      name: "Americano",
      description:
        "A creamy Italian pasta made with eggs, cheese, guanciale, and black pepper—rich, savory, and simple.",
      category: "Pasta",
      price: "₱120",
    },
  ]);

  const uniqueCategoriesFood = [...new Set(foods.map((item) => item.category))];

  const merchList = [
    {
      name: "PRODUCT",
      selector: (row) => row.name,
      cell: (row) => (
        <div className="merch-info">
          <img
            src={row.image || DEFAULT_PROFILE_IMAGE}
            alt={row.name}
            className="merch-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PROFILE_IMAGE;
            }}
          />
          <div>
            <div className="merch-name">{row.name}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "25%",
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      wrap: true,
      width: "25%",
    },
    {
      name: "CATEGORY",
      selector: (row) => row.category,
      center: true,
      sortable: true,
      width: "25%",
    },
    { name: "PRICE", selector: (row) => row.price, center: true, width: "25%" },
  ];

    const [merch] = useState([
    {
      id: 1,
      name: "Tote Bag",
      description:
        "A sturdy yet stylish bag made from premium, lightweight materials like canvas fabric, featuring both elegance and sustainability. It holds everything from daily essentials to market finds, while its minimalist yet sophisticated design complements any outfit.",
      category: "Merch",
      price: "₱120",
    },
    {
      id: 2,
      name: "Notebook",
      description:
        "A wire-bound notebook made from high-quality, eco-friendly materials, featuring smooth, acid-free pages. Its sturdy yet sleek cover, crafted from premium recycled paper or PU leather, ensures durability while maintaining a refined, minimalist appeal.",
      category: "Merch",
      price: "₱120",
    },
    {
      id: 3,
      name: "Mousepad",
      description:
        "A cloud-inspired mousemat that is designed in a soft sky-blue hue and crafted from smooth fabric. It features a fluffy blue cloud print with a cheerful smiley face. Its non-slip rubber base keeps it securely in place, providing stability for a seamless workflow.",
      category: "Merch",
      price: "₱120",
    },
    {
      id: 4,
      name: "Tumbler",
      description:
        "This versatile drinkware features a double-wall, vacuum-insulated design that keeps drinks at the perfect temperature for hours while being 30% lighter. Its sustainable, reusable construction helps reduce single-use plastic waste without sacrificing durability or convenience.",
      category: "Merch",
      price: "₱120",
    },
  ]);

  const filteredDrinks = drinks.filter((item) => {
    return (
      item.name.toLowerCase().includes(drinkSearch.toLowerCase()) &&
      (drinkCategoryFilter === "" || item.category === drinkCategoryFilter) &&
      (drinkTypeFilter === "" || item.types === drinkTypeFilter) &&
      (drinkSizeFilter === "" || item.sizes === drinkSizeFilter)
    );
  });

  const filteredFoods = foods.filter((item) => {
    return (
      item.name.toLowerCase().includes(foodSearch.toLowerCase()) &&
      (foodCategoryFilter === "" || item.category === foodCategoryFilter)
    );
  });

  const filteredMerch = merch.filter((item) =>
    item.name.toLowerCase().includes(merchSearch.toLowerCase())
  );

  return (
    <div className="productList">
      <Sidebar />
      <div className="products">
        <header className="header">
          <div className="header-left">
            <h2 className="page-title">Products</h2>
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
                  <div className="profile-role">
                    Hi! I'm {loggedInUserDisplay.role}
                  </div>
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
                  <ul>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="products-content">
          <div className="tabs">
            <button
              className={activeTab === "drinks" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("drinks")}
            >
              Drinks
            </button>
            <button
              className={activeTab === "food" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("food")}
            >
              Food
            </button>
            <button
              className={activeTab === "merchandise" ? "tab active-tab" : "tab"}
              onClick={() => setActiveTab("merchandise")}
            >
              Merchandise
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "drinks" && (
              <div className="drinks-content">
                <div className="filter-bar">
                  <input
                    type="text"
                    placeholder="Search Drinks..."
                    value={drinkSearch}
                    onChange={(e) => setDrinkSearch(e.target.value)}
                  />
                  <select value={drinkCategoryFilter} onChange={(e) => setDrinkCategoryFilter(e.target.value)}>
                    <option value="">Category: All</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select value={drinkTypeFilter} onChange={(e) => setDrinkTypeFilter(e.target.value)}>
                    <option value="">Type: All</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select value={drinkSizeFilter} onChange={(e) => setDrinkSizeFilter(e.target.value)}>
                    <option value="">Size: All</option>
                    {uniqueSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <DataTable
                  columns={drinksList}
                  data={filteredDrinks}
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
            )}
            {activeTab === "food" && (
              <div className="food-content">
                <div className="filter-bar">
                  <input
                    type="text"
                    placeholder="Search Food..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                  />
                  <select value={foodCategoryFilter} onChange={(e) => setFoodCategoryFilter(e.target.value)}>
                    <option value="">Category: All</option>
                    {uniqueCategoriesFood.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <DataTable
                  columns={foodsList}
                  data={filteredFoods}
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
            )}
            {activeTab === "merchandise" && (
              <div className="merch-content">
                <div className="filter-bar-merch">
                  <input
                    type="text"
                    placeholder="Search Merchandise..."
                    value={merchSearch}
                    onChange={(e) => setMerchSearch(e.target.value)}
                  />
                </div>
                <DataTable
                  columns={merchList}
                  data={filteredMerch}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
