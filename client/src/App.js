import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import CraftsmenList from './components/CraftsmenList';
import CustomersList from './components/CustomersList';
import JobsList from './components/JobsList';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [craftsmen, setCraftsmen] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [craftsmenRes, customersRes, jobsRes] = await Promise.all([
        axios.get('/api/craftsmen'),
        axios.get('/api/customers'),
        axios.get('/api/jobs')
      ]);
      setCraftsmen(craftsmenRes.data);
      setCustomers(customersRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Laden...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard craftsmen={craftsmen} customers={customers} jobs={jobs} />;
      case 'craftsmen':
        return <CraftsmenList craftsmen={craftsmen} onUpdate={fetchData} />;
      case 'customers':
        return <CustomersList customers={customers} onUpdate={fetchData} />;
      case 'jobs':
        return <JobsList jobs={jobs} craftsmen={craftsmen} customers={customers} onUpdate={fetchData} />;
      default:
        return <Dashboard craftsmen={craftsmen} customers={customers} jobs={jobs} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Handwerker Management</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'craftsmen' ? 'active' : ''} 
            onClick={() => setActiveTab('craftsmen')}
          >
            Handwerker
          </button>
          <button 
            className={activeTab === 'customers' ? 'active' : ''} 
            onClick={() => setActiveTab('customers')}
          >
            Kunden
          </button>
          <button 
            className={activeTab === 'jobs' ? 'active' : ''} 
            onClick={() => setActiveTab('jobs')}
          >
            Aufträge
          </button>
        </nav>
      </header>
      <main className="app-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
