import React, { useState } from 'react';
import axios from 'axios';

function JobsList({ jobs, craftsmen, customers, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_id: '',
    craftsman_id: '',
    status: 'pending',
    priority: 'normal',
    start_date: '',
    end_date: '',
    estimated_hours: '',
    actual_hours: '',
    total_cost: ''
  });

  const handleAdd = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      description: '',
      customer_id: '',
      craftsman_id: '',
      status: 'pending',
      priority: 'normal',
      start_date: '',
      end_date: '',
      estimated_hours: '',
      actual_hours: '',
      total_cost: ''
    });
    setShowModal(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      customer_id: job.customer_id || '',
      craftsman_id: job.craftsman_id || '',
      status: job.status,
      priority: job.priority,
      start_date: job.start_date || '',
      end_date: job.end_date || '',
      estimated_hours: job.estimated_hours || '',
      actual_hours: job.actual_hours || '',
      total_cost: job.total_cost || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Auftrag wirklich löschen?')) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        onUpdate();
      } catch (error) {
        alert('Fehler beim Löschen: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        customer_id: formData.customer_id || null,
        craftsman_id: formData.craftsman_id || null,
        estimated_hours: formData.estimated_hours || null,
        actual_hours: formData.actual_hours || null,
        total_cost: formData.total_cost || null
      };

      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob.id}`, submitData);
      } else {
        await axios.post('/api/jobs', submitData);
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
          <h2>Aufträge</h2>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Neuer Auftrag
          </button>
        </div>

        {jobs.length === 0 ? (
          <p className="empty-state">Keine Aufträge vorhanden</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Titel</th>
                <th>Kunde</th>
                <th>Handwerker</th>
                <th>Status</th>
                <th>Priorität</th>
                <th>Startdatum</th>
                <th>Kosten</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.customer_name || '-'}</td>
                  <td>{job.craftsman_name ? `${job.craftsman_name} (${job.craftsman_trade})` : '-'}</td>
                  <td>
                    <span className={`status-badge status-${job.status}`}>
                      {job.status === 'pending' ? 'Ausstehend' : 
                       job.status === 'in-progress' ? 'In Bearbeitung' :
                       job.status === 'completed' ? 'Abgeschlossen' : 'Abgebrochen'}
                    </span>
                  </td>
                  <td className={`priority-${job.priority}`}>
                    {job.priority === 'high' ? 'Hoch' : 
                     job.priority === 'normal' ? 'Normal' : 'Niedrig'}
                  </td>
                  <td>{job.start_date || '-'}</td>
                  <td>{job.total_cost ? `${job.total_cost} €` : '-'}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEdit(job)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Bearbeiten
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(job.id)}
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
            <h3>{editingJob ? 'Auftrag bearbeiten' : 'Neuer Auftrag'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Kunde</label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                >
                  <option value="">Bitte wählen...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Handwerker</label>
                <select
                  name="craftsman_id"
                  value={formData.craftsman_id}
                  onChange={handleChange}
                >
                  <option value="">Bitte wählen...</option>
                  {craftsmen.filter(c => c.status === 'active').map(craftsman => (
                    <option key={craftsman.id} value={craftsman.id}>
                      {craftsman.name} ({craftsman.trade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Ausstehend</option>
                  <option value="in-progress">In Bearbeitung</option>
                  <option value="completed">Abgeschlossen</option>
                  <option value="cancelled">Abgebrochen</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priorität</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Niedrig</option>
                  <option value="normal">Normal</option>
                  <option value="high">Hoch</option>
                </select>
              </div>

              <div className="form-group">
                <label>Startdatum</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Enddatum</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Geschätzte Stunden</label>
                <input
                  type="number"
                  step="0.5"
                  name="estimated_hours"
                  value={formData.estimated_hours}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tatsächliche Stunden</label>
                <input
                  type="number"
                  step="0.5"
                  name="actual_hours"
                  value={formData.actual_hours}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gesamtkosten (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="total_cost"
                  value={formData.total_cost}
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

export default JobsList;
