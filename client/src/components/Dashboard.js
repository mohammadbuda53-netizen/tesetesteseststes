import React from 'react';
import './Dashboard.css';

function Dashboard({ craftsmen, customers, jobs }) {
  const activeCraftsmen = craftsmen.filter(c => c.status === 'active').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const inProgressJobs = jobs.filter(j => j.status === 'in-progress').length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#667eea'}}>
            <span>👷</span>
          </div>
          <div className="stat-content">
            <h3>{craftsmen.length}</h3>
            <p>Handwerker gesamt</p>
            <small>{activeCraftsmen} aktiv</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: '#48bb78'}}>
            <span>👥</span>
          </div>
          <div className="stat-content">
            <h3>{customers.length}</h3>
            <p>Kunden</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: '#ed8936'}}>
            <span>📋</span>
          </div>
          <div className="stat-content">
            <h3>{jobs.length}</h3>
            <p>Aufträge gesamt</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: '#f6ad55'}}>
            <span>⏳</span>
          </div>
          <div className="stat-content">
            <h3>{pendingJobs}</h3>
            <p>Ausstehend</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: '#4299e1'}}>
            <span>🔧</span>
          </div>
          <div className="stat-content">
            <h3>{inProgressJobs}</h3>
            <p>In Bearbeitung</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: '#38b2ac'}}>
            <span>✓</span>
          </div>
          <div className="stat-content">
            <h3>{completedJobs}</h3>
            <p>Abgeschlossen</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Neueste Aufträge</h3>
        {recentJobs.length === 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {recentJobs.map(job => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
