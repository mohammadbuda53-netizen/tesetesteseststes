'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Card, Badge, Row, Col } from 'react-bootstrap';
import { Invoice, InvoiceItem, Customer, Job } from '../lib/types';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    jobId: '',
    invoiceNumber: '',
    date: '',
    dueDate: '',
    status: 'Entwurf' as Invoice['status'],
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([{
    id: uuidv4(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0,
  }]);

  useEffect(() => {
    setInvoices(storage.getInvoices());
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

  const calculateTotals = (invoiceItems: InvoiceItem[]) => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.19;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].unitPrice = unitPrice;
    newItems[index].total = quantity * unitPrice;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { subtotal, tax, total } = calculateTotals(items);
    
    if (editingInvoice) {
      const updatedInvoices = invoices.map(inv => 
        inv.id === editingInvoice.id 
          ? { 
              ...editingInvoice, 
              ...formData,
              jobId: formData.jobId || undefined,
              items,
              subtotal,
              tax,
              total,
            }
          : inv
      );
      setInvoices(updatedInvoices);
      storage.saveInvoices(updatedInvoices);
    } else {
      const newInvoice: Invoice = {
        id: uuidv4(),
        customerId: formData.customerId,
        jobId: formData.jobId || undefined,
        invoiceNumber: formData.invoiceNumber,
        date: formData.date,
        dueDate: formData.dueDate,
        items,
        subtotal,
        tax,
        total,
        status: formData.status,
        createdAt: new Date().toISOString(),
        notes: formData.notes || undefined,
      };
      const updatedInvoices = [...invoices, newInvoice];
      setInvoices(updatedInvoices);
      storage.saveInvoices(updatedInvoices);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({
      customerId: '',
      jobId: '',
      invoiceNumber: '',
      date: '',
      dueDate: '',
      status: 'Entwurf',
      notes: '',
    });
    setItems([{
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }]);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customerId: invoice.customerId,
      jobId: invoice.jobId || '',
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      dueDate: invoice.dueDate,
      status: invoice.status,
      notes: invoice.notes || '',
    });
    setItems(invoice.items);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diese Rechnung wirklich löschen?')) {
      const updatedInvoices = invoices.filter(inv => inv.id !== id);
      setInvoices(updatedInvoices);
      storage.saveInvoices(updatedInvoices);
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const statusMap: Record<Invoice['status'], string> = {
      'Entwurf': 'secondary',
      'Gesendet': 'primary',
      'Bezahlt': 'success',
      'Überfällig': 'danger',
    };
    return <Badge bg={statusMap[status]}>{status}</Badge>;
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `RE-${year}-${String(count).padStart(4, '0')}`;
  };

  const handleNewInvoice = () => {
    setFormData({
      ...formData,
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Rechnungen</h1>
        <Button variant="primary" onClick={handleNewInvoice}>
          + Neue Rechnung
        </Button>
      </div>

      <Card>
        <Card.Body>
          {invoices.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Noch keine Rechnungen vorhanden. Klicken Sie auf "Neue Rechnung" um zu beginnen.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Rechnungsnummer</th>
                  <th>Kunde</th>
                  <th>Auftrag</th>
                  <th>Datum</th>
                  <th>Fälligkeitsdatum</th>
                  <th>Betrag</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td><strong>{invoice.invoiceNumber}</strong></td>
                    <td>{getCustomerName(invoice.customerId)}</td>
                    <td>{getJobTitle(invoice.jobId)}</td>
                    <td>{new Date(invoice.date).toLocaleDateString('de-DE')}</td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString('de-DE')}</td>
                    <td><strong>{invoice.total.toFixed(2)} €</strong></td>
                    <td>{getStatusBadge(invoice.status)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(invoice)}
                      >
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
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

      <Modal show={showModal} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingInvoice ? 'Rechnung bearbeiten' : 'Neue Rechnung'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Rechnungsnummer *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
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
              <Col md={4}>
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

            <Row>
              <Col md={3}>
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
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fälligkeitsdatum *</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                  >
                    <option value="Entwurf">Entwurf</option>
                    <option value="Gesendet">Gesendet</option>
                    <option value="Bezahlt">Bezahlt</option>
                    <option value="Überfällig">Überfällig</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4 mb-3">Rechnungspositionen</h5>
            {items.map((item, index) => (
              <Row key={item.id} className="mb-2 align-items-end">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Beschreibung</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].description = e.target.value;
                        setItems(newItems);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Menge</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemTotal(index, parseFloat(e.target.value), item.unitPrice)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Preis (€)</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItemTotal(index, item.quantity, parseFloat(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Gesamt</Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={`${item.total.toFixed(2)} €`}
                    />
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    ×
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addItem} className="mt-2">
              + Position hinzufügen
            </Button>

            <Row className="mt-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Notizen</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Card className="bg-light">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Zwischensumme:</span>
                      <strong>{calculateTotals(items).subtotal.toFixed(2)} €</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>MwSt. (19%):</span>
                      <strong>{calculateTotals(items).tax.toFixed(2)} €</strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span><strong>Gesamt:</strong></span>
                      <strong className="text-primary fs-5">
                        {calculateTotals(items).total.toFixed(2)} €
                      </strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button variant="primary" type="submit">
              {editingInvoice ? 'Speichern' : 'Erstellen'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
