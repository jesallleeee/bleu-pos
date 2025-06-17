import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMoneyBills, faQrcode, faPercent} from '@fortawesome/free-solid-svg-icons';
import { FiMinus, FiPlus } from "react-icons/fi";
import './cartPanel.css';

const CartPanel = ({ 
  cartItems, 
  setCartItems, 
  isCartOpen, 
  orderType, 
  setOrderType, 
  paymentMethod, 
  setPaymentMethod,
  addonPrices
}) => {

  // Define drink categories
  const drinkCategories = [
    'Barista Choice',
    'Specialty Coffee',
    'Premium Coffee',
    'Non-Coffee',
    'Frappe',
    'Sparkling Series',
    'Milktea'
  ];

  // Helper function to check if item is a drink
  const isDrinkItem = (item) => {
    return drinkCategories.includes(item.category);
  };

  // Add-ons modal state
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [addons, setAddons] = useState({
    espressoShots: 0,
    seaSaltCream: 0,
    syrupSauces: 0
  });

  // Discounts modal state
  const [showDiscountsModal, setShowDiscountsModal] = useState(false);
  const [appliedDiscounts, setAppliedDiscounts] = useState([]);
  const [stagedDiscounts, setStagedDiscounts] = useState([]);

  // Transaction summary modal state
  const [showTransactionSummary, setShowTransactionSummary] = useState(false);

  // Available discounts
  const availableDiscounts = [
    { id: 'senior', name: 'Senior Citizen', type: 'percentage', value: 20, description: '20% off total' },
    { id: 'pwd', name: 'PWD', type: 'percentage', value: 20, description: '20% off total' },
    { id: 'student', name: 'Student', type: 'percentage', value: 10, description: '10% off total' },
    { id: 'employee', name: 'Employee', type: 'percentage', value: 15, description: '15% off total' },
    { id: 'loyalty', name: 'Loyalty Card', type: 'fixed', value: 25, description: '₱25 off' },
    { id: 'promo100', name: 'Buy ₱100 Get ₱10 Off', type: 'fixed', value: 10, description: '₱10 off for orders ≥₱100', minAmount: 100 },
    { id: 'firsttime', name: 'First Time Customer', type: 'percentage', value: 5, description: '5% off total' }
  ];

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

  const openDiscountsModal = () => {
    setStagedDiscounts([...appliedDiscounts]); // Initialize staged discounts with current applied discounts
    setShowDiscountsModal(true);
  };

  const closeDiscountsModal = () => {
    setShowDiscountsModal(false);
    setStagedDiscounts([]); // Clear staged discounts without applying them
  };

  const applyDiscounts = () => {
    setAppliedDiscounts([...stagedDiscounts]); // Apply the staged discounts
    setShowDiscountsModal(false);
    setStagedDiscounts([]);
  };

  const toggleStagedDiscount = (discountId) => {
    setStagedDiscounts(prev => {
      if (prev.includes(discountId)) {
        return prev.filter(id => id !== discountId);
      } else {
        return [...prev, discountId];
      }
    });
  };

  const updateAddons = (addonType, value) => {
    setAddons(prev => ({
      ...prev,
      [addonType]: Math.max(0, value)
    }));
  };

  const saveAddons = () => {
    if (selectedItemIndex !== null) {
      const currentItem = cartItems[selectedItemIndex];
      
      // Helper function to compare add-ons
      const isSameAddons = (a, b) => {
        return a.espressoShots === b.espressoShots &&
              a.seaSaltCream === b.seaSaltCream &&
              a.syrupSauces === b.syrupSauces;
      };

      // Check if there's already an item with the same name and add-ons (excluding the current item)
      const existingIndex = cartItems.findIndex((item, index) =>
        index !== selectedItemIndex && // Exclude the current item being edited
        item.name === currentItem.name &&
        isSameAddons(item.addons || { espressoShots: 0, seaSaltCream: 0, syrupSauces: 0 }, addons)
      );

      if (existingIndex !== -1) {
        // Found existing item with same configuration - merge quantities
        const updatedCart = [...cartItems];
        updatedCart[existingIndex].quantity += currentItem.quantity;
        
        // Remove the current item (the one being edited)
        updatedCart.splice(selectedItemIndex, 1);
        
        setCartItems(updatedCart);
      } else {
        // No existing item found - just update the current item's add-ons
        const updatedCart = [...cartItems];
        updatedCart[selectedItemIndex].addons = { ...addons };
        setCartItems(updatedCart);
      }
    }
    closeAddonsModal();
  };

  useEffect(() => {
    if (!isCartOpen) {
      setCartItems([]);
      setAppliedDiscounts([]);
      setStagedDiscounts([]);
      setPaymentMethod('Cash');
      setOrderType('Dine in'); // or your default value
    }
  }, [isCartOpen]);

  const getAddonPrice = (addon, quantity) => {
    return (addonPrices?.[addon] || 0) * quantity;
  };

  const getTotalAddonsPrice = (itemAddons) => {
    if (!itemAddons) return 0;
    return Object.entries(itemAddons).reduce((total, [addon, quantity]) => {
      return total + getAddonPrice(addon, quantity);
    }, 0);
  };

  // Calculate subtotal including add-ons
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const basePrice = item.price * item.quantity;
      const addonsPrice = getTotalAddonsPrice(item.addons) * item.quantity;
      return acc + basePrice + addonsPrice;
    }, 0);
  };

  // Calculate total discount from applied discounts
  const getDiscount = () => {
    const subtotal = getSubtotal();
    let totalDiscount = 0;

    appliedDiscounts.forEach(discountId => {
      const discount = availableDiscounts.find(d => d.id === discountId);
      if (discount) {
        // Check if discount has minimum amount requirement
        if (discount.minAmount && subtotal < discount.minAmount) {
          return; // Skip this discount if minimum not met
        }

        if (discount.type === 'percentage') {
          totalDiscount += (subtotal * discount.value) / 100;
        } else if (discount.type === 'fixed') {
          totalDiscount += discount.value;
        }
      }
    });

    return Math.min(totalDiscount, subtotal); // Discount can't exceed subtotal
  };

  // Calculate discount for preview in modal (using staged discounts)
  const getStagedDiscount = () => {
    const subtotal = getSubtotal();
    let totalDiscount = 0;

    stagedDiscounts.forEach(discountId => {
      const discount = availableDiscounts.find(d => d.id === discountId);
      if (discount) {
        // Check if discount has minimum amount requirement
        if (discount.minAmount && subtotal < discount.minAmount) {
          return; // Skip this discount if minimum not met
        }

        if (discount.type === 'percentage') {
          totalDiscount += (subtotal * discount.value) / 100;
        } else if (discount.type === 'fixed') {
          totalDiscount += discount.value;
        }
      }
    });

    return Math.min(totalDiscount, subtotal); // Discount can't exceed subtotal
  };

  // Total = subtotal - discount
  const getTotal = () => {
    return Math.max(0, getSubtotal() - getDiscount());
  };

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

  // Function to handle process transaction
  const handleProcessTransaction = () => {
    if (cartItems.length === 0) {
      alert('Please add items to your cart before processing the transaction.');
      return;
    }
    setShowTransactionSummary(true);
  };

  // Function to confirm transaction
  const confirmTransaction = () => {
    // Here you would typically send the order to your backend
    alert('Transaction processed successfully!');
    
    // Clear the cart and close modals
    setCartItems([]);
    setAppliedDiscounts([]);
    setShowTransactionSummary(false);
  };

  // Function to get applied discount names
  const getAppliedDiscountNames = () => {
    return appliedDiscounts.map(discountId => {
      const discount = availableDiscounts.find(d => d.id === discountId);
      return discount ? discount.name : '';
    }).filter(name => name !== '');
  };

  const AddonsModal = () => {
    if (!showAddonsModal) return null;

    return (
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
                <span className="addon-price">+₱{addonPrices.espressoShots} each</span>
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
                <span className="addon-price">+₱{addonPrices.seaSaltCream} each</span>
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
                <span className="addon-price">+₱{addonPrices.syrupSauces} each</span>
              </div>
              <div className="addon-controls">
                <button onClick={() => updateAddons('syrupSauces', addons.syrupSauces - 1)}>−</button>
                <span>{addons.syrupSauces}</span>
                <button onClick={() => updateAddons('syrupSauces', addons.syrupSauces + 1)}>+</button>
              </div>
            </div>
          </div>

          <div className="modal-footer-addons ">
            <button className="addon-save-btn" onClick={saveAddons}>Save Add-ons</button>
          </div>
        </div>
      </div>
    );
  };

  const DiscountsModal = () => {
    if (!showDiscountsModal) return null;

    return (
      <div className="modal-overlay" onClick={closeDiscountsModal}>
        <div className="discounts-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Apply Discounts</h3>
            <button className="close-modal" onClick={closeDiscountsModal}>×</button>
          </div>
          
          <div className="discounts-content">
            {availableDiscounts.map(discount => {
              const isStaged = stagedDiscounts.includes(discount.id); // Use staged discounts for display
              const subtotal = getSubtotal();
              const isEligible = !discount.minAmount || subtotal >= discount.minAmount;
              
              return (
                <div 
                  key={discount.id} 
                  className={`discount-item ${isStaged ? 'selected' : ''} ${!isEligible ? 'disabled' : ''}`}
                  onClick={() => isEligible && toggleStagedDiscount(discount.id)} // Use staged toggle
                >
                  <div className="discount-checkbox">
                    <input 
                      type="checkbox" 
                      checked={isStaged} // Use staged discounts
                      onChange={() => isEligible && toggleStagedDiscount(discount.id)} // Use staged toggle
                      disabled={!isEligible}
                    />
                  </div>
                  <div className="discount-info">
                    <div className="discount-name">{discount.name}</div>
                    <div className="discount-description">
                      {discount.description}
                      {!isEligible && discount.minAmount && (
                        <span className="min-requirement"> (Min. ₱{discount.minAmount})</span>
                      )}
                    </div>
                  </div>
                  <div className="discount-icon">
                    <FontAwesomeIcon icon={faPercent} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="modal-footer-discount">
            <div className="discount-summary">
              <span>Total Discount: ₱{getStagedDiscount().toFixed(0)}</span> {/* Show staged discount preview */}
            </div>
            <button className="apply-btn" onClick={applyDiscounts}>Apply Discounts</button> {/* Use applyDiscounts function */}
          </div>
        </div>
      </div>
    );
  };

  const TransactionSummaryModal = () => {
    if (!showTransactionSummary) return null;

    return (
      <div className="trnsSummary-modal-overlay" onClick={() => setShowTransactionSummary(false)}>
        <div className="trnsSummary-transaction-summary-modal" onClick={(e) => e.stopPropagation()}>
          <div className="trnsSummary-modal-header">
            <h3>Transaction Summary</h3>
            <button className="trnsSummary-close-modal" onClick={() => setShowTransactionSummary(false)}>×</button>
          </div>

          <div className="trnsSummary-summary-content">
            <div className="trnsSummary-order-info-grid">
              <div className="trnsSummary-info-item">
                <span className="trnsSummary-label">Order Type:</span>
                <span className="trnsSummary-value">{orderType}</span>
              </div>
              <div className="trnsSummary-info-item">
                <span className="trnsSummary-label">Payment Method:</span>
                <span className="trnsSummary-value">{paymentMethod}</span>
              </div>
            </div>

            <div className="trnsSummary-order-items">
              <h4>Order Items</h4>
              <div className="trnsSummary-items-scrollable">
              {cartItems.map((item, index) => (
                <div key={index} className="trnsSummary-summary-item">
                  <div className="trnsSummary-item-header">
                    <span className="trnsSummary-item-name">{item.name}</span>
                    <span className="trnsSummary-item-total">₱{((item.price + getTotalAddonsPrice(item.addons)) * item.quantity).toFixed(0)}</span>
                  </div>
                  <div className="trnsSummary-item-details">
                    <span className="trnsSummary-quantity">Qty: {item.quantity}</span>
                    <span className="trnsSummary-base-price">₱{item.price.toFixed(0)} each</span>
                  </div>
                  {item.addons && getTotalAddonsPrice(item.addons) > 0 && (
                    <div className="trnsSummary-item-addons">
                      {item.addons.espressoShots > 0 && (
                        <span>• {item.addons.espressoShots} Espresso Shot(s) (+₱{(addonPrices.espressoShots * item.addons.espressoShots).toFixed(0)})</span>
                      )}
                      {item.addons.seaSaltCream > 0 && (
                        <span>• {item.addons.seaSaltCream} Sea Salt Cream (+₱{(addonPrices.seaSaltCream * item.addons.seaSaltCream).toFixed(0)})</span>
                      )}
                      {item.addons.syrupSauces > 0 && (
                        <span>• {item.addons.syrupSauces} Syrup/Sauce(s) (+₱{(addonPrices.syrupSauces * item.addons.syrupSauces).toFixed(0)})</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              </div>  
            </div>

           {appliedDiscounts.length > 0 && (
            <div className="trnsSummary-applied-discounts">
              <div className="trnsSummary-applied-discounts-header">
                <h4>Applied Discounts</h4>
                <div className="trnsSummary-applied-discounts-list">
                  {getAppliedDiscountNames().map((discountName, index) => (
                    <div key={index} className="trnsSummary-discount-item-summary">
                      <FontAwesomeIcon icon={faPercent} />
                      <span>{discountName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


            <div className="trnsSummary-price-breakdown">
              <div className="trnsSummary-breakdown-row">
                <span>Subtotal:</span>
                <span>₱{getSubtotal().toFixed(0)}</span>
              </div>
              {getDiscount() > 0 && (
                <div className="trnsSummary-breakdown-row trnsSummary-discount">
                  <span>Discount:</span>
                  <span>-₱{getDiscount().toFixed(0)}</span>
                </div>
              )}
              <hr />
              <div className="trnsSummary-breakdown-row trnsSummary-total">
                <span>Total Amount:</span>
                <span>₱{getTotal().toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="trnsSummary-confirmation-section">
            <div className="trnsSummary-modal-footer-transaction">
              <button className="trnsSummary-cancel-btn" onClick={() => setShowTransactionSummary(false)}>
                Review Order
              </button>
              <button className="trnsSummary-confirm-btn" onClick={confirmTransaction}>
                Confirm & Process
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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

                    {isDrinkItem(item) && (
                      <div className="addons-link" onClick={() => openAddonsModal(index)}>Add ons</div>
                    )}

                    {item.addons && getTotalAddonsPrice(item.addons) > 0 && (
                      <div className="addons-summary">
                        {item.addons.espressoShots > 0 && <span>+{item.addons.espressoShots} Espresso</span>}
                        {item.addons.seaSaltCream > 0 && <span>+{item.addons.seaSaltCream} Sea Salt Cream</span>}
                        {item.addons.syrupSauces > 0 && <span>+{item.addons.syrupSauces} Syrups</span>}
                      </div>
                    )}

                    {/* Spacer pushes qty-price to the bottom */}
                    <div className="flex-spacer" />

                    <div className="qty-price">
                      <button onClick={() => updateQuantity(index, -1)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)}>
                        <FiPlus />
                      </button>
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
            <div className="discount-input-wrapper" onClick={openDiscountsModal}>
              <input 
                type="text" 
                placeholder="Discounts and Promotions" 
                value={appliedDiscounts.length > 0 ? `${appliedDiscounts.length} discount(s) applied` : ''}
                readOnly
              />
            </div>
            
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
                <FontAwesomeIcon icon={faMoneyBills} />
                <span>Cash</span>
              </button>
              <button 
                className={`gcash ${paymentMethod === 'GCash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('GCash')}
              >
                <FontAwesomeIcon icon={faQrcode} />
                <span>GCash</span>
              </button>
            </div>
          </div>

          <button className="process-button" onClick={handleProcessTransaction}>
            Process Transaction
          </button>
        </div>
      </div>
      
      <AddonsModal />
      <DiscountsModal />
      <TransactionSummaryModal />
    </>
  );
};

export default CartPanel;