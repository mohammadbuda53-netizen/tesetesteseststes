'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card, Badge, Row, Col } from 'react-bootstrap';
import { Job, Customer } from '../lib/types';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    status: 'Offen' as Job['status'],
    priority: 'Mittel' as Job['priority'],
    startDate: '',
    endDate: '',
    estimatedCost: '',
    actualCost: '',
  });

  useEffect(() => {
    setJobs(storage.getJobs());
    setCustomers(storage.getCustomers());
  }, []);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unbekannt';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingJob) {
      const updatedJobs = jobs.map(j => 
        j.id === editingJob.id 
          ? { 
              ...editingJob, 
              ...formData,
              estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
              actualCost: formData.actualCost ? parseFloat(formData.actualCost) : undefined,
            }
          : j
      );
      setJobs(updatedJobs);
      storage.saveJobs(updatedJobs);
    } else {
      const newJob: Job = {
        id: uuidv4(),
        customerId: formData.customerId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
        actualCost: formData.actualCost ? parseFloat(formData.actualCost) : undefined,
        createdAt: new Date().toISOString(),
      };
      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      storage.saveJobs(updatedJobs);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingJob(null);
    setFormData({
      customerId: '',
      title: '',
      description: '',
      status: 'Offen',
      priority: 'Mittel',
      startDate: '',
      endDate: '',
      estimatedCost: '',
      actualCost: '',
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      customerId: job.customerId,
      title: job.title,
      description: job.description,
      status: job.status,
      priority: job.priority,
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      estimatedCost: job.estimatedCost?.toString() || '',
      actualCost: job.actualCost?.toString() || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diesen Auftrag wirklich löschen?')) {
      const updatedJobs = jobs.filter(j => j.id !== id);
      setJobs(updatedJobs);
      storage.saveJobs(updatedJobs);
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    const statusMap: Record<Job['status'], string> = {
      'Offen': 'warning',
      'In Bearbeitung': 'primary',
      'Abgeschlossen': 'success',
      'Storniert': 'danger',
    };
    return <Badge bg={statusMap[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: Job['priority']) => {
    const priorityMap: Record<Job['priority'], string> = {
      'Niedrig': 'secondary',
      'Mittel': 'info',
      'Hoch': 'danger',
    };
    return <Badge bg={priorityMap[priority]}>{priority}</Badge>;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Aufträge</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Neuer Auftrag
        </Button>
      </div>

      <Card>
        <Card.Body>
          {jobs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Noch keine Aufträge vorhanden. Klicken Sie auf "Neuer Auftrag" um zu beginnen.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Kunde</th>
                  <th>Status</th>
                  <th>Priorität</th>
                  <th>Startdatum</th>
                  <th>Kosten (geschätzt)</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td><strong>{job.title}</strong></td>
                    <td>{getCustomerName(job.customerId)}</td>
                    <td>{getStatusBadge(job.status)}</td>
                    <td>{getPriorityBadge(job.priority)}</td>
                    <td>
                      {job.startDate ? new Date(job.startDate).toLocaleDateString('de-DE') : '-'}
                    </td>
                    <td>
                      {job.estimatedCost ? `${job.estimatedCost.toFixed(2)} €` : '-'}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(job)}
                      >
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        Löschen
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingJob ? 'Auftrag bearbeiten' : 'Neuer Auftrag'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kunde *</Form.Label>
                  <Form.Select
                    required
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    <option value="">Kunde auswählen</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titel *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Beschreibung *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Job['status'] })}
                  >
                    <option value="Offen">Offen</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Abgeschlossen">Abgeschlossen</option>
                    <option value="Storniert">Storniert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priorität</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Job['priority'] })}
                  >
                    <option value="Niedrig">Niedrig</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Hoch">Hoch</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Startdatum</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Enddatum</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Geschätzte Kosten (€)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tatsächliche Kosten (€)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.actualCost}
                    onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button variant="primary" type="submit">
              {editingJob ? 'Speichern' : 'Erstellen'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
