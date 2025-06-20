import React, { useState } from 'react';
import './cashierSpillage.css';
import Navbar from '../navbar';

function CashierSpillage() {
  const [spillageEntries, setSpillageEntries] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantitySpilled: '',
    unit: 'pieces',
    reason: '',
    location: '',
    estimatedValue: '',
    notes: ''
  });

  const categories = [
    'Food Items',
    'Beverages',
    'Ingredients',
    'Cleaning Supplies',
    'Other'
  ];

  const reasons = [
    'Accidental Drop',
    'Container Damage',
    'Customer Accident',
    'Equipment Malfunction',
    'Handling Error',
    'Other'
  ];

  const units = [
    'pieces',
    'kg',
    'grams',
    'liters',
    'ml',
    'bottles',
    'cans',
    'bags'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.quantitySpilled || !formData.reason) {
      alert('Please fill in all required fields (Item Name, Quantity, and Reason)');
      return;
    }

    const newEntry = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      reportedBy: 'Current User' // You can make this dynamic
    };

    setSpillageEntries(prev => [newEntry, ...prev]);
    
    // Reset form
    setFormData({
      itemName: '',
      category: '',
      quantitySpilled: '',
      unit: 'pieces',
      reason: '',
      location: '',
      estimatedValue: '',
      notes: ''
    });

    alert('Spillage logged successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setSpillageEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  return (
    <div className='cashier-spillage'>
      <Navbar />
      
      <div className="spillage-container">
        <div className="spillage-header">
          <h1>Spillage Log</h1>
          <p>Record spilled products and ingredients</p>
        </div>

        <div className="spillage-content">
          {/* Spillage Form */}
          <div className="spillage-form-section">
            <h2>Log New Spillage</h2>
            <div className="spillage-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="itemName">Item Name *</label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantitySpilled">Quantity Spilled *</label>
                  <input
                    type="number"
                    id="quantitySpilled"
                    name="quantitySpilled"
                    value={formData.quantitySpilled}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reason">Reason for Spillage *</label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select reason</option>
                    {reasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Counter, Storage, Aisle 3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estimatedValue">Estimated Value (₱)</label>
                  <input
                    type="number"
                    id="estimatedValue"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional details about the spillage..."
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Log Spillage
              </button>
            </div>
          </div>

          {/* Spillage History */}
          <div className="spillage-history-section">
            <h2>Recent Spillage Entries ({spillageEntries.length})</h2>
            
            {spillageEntries.length === 0 ? (
              <div className="no-entries">
                <p>No spillage entries recorded yet.</p>
              </div>
            ) : (
              <div className="spillage-list">
                {spillageEntries.map(entry => (
                  <div key={entry.id} className="spillage-entry">
                    <div className="entry-header">
                      <h3>{entry.itemName}</h3>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="delete-btn"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="entry-details">
                      <div className="detail-row">
                        <span className="label">Quantity:</span>
                        <span>{entry.quantitySpilled} {entry.unit}</span>
                      </div>
                      
                      {entry.category && (
                        <div className="detail-row">
                          <span className="label">Category:</span>
                          <span>{entry.category}</span>
                        </div>
                      )}
                      
                      <div className="detail-row">
                        <span className="label">Reason:</span>
                        <span>{entry.reason}</span>
                      </div>
                      
                      {entry.location && (
                        <div className="detail-row">
                          <span className="label">Location:</span>
                          <span>{entry.location}</span>
                        </div>
                      )}
                      
                      {entry.estimatedValue && (
                        <div className="detail-row">
                          <span className="label">Estimated Value:</span>
                          <span>₱{parseFloat(entry.estimatedValue).toFixed(2)}</span>
                        </div>
                      )}
                      
                      {entry.notes && (
                        <div className="detail-row">
                          <span className="label">Notes:</span>
                          <span>{entry.notes}</span>
                        </div>
                      )}
                      
                      <div className="detail-row">
                        <span className="label">Timestamp:</span>
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashierSpillage;