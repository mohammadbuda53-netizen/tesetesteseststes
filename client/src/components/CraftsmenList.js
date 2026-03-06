import React, { useState } from 'react';
import axios from 'axios';

function CraftsmenList({ craftsmen, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCraftsman, setEditingCraftsman] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    trade: '',
    phone: '',
    email: '',
    hourly_rate: '',
    status: 'active'
  });

  const trades = [
    'Elektriker',
    'Klempner',
    'Zimmermann',
    'Maler',
    'Maurer',
    'Dachdecker',
    'Fliesenleger',
    'Schreiner',
    'Heizungsbauer',
    'Sonstige'
  ];

  const handleAdd = () => {
    setEditingCraftsman(null);
    setFormData({
      name: '',
      trade: '',
      phone: '',
      email: '',
      hourly_rate: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (craftsman) => {
    setEditingCraftsman(craftsman);
    setFormData(craftsman);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Handwerker wirklich löschen?')) {
      try {
        await axios.delete(`/api/craftsmen/${id}`);
        onUpdate();
      } catch (error) {
        alert('Fehler beim Löschen: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCraftsman) {
        await axios.put(`/api/craftsmen/${editingCraftsman.id}`, formData);
      } else {
        await axios.post('/api/craftsmen', formData);
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
          <h2>Handwerker</h2>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Neuer Handwerker
          </button>
        </div>

        {craftsmen.length === 0 ? (
          <p className="empty-state">Keine Handwerker vorhanden</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gewerk</th>
                <th>Telefon</th>
                <th>E-Mail</th>
                <th>Stundensatz</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {craftsmen.map(craftsman => (
                <tr key={craftsman.id}>
                  <td>{craftsman.name}</td>
                  <td>{craftsman.trade}</td>
                  <td>{craftsman.phone || '-'}</td>
                  <td>{craftsman.email || '-'}</td>
                  <td>{craftsman.hourly_rate ? `${craftsman.hourly_rate} €/h` : '-'}</td>
                  <td>
                    <span className={`status-badge status-${craftsman.status}`}>
                      {craftsman.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEdit(craftsman)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Bearbeiten
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(craftsman.id)}
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
            <h3>{editingCraftsman ? 'Handwerker bearbeiten' : 'Neuer Handwerker'}</h3>
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
                <label>Gewerk *</label>
                <select
                  name="trade"
                  value={formData.trade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Bitte wählen...</option>
                  {trades.map(trade => (
                    <option key={trade} value={trade}>{trade}</option>
                  ))}
                </select>
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

              <div className="form-group">
                <label>Stundensatz (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Aktiv</option>
                  <option value="inactive">Inaktiv</option>
                </select>
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

export default CraftsmenList;
