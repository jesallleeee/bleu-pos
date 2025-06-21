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
    'Drinks',
    'Ingredients',
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
          <div className="spillage-subtitle">Record spilled products and ingredients</div>
        </div>

        <div className="spillage-content spillage-reversed">
        {/* Spillage History - now on the left with bigger width */}
        <div className="spillage-history-section">
            <div className="spillage-section-title">Recent Spillage Entries ({spillageEntries.length})</div>
            
            {spillageEntries.length === 0 ? (
            <div className="spillage-no-entries">
                <div className="spillage-no-entries-text">No spillage entries recorded yet.</div>
            </div>
            ) : (
            <div className="spillage-table-container">
                <table className="spillage-table">
                    <thead className="spillage-table-head">
                        <tr className="spillage-table-header-row">
                            <th className="spillage-table-header">Item Name</th>
                            <th className="spillage-table-header">Quantity</th>
                            <th className="spillage-table-header">Category</th>
                            <th className="spillage-table-header">Reason</th>
                            <th className="spillage-table-header">Location</th>
                            <th className="spillage-table-header">Timestamp</th>
                            <th className="spillage-table-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="spillage-table-body">
                        {spillageEntries.map(entry => (
                        <tr key={entry.id} className="spillage-table-row">
                            <td className="spillage-table-cell spillage-item-name-cell">{entry.itemName}</td>
                            <td className="spillage-table-cell">{entry.quantitySpilled} {entry.unit}</td>
                            <td className="spillage-table-cell">{entry.category || '-'}</td>
                            <td className="spillage-table-cell">{entry.reason}</td>
                            <td className="spillage-table-cell">{entry.location || '-'}</td>
                            <td className="spillage-table-cell spillage-timestamp-cell">{entry.timestamp}</td>
                            <td className="spillage-table-cell spillage-actions-cell">
                                <button 
                                    onClick={() => handleDelete(entry.id)}
                                    className="spillage-delete-btn"
                                >
                                    ×
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>

        {/* Spillage Form - now on the right with smaller width */}
        <div className="spillage-form-section">
            <div className="spillage-section-title">Log New Spillage</div>
            <div className="spillage-form">
            <div className="spillage-form-row">
                <div className="spillage-form-group">
                <label htmlFor="itemName" className="spillage-form-label">Item Name *</label>
                <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    className="spillage-form-input"
                    required
                />
                </div>

                <div className="spillage-form-group">
                <label htmlFor="category" className="spillage-form-label">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="spillage-form-select"
                >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                </div>
            </div>

            <div className="spillage-form-row">
                <div className="spillage-form-group">
                <label htmlFor="quantitySpilled" className="spillage-form-label">Quantity Spilled *</label>
                <input
                    type="number"
                    id="quantitySpilled"
                    name="quantitySpilled"
                    value={formData.quantitySpilled}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="spillage-form-input"
                    required
                />
                </div>

                <div className="spillage-form-group">
                <label htmlFor="unit" className="spillage-form-label">Unit</label>
                <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="spillage-form-select"
                >
                    {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>
                </div>
            </div>

            <div className="spillage-form-row">
                <div className="spillage-form-group">
                <label htmlFor="reason" className="spillage-form-label">Reason for Spillage *</label>
                <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="spillage-form-select"
                    required
                >
                    <option value="">Select reason</option>
                    {reasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                    ))}
                </select>
                </div>

                <div className="spillage-form-group">
                <label htmlFor="location" className="spillage-form-label">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Counter, Storage, Aisle 3"
                    className="spillage-form-input"
                />
                </div>
            </div>

            <button type="submit" className="spillage-submit-btn" onClick={handleSubmit}>
                Log Spillage
            </button>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default CashierSpillage;