import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMoneyBillWave, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

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

const mockProducts = [
  {
    name: 'Tiramisu Latte',
    description: 'Espresso with layers of tiramisu flavor and steamed milk',
    price: 129.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Barista Choice',
    type: ['hot', 'iced'],
    sizes: ['12oz', '16oz'],
  },
  {
    name: 'Matcha Frappe',
    description: 'Creamy Japanese matcha blended with ice and milk',
    price: 145.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Frappe',
    type: ['iced'],
    sizes: ['12oz', '16oz'],
  },
  {
    name: 'Americano',
    description: 'Espresso diluted with hot water for a bold cup',
    price: 105.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Specialty Coffee',
    type: ['hot', 'iced'],
    sizes: ['12oz'],
  },
  {
    name: 'Caramel Macchiato',
    description: 'Espresso with steamed milk, foam, and caramel drizzle',
    price: 140.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Premium Coffee',
    type: ['hot', 'iced'],
    sizes: ['12oz', '16oz'],
  },
  {
    name: 'Classic Milk Tea',
    description: 'Black tea with milk, sweetener, and tapioca pearls',
    price: 110.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Milktea',
    type: ['iced'],
    sizes: ['16oz'],
  },
  {
    name: 'Sparkling Lemonade',
    description: 'Refreshing soda with lemon juice and mint',
    price: 99.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Sparkling Series',
    type: ['iced'],
    sizes: ['16oz'],
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-layer toasted sandwich with chicken, ham, and cheese',
    price: 165.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Sandwich',
    type: [],
    sizes: [],
  },
  {
    name: 'Creamy Carbonara',
    description: 'Pasta in white sauce with bacon and cheese',
    price: 175.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Pasta',
    type: [],
    sizes: [],
  },
  {
    name: 'Mango Graham Frappe',
    description: 'Mango smoothie with crushed grahams and cream',
    price: 139.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Frappe',
    type: ['iced'],
    sizes: ['16oz'],
  },
  {
    name: 'Merch Mug',
    description: 'Official cafe ceramic mug with printed logo',
    price: 199.0,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    category: 'Merch',
    type: [],
    sizes: [],
  },
];

function Menu() {
  const [selectedFilter, setSelectedFilter] = useState({ type: '', value: '' });
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]); 
  // New state for order type and payment method
  const [orderType, setOrderType] = useState('Dine in');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  // Add-ons modal state
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [addons, setAddons] = useState({
    espressoShots: 0,
    seaSaltCream: 0,
    syrupSauces: 0
  });

  useEffect(() => {
    // Simulate data fetch
    const fetchProducts = async () => {
      // Simulate delay
      await new Promise(res => setTimeout(res, 200));
      setProducts(mockProducts);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsCartOpen(cartItems.length > 0);
  }, [cartItems]);

  const filterProducts = () => {
    if (selectedFilter.type === 'group') {
      return mockProducts.filter(product =>
        categories[selectedFilter.value].includes(product.category)
      );
    } else if (selectedFilter.type === 'item') {
      return mockProducts.filter(product => product.category === selectedFilter.value);
    }
    return [];
  };

  const filteredProducts = filterProducts();

  // Calculate subtotal including add-ons
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const basePrice = item.price * item.quantity;
      const addonsPrice = getTotalAddonsPrice(item.addons) * item.quantity;
      return acc + basePrice + addonsPrice;
    }, 0);
  };

  // Example fixed discount (10 PHP if subtotal > 100)
  const getDiscount = () => {
    const subtotal = getSubtotal();
    return subtotal > 100 ? 10 : 0;
  };

  // Total = subtotal - discount
  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  const addToCart = (product) => {
    const existingIndex = cartItems.findIndex(item => item.name === product.name);
    if (existingIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { 
        ...product, 
        quantity: 1, 
        addons: { espressoShots: 0, seaSaltCream: 0, syrupSauces: 0 }
      }]);
    }
  };

  const openAddonsModal = (itemIndex) => {
    setSelectedItemIndex(itemIndex);
    setAddons(cartItems[itemIndex].addons || { espressoShots: 0, seaSaltCream: 0, syrupSauces: 0 });
    setShowAddonsModal(true);
  };

  const closeAddonsModal = () => {
    setShowAddonsModal(false);
    setSelectedItemIndex(null);
    setAddons({ espressoShots: 0, seaSaltCream: 0, syrupSauces: 0 });
  };

  const updateAddons = (addonType, value) => {
    setAddons(prev => ({
      ...prev,
      [addonType]: Math.max(0, value)
    }));
  };

  const saveAddons = () => {
    if (selectedItemIndex !== null) {
      const updatedCart = [...cartItems];
      updatedCart[selectedItemIndex].addons = { ...addons };
      setCartItems(updatedCart);
    }
    closeAddonsModal();
  };

  const getAddonPrice = (addon, quantity) => {
    const prices = {
      espressoShots: 15,
      seaSaltCream: 20,
      syrupSauces: 10
    };
    return prices[addon] * quantity;
  };

  const getTotalAddonsPrice = (itemAddons) => {
    if (!itemAddons) return 0;
    return Object.entries(itemAddons).reduce((total, [addon, quantity]) => {
      return total + getAddonPrice(addon, quantity);
    }, 0);
  };

  const CartPanel = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);
    const total = getTotal();

    const updateQuantity = (index, amount) => {
      setCartItems(prev => {
        const updated = [...prev];
        updated[index].quantity += amount;
        if (updated[index].quantity <= 0) updated.splice(index, 1);
        return updated;
      });
    };

    const removeFromCart = (index) => {
      const updatedCart = [...cartItems];
      updatedCart.splice(index, 1);
      setCartItems(updatedCart);
    };

    const AddonsModal = () => {
      if (!showAddonsModal) return null;

      return (
        <div className="modal-overlay" onClick={closeAddonsModal}>
          <div className="addons-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customize Your Order</h3>
              <button className="close-modal" onClick={closeAddonsModal}>×</button>
            </div>
            
            <div className="addons-content">
              <div className="addon-item">
                <div className="addon-info">
                  <span className="addon-name">Espresso Shots</span>
                  <span className="addon-price">+₱15 each</span>
                </div>
                <div className="addon-controls">
                  <button onClick={() => updateAddons('espressoShots', addons.espressoShots - 1)}>−</button>
                  <span>{addons.espressoShots}</span>
                  <button onClick={() => updateAddons('espressoShots', addons.espressoShots + 1)}>+</button>
                </div>
              </div>

              <div className="addon-item">
                <div className="addon-info">
                  <span className="addon-name">Sea Salt Cream</span>
                  <span className="addon-price">+₱20 each</span>
                </div>
                <div className="addon-controls">
                  <button onClick={() => updateAddons('seaSaltCream', addons.seaSaltCream - 1)}>−</button>
                  <span>{addons.seaSaltCream}</span>
                  <button onClick={() => updateAddons('seaSaltCream', addons.seaSaltCream + 1)}>+</button>
                </div>
              </div>

              <div className="addon-item">
                <div className="addon-info">
                  <span className="addon-name">Syrups/Sauces</span>
                  <span className="addon-price">+₱10 each</span>
                </div>
                <div className="addon-controls">
                  <button onClick={() => updateAddons('syrupSauces', addons.syrupSauces - 1)}>−</button>
                  <span>{addons.syrupSauces}</span>
                  <button onClick={() => updateAddons('syrupSauces', addons.syrupSauces + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeAddonsModal}>Cancel</button>
              <button className="save-btn" onClick={saveAddons}>Save Add-ons</button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="order-section">
          <h2>Order Details</h2>
          
          <div className="order-type-toggle">
            <button 
              className={orderType === 'Dine in' ? 'active' : ''}
              onClick={() => setOrderType('Dine in')}
            >
              Dine in
            </button>
            <button 
              className={orderType === 'Take out' ? 'active' : ''}
              onClick={() => setOrderType('Take out')}
            >
              Take out
            </button>
          </div>

          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="addons-link" onClick={() => openAddonsModal(index)}>Add ons</div>
                    {item.addons && (getTotalAddonsPrice(item.addons) > 0) && (
                      <div className="addons-summary">
                        {item.addons.espressoShots > 0 && <span>+{item.addons.espressoShots} Espresso</span>}
                        {item.addons.seaSaltCream > 0 && <span>+{item.addons.seaSaltCream} Sea Salt Cream</span>}
                        {item.addons.syrupSauces > 0 && <span>+{item.addons.syrupSauces} Syrups</span>}
                      </div>
                    )}
                    <div className="qty-price">
                      <button onClick={() => updateQuantity(index, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)}>+</button>
                      <span className="item-price">
                        ₱{((item.price + getTotalAddonsPrice(item.addons)) * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '200px', 
                color: '#999',
                fontSize: '14px'
              }}>
                No products added.
              </div>
            )}
          </div>

          <div className="discount-section">
            <input 
              type="text" 
              placeholder="Discounts and Promotions" 
              disabled 
            />
            
            <div className="summary">
              <div className="line">
                <span>Subtotal:</span>
                <span>₱{getSubtotal().toFixed(0)}</span>
              </div>
              <div className="line">
                <span>Discount:</span>
                <span>₱{getDiscount().toFixed(0)}</span>
              </div>
              <hr />
              <div className="line total">
                <span>Total:</span>
                <span>₱{getTotal().toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <button 
                className={`cash ${paymentMethod === 'Cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Cash')}
              >
                <FontAwesomeIcon icon={faMoneyBillWave} />
                <span>Cash</span>
              </button>
              <button 
                className={`ewallet ${paymentMethod === 'E-Wallet' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('E-Wallet')}
              >
                <FontAwesomeIcon icon={faMobileAlt} />
                <span>E-Wallet</span>
              </button>
            </div>
          </div>

          <button className="process-button">
            Process Transaction
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="menu">
      <Navbar />
      <div className="menu-content">
        <div className="category">
          {Object.entries(categories).map(([group, items]) => (
            <div className="group" key={group}>
              <div
                className={`group-title ${
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
                  className={`item ${
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
        
        <div className={`menu-content ${isCartOpen ? 'cart-open' : ''}`}>
        <div className="menu-container">
        <div className="product-list">
          {selectedFilter.value ? (
            filteredProducts.length > 0 ? (
              <>
              <h2 className="selected-category-title">
                {selectedFilter.type === 'group'
                  ? selectedFilter.value
                  : selectedFilter.value}
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {filteredProducts.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-main">
                      <div className="product-img-container">
                      <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-details">
                        <div className="product-title">{product.name}</div>
                        <div className="product-description">{product.description}</div>
                        <div className="product-price">₱{product.price.toFixed(2)}</div>
                      </div>
                    </div>

                    {(product.type.length > 0 || product.sizes.length > 0) && (
                      <div className="product-options">
                        {product.type.length > 0 && (
                          <div className="option-section">
                            <div className="option-label">Type</div>
                            <div className="option-group">
                              {product.type.includes('hot') && <div className="option">🔥</div>}
                              {product.type.includes('iced') && <div className="option">❄️</div>}
                            </div>
                          </div>
                        )}

                        {product.sizes.length > 0 && (
                          <div className="option-section">
                            <div className="option-label">Size</div>
                            <div className="option-group">
                              {product.sizes.map((size, i) => {
                                const match = size.match(/^(\d+)(oz)$/);
                                return (
                                  <div key={i} className="option">
                                    {match ? (
                                      <>
                                        <span style={{ color: '#4197a2', fontWeight: 600 }}>{match[1]}</span>
                                        <span style={{ color: '#000', fontWeight: 700 }}>{match[2]}</span>
                                      </>
                                    ) : size}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <button className="add-button" onClick={() => addToCart(product)}>
                      Add Product
                    </button>
                  </div>
                ))}
              </div>
              </>
            ) : (
              <div>No items in this category.</div>
            )
          ) : (
            <div>Select a category to view items.</div>
          )}
        </div>
      </div>
      </div>
      </div>

      {/* ✅ CartPanel is now used */}
      <CartPanel />
      
      {/* Add-ons Modal */}
      {showAddonsModal && (
        <div className="modal-overlay" onClick={closeAddonsModal}>
          <div className="addons-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customize Order</h3>
              <button className="close-modal" onClick={closeAddonsModal}>×</button>
            </div>
            
            <div className="addons-content">
              <div className="addon-item">
                <div className="addon-info">
                  <span className="addon-name">Espresso Shots</span>
                  <span className="addon-price">+₱15 each</span>
                </div>
                <div className="addon-controls">
                  <button onClick={() => updateAddons('espressoShots', addons.espressoShots - 1)}>−</button>
                  <span>{addons.espressoShots}</span>
                  <button onClick={() => updateAddons('espressoShots', addons.espressoShots + 1)}>+</button>
                </div>
              </div>

              <div className="addon-item">
                <div className="addon-info">
                  <span className="addon-name">Sea Salt Cream</span>
                  <span className="addon-price">+₱20 each</span>
                </div>
                <div className="addon-controls">
                  <button onClick={() => updateAddons('seaSaltCream', addons.seaSaltCream - 1)}>−</button>
                  <span>{addons.seaSaltCream}</span>
                  <button onClick={() => updateAddons('seaSaltCream', addons.seaSaltCream + 1)}>+</button>
                </div>
              </div>

              <div className="addon-item">
                <div className="addon-info">
                  <span className="addon-name">Syrups/Sauces</span>
                  <span className="addon-price">+₱10 each</span>
                </div>
                <div className="addon-controls">
                  <button onClick={() => updateAddons('syrupSauces', addons.syrupSauces - 1)}>−</button>
                  <span>{addons.syrupSauces}</span>
                  <button onClick={() => updateAddons('syrupSauces', addons.syrupSauces + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeAddonsModal}>Cancel</button>
              <button className="save-btn" onClick={saveAddons}>Save Add-ons</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;