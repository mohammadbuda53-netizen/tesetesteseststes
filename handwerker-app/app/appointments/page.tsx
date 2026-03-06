'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card, Badge, Row, Col } from 'react-bootstrap';
import { Appointment, Customer, Job } from '../lib/types';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    jobId: '',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    status: 'Geplant' as Appointment['status'],
  });

  useEffect(() => {
    setAppointments(storage.getAppointments());
    setCustomers(storage.getCustomers());
    setJobs(storage.getJobs());
  }, []);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unbekannt';
  };

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return '-';
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unbekannt';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAppointment) {
      const updatedAppointments = appointments.map(a => 
        a.id === editingAppointment.id 
          ? { 
              ...editingAppointment, 
              ...formData,
              jobId: formData.jobId || undefined,
            }
          : a
      );
      setAppointments(updatedAppointments);
      storage.saveAppointments(updatedAppointments);
    } else {
      const newAppointment: Appointment = {
        id: uuidv4(),
        customerId: formData.customerId,
        jobId: formData.jobId || undefined,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        status: formData.status,
        createdAt: new Date().toISOString(),
      };
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      storage.saveAppointments(updatedAppointments);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({
      customerId: '',
      jobId: '',
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      status: 'Geplant',
    });
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      customerId: appointment.customerId,
      jobId: appointment.jobId || '',
      title: appointment.title,
      description: appointment.description,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      location: appointment.location,
      status: appointment.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diesen Termin wirklich löschen?')) {
      const updatedAppointments = appointments.filter(a => a.id !== id);
      setAppointments(updatedAppointments);
      storage.saveAppointments(updatedAppointments);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const statusMap: Record<Appointment['status'], string> = {
      'Geplant': 'warning',
      'Bestätigt': 'primary',
      'Abgeschlossen': 'success',
      'Abgesagt': 'danger',
    };
    return <Badge bg={statusMap[status]}>{status}</Badge>;
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Termine</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Neuer Termin
        </Button>
      </div>

      <Card>
        <Card.Body>
          {appointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Noch keine Termine vorhanden. Klicken Sie auf "Neuer Termin" um zu beginnen.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Kunde</th>
                  <th>Auftrag</th>
                  <th>Datum</th>
                  <th>Zeit</th>
                  <th>Ort</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td><strong>{appointment.title}</strong></td>
                    <td>{getCustomerName(appointment.customerId)}</td>
                    <td>{getJobTitle(appointment.jobId)}</td>
                    <td>{new Date(appointment.date).toLocaleDateString('de-DE')}</td>
                    <td>{appointment.startTime} - {appointment.endTime}</td>
                    <td>{appointment.location}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(appointment)}
                      >
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
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
            {editingAppointment ? 'Termin bearbeiten' : 'Neuer Termin'}
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
                  <Form.Label>Auftrag (optional)</Form.Label>
                  <Form.Select
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  >
                    <option value="">Kein Auftrag</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Titel *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>

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
                  <Form.Label>Datum *</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Startzeit *</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Endzeit *</Form.Label>
                  <Form.Control
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Ort *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                  >
                    <option value="Geplant">Geplant</option>
                    <option value="Bestätigt">Bestätigt</option>
                    <option value="Abgeschlossen">Abgeschlossen</option>
                    <option value="Abgesagt">Abgesagt</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button variant="primary" type="submit">
              {editingAppointment ? 'Speichern' : 'Erstellen'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
