import React, { useState } from 'react';
import axios from 'axios';

function CustomersList({ customers, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: ''
    });
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      try {
        await axios.delete(`/api/customers/${id}`);
        onUpdate();
      } catch (error) {
        alert('Fehler beim Löschen: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await axios.put(`/api/customers/${editingCustomer.id}`, formData);
      } else {
        await axios.post('/api/customers', formData);
      }
      setShowModal(false);
      onUpdate();
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Kunden</h2>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Neuer Kunde
          </button>
        </div>

        {customers.length === 0 ? (
          <p className="empty-state">Keine Kunden vorhanden</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Adresse</th>
                <th>Telefon</th>
                <th>E-Mail</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.address || '-'}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{customer.email || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEdit(customer)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Bearbeiten
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(customer.id)}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCustomer ? 'Kunde bearbeiten' : 'Neuer Kunde'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Adresse</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>E-Mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersList;
