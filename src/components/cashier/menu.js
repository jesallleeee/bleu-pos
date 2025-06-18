import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import CartPanel from './cartPanel.js';
import './menu.css';

const categories = {
  DRINKS: [
    'Barista Choice',
    'Specialty Coffee',
    'Premium Coffee',
    'Non-Coffee',
    'Frappe',
    'Sparkling Series',
    'Milktea',
  ],
  FOOD: ['Pasta', 'Sandwich', 'Rice Meals', 'Snacks'],
  MERCHANDISE: ['Merch'],
};

const productData = [
  {
    name: 'Tiramisu Latte',
    description: 'Espresso with tiramisu flavor and steamed milk',
    price: 129.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Barista Choice',
    promo: true,
  },
  {
    name: 'Matcha Frappe',
    description: 'Blended matcha with ice and creamy milk',
    price: 145.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Frappe',
    promo: false,
  },
  {
    name: 'Americano',
    description: 'Bold espresso mixed with hot water',
    price: 105.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Specialty Coffee',
    promo: true,
  },
  {
    name: 'Caramel Macchiato',
    description: 'Espresso with milk, foam, and caramel drizzle',
    price: 140.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Premium Coffee',
    promo: false,
  },
  {
    name: 'Classic Milk Tea',
    description: 'Black tea with milk and tapioca pearls',
    price: 110.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Milktea',
    promo: false,
  },
  {
    name: 'Sparkling Lemonade',
    description: 'Lemon soda with mint',
    price: 99.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Sparkling Series',
    promo: true,
  },
  {
    name: 'Club Sandwich',
    description: 'Toasted sandwich with chicken, ham, and cheese',
    price: 165.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Sandwich',
    promo: false,
  },
  {
    name: 'Creamy Carbonara',
    description: 'White sauce pasta with bacon and cheese',
    price: 175.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Pasta',
    promo: false,
  },
  {
    name: 'Mango Graham Frappe',
    description: 'Mango blend with grahams and cream',
    price: 139.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Frappe',
    promo: true,
  },
  {
    name: 'Merch Mug',
    description: 'Ceramic mug with official cafe logo',
    price: 199.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Merch',
    promo: false,
  },
];

function Menu() {
  const [selectedFilter, setSelectedFilter] = useState({ type: 'all', value: 'All Products' });
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  
  // States for order type and payment method
  const [orderType, setOrderType] = useState('Dine in');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    // Simulate data fetch
    const fetchProducts = async () => {
      // Simulate delay
      await new Promise(res => setTimeout(res, 200));
      setProducts(productData);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsCartOpen(cartItems.length > 0);
  }, [cartItems]);

  const filterProducts = () => {
    if (selectedFilter.type === 'all') {
      return products;
    } else if (selectedFilter.type === 'promo') {
      return products.filter(product => product.promo === true);
    } else if (selectedFilter.type === 'group') {
      return products.filter(product =>
        categories[selectedFilter.value].includes(product.category)
      );
    } else if (selectedFilter.type === 'item') {
      return products.filter(product => product.category === selectedFilter.value);
    }
    return [];
  };

  const filteredProducts = filterProducts();

  const addToCart = (product, customAddons = null) => {
    // Default add-ons for new items (no customization)
    const defaultAddons = { espressoShots: 0, seaSaltCream: 0, syrupSauces: 0 };
    const appliedAddons = customAddons || defaultAddons;

    const isSameAddons = (a, b) => {
      return a.espressoShots === b.espressoShots &&
            a.seaSaltCream === b.seaSaltCream &&
            a.syrupSauces === b.syrupSauces;
    };

    const existingIndex = cartItems.findIndex(item =>
      item.name === product.name &&
      isSameAddons(item.addons, appliedAddons)
    );

    if (existingIndex !== -1) {
      // Same item and same customization found — increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // Different customization or new product — add as new item
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          addons: appliedAddons
        }
      ]);
    }
  };

  // Helper function to get addon description
  const getAddonsDescription = (addons) => {
    const descriptions = [];
    if (addons.espressoShots > 0) {
      descriptions.push(`Espresso Shot: ₱${50 * addons.espressoShots}`);
    }
    if (addons.seaSaltCream > 0) {
      descriptions.push(`Sea Salt Cream: ₱${30 * addons.seaSaltCream}`);
    }
    if (addons.syrupSauces > 0) {
      descriptions.push(`Syrup/Sauce: ₱${20 * addons.syrupSauces}`);
    }
    return descriptions;
  };

  // Helper function to calculate total addons price
  const getTotalAddonsPrice = (addons) => {
    if (!addons) return 0;
    return (addons.espressoShots * 50) + (addons.seaSaltCream * 30) + (addons.syrupSauces * 20);
  };

  // Function to handle successful transaction and save to localStorage
  const handleTransactionSuccess = (transactionData) => {
    // Get existing store orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('storeOrders') || '[]');
    
    // Generate new order ID
    const newOrderId = `ST-${String(existingOrders.length + 1).padStart(3, '0')}`;
    
    // Define available discounts for name mapping
    const availableDiscounts = [
      { id: 'senior', name: 'Senior Citizen', type: 'percentage', value: 20 },
      { id: 'pwd', name: 'PWD', type: 'percentage', value: 20 },
      { id: 'student', name: 'Student', type: 'percentage', value: 10 },
      { id: 'employee', name: 'Employee', type: 'percentage', value: 15 },
      { id: 'loyalty', name: 'Loyalty Card', type: 'fixed', value: 25 },
      { id: 'promo100', name: 'Buy ₱100 Get ₱10 Off', type: 'fixed', value: 10 },
      { id: 'firsttime', name: 'First Time Customer', type: 'percentage', value: 5 }
    ];

    // Convert discount IDs to discount names
    const getDiscountNames = (discountIds) => {
      if (!discountIds || discountIds.length === 0) return [];
      return discountIds.map(id => {
        const discount = availableDiscounts.find(d => d.id === id);
        return discount ? discount.name : id;
      });
    };
    
    // Create new order object
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: transactionData.cartItems.length,
      total: transactionData.total,
      status: "PROCESSING",
      orderItems: transactionData.cartItems.map(item => ({
        name: item.name,
        size: "Reg", // Default size, you can modify this based on your needs
        quantity: item.quantity,
        price: item.price + getTotalAddonsPrice(item.addons),
        extras: getAddonsDescription(item.addons)
      })),
      paymentMethod: transactionData.paymentMethod,
      orderType: transactionData.orderType,
      appliedDiscounts: getDiscountNames(transactionData.appliedDiscounts || [])
    };
    
    // Add new order to the beginning of the array (most recent first)
    const updatedOrders = [newOrder, ...existingOrders];
    
    // Save back to localStorage
    localStorage.setItem('storeOrders', JSON.stringify(updatedOrders));
    
    // Clear cart after successful transaction
    setCartItems([]);
  };

  const ProductList = ({ products, addToCart }) => {
    return (
      <div className="menu-product-grid">
        {products.map(product => (
          <div key={product.name} className="menu-product-item">
            <div className="menu-product-main">
              <div className="menu-product-img-container">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="menu-product-details">
                <div className="menu-product-title">{product.name}</div>
                <div className="menu-product-description">{product.description}</div>
                <div className="menu-product-price">₱{product.price.toFixed(2)}</div>
              </div>
            </div>
            <button className="menu-add-button" onClick={() => addToCart(product)}>
              Add Product
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="menu-page">
      <Navbar isCartOpen={isCartOpen} />
      <div className="menu-page-content">
        <div className="menu-category-sidebar">
          {/* All Products option */}
          <div className="menu-category-group">
            <div
              className={`menu-all-products-btn ${selectedFilter.type === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter({ type: 'all', value: 'All Products' })}
            >
              ALL PRODUCTS
            </div>
            <div
              className={`menu-all-products-btn ${selectedFilter.type === 'promo' ? 'active' : ''}`}
              onClick={() => setSelectedFilter({ type: 'promo', value: 'Promotions' })}
            >
              PROMOS
            </div>
          </div>

          {/* Category groups */}
          {Object.entries(categories).map(([group, items]) => (
            <div className="menu-category-group" key={group}>
              <div
                className={`menu-group-title ${
                  selectedFilter.type === 'group' && selectedFilter.value === group
                    ? 'active'
                    : ''
                }`}
                onClick={() => setSelectedFilter({ type: 'group', value: group })}
              >
                {group}
              </div>
              {items.map(item => (
                <div
                  key={item}
                  className={`menu-category-item ${
                    selectedFilter.type === 'item' && selectedFilter.value === item
                      ? 'active'
                    : ''
                  }`}
                  onClick={() => setSelectedFilter({ type: 'item', value: item })}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className={`menu-main-content ${isCartOpen ? 'menu-cart-open' : ''}`}>
          <div className="menu-container">
            <div className="menu-product-list">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="menu-product-list-header">
                    <h2 className="menu-selected-category-title">
                      {selectedFilter.type === 'all' && 'All Products'}
                      {selectedFilter.type === 'promo' && 'Promos'}
                      {selectedFilter.type === 'group' && selectedFilter.value}
                      {selectedFilter.type === 'item' &&
                        selectedFilter.value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                  </div>

                  {/* Wrap the ProductList in a scrollable container */}
                  <div className="menu-product-grid-container">
                    <ProductList products={filteredProducts} addToCart={addToCart} />
                  </div>
                </>
              ) : (
                <div className="menu-no-products">
                  No items in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Use the new CartPanel component with transaction handler */}
      <CartPanel 
        cartItems={cartItems}
        setCartItems={setCartItems}
        isCartOpen={isCartOpen}
        orderType={orderType}
        setOrderType={setOrderType}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        addonPrices={{
          espressoShots: 50,
          seaSaltCream: 30,
          syrupSauces: 20,
        }}
        onTransactionSuccess={handleTransactionSuccess}
      />
    </div>
  );
}

export default Menu;