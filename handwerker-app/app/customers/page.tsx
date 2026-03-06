'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card, Badge } from 'react-bootstrap';
import { Customer } from '../lib/types';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    setCustomers(storage.getCustomers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      const updatedCustomers = customers.map(c => 
        c.id === editingCustomer.id 
          ? { ...editingCustomer, ...formData }
          : c
      );
      setCustomers(updatedCustomers);
      storage.saveCustomers(updatedCustomers);
    } else {
      const newCustomer: Customer = {
        id: uuidv4(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      storage.saveCustomers(updatedCustomers);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      notes: customer.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      const updatedCustomers = customers.filter(c => c.id !== id);
      setCustomers(updatedCustomers);
      storage.saveCustomers(updatedCustomers);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Kunden</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Neuer Kunde
        </Button>
      </div>

      <Card>
        <Card.Body>
          {customers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Noch keine Kunden vorhanden. Klicken Sie auf "Neuer Kunde" um zu beginnen.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Adresse</th>
                  <th>Erstellt am</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td><strong>{customer.name}</strong></td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString('de-DE')}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(customer)}
                      >
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
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
            {editingCustomer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon *</Form.Label>
              <Form.Control
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresse *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notizen</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button variant="primary" type="submit">
              {editingCustomer ? 'Speichern' : 'Erstellen'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
