'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { Customer, Job, Appointment, Invoice } from './lib/types';
import { storage } from './lib/storage';
import Link from 'next/link';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setCustomers(storage.getCustomers());
    setJobs(storage.getJobs());
    setAppointments(storage.getAppointments());
    setInvoices(storage.getInvoices());
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'In Bearbeitung' || j.status === 'Offen');
  
  const upcomingAppointments = appointments
    .filter(a => {
      const appointmentDate = new Date(a.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today && (a.status === 'Geplant' || a.status === 'Bestätigt');
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const pendingInvoices = invoices.filter(i => i.status === 'Gesendet' || i.status === 'Überfällig');
  
  const monthlyRevenue = invoices
    .filter(i => {
      const invoiceDate = new Date(i.date);
      const now = new Date();
      return invoiceDate.getMonth() === now.getMonth() && 
             invoiceDate.getFullYear() === now.getFullYear() &&
             i.status === 'Bezahlt';
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const recentJobs = jobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unbekannt';
  };

  const getJobStatusBadge = (status: Job['status']) => {
    const statusMap: Record<Job['status'], string> = {
      'Offen': 'warning',
      'In Bearbeitung': 'primary',
      'Abgeschlossen': 'success',
      'Storniert': 'danger',
    };
    return <Badge bg={statusMap[status]}>{status}</Badge>;
  };

  const getAppointmentStatusBadge = (status: Appointment['status']) => {
    const statusMap: Record<Appointment['status'], string> = {
      'Geplant': 'warning',
      'Bestätigt': 'primary',
      'Abgeschlossen': 'success',
      'Abgesagt': 'danger',
    };
    return <Badge bg={statusMap[status]}>{status}</Badge>;
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Kunden</p>
                  <h2 className="mb-0">{customers.length}</h2>
                </div>
                <div className="fs-1 text-primary">👥</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card success mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Aktive Aufträge</p>
                  <h2 className="mb-0">{activeJobs.length}</h2>
                </div>
                <div className="fs-1 text-success">📋</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card warning mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Anstehende Termine</p>
                  <h2 className="mb-0">{upcomingAppointments.length}</h2>
                </div>
                <div className="fs-1 text-warning">📅</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card danger mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Offene Rechnungen</p>
                  <h2 className="mb-0">{pendingInvoices.length}</h2>
                </div>
                <div className="fs-1 text-danger">💶</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Umsatz diesen Monat</p>
                  <h2 className="mb-0 text-success">{monthlyRevenue.toFixed(2)} €</h2>
                </div>
                <div className="fs-1">💰</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Anstehende Termine</h5>
                <Link href="/appointments" className="btn btn-sm btn-outline-primary">
                  Alle anzeigen
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted text-center py-3">Keine anstehenden Termine</p>
              ) : (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Titel</th>
                      <th>Kunde</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <small>
                            {new Date(appointment.date).toLocaleDateString('de-DE')}
                            <br />
                            {appointment.startTime}
                          </small>
                        </td>
                        <td><strong>{appointment.title}</strong></td>
                        <td>{getCustomerName(appointment.customerId)}</td>
                        <td>{getAppointmentStatusBadge(appointment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Aktuelle Aufträge</h5>
                <Link href="/jobs" className="btn btn-sm btn-outline-primary">
                  Alle anzeigen
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {recentJobs.length === 0 ? (
                <p className="text-muted text-center py-3">Keine Aufträge vorhanden</p>
              ) : (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Titel</th>
                      <th>Kunde</th>
                      <th>Status</th>
                      <th>Priorität</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map((job) => (
                      <tr key={job.id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{getCustomerName(job.customerId)}</td>
                        <td>{getJobStatusBadge(job.status)}</td>
                        <td>
                          <Badge bg={
                            job.priority === 'Hoch' ? 'danger' : 
                            job.priority === 'Mittel' ? 'info' : 
                            'secondary'
                          }>
                            {job.priority}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Offene Rechnungen</h5>
                <Link href="/invoices" className="btn btn-sm btn-outline-primary">
                  Alle anzeigen
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {pendingInvoices.length === 0 ? (
                <p className="text-muted text-center py-3">Keine offenen Rechnungen</p>
              ) : (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Rechnungsnummer</th>
                      <th>Kunde</th>
                      <th>Datum</th>
                      <th>Fälligkeitsdatum</th>
                      <th>Betrag</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td><strong>{invoice.invoiceNumber}</strong></td>
                        <td>{getCustomerName(invoice.customerId)}</td>
                        <td>{new Date(invoice.date).toLocaleDateString('de-DE')}</td>
                        <td>{new Date(invoice.dueDate).toLocaleDateString('de-DE')}</td>
                        <td><strong>{invoice.total.toFixed(2)} €</strong></td>
                        <td>
                          <Badge bg={
                            invoice.status === 'Überfällig' ? 'danger' : 
                            invoice.status === 'Gesendet' ? 'primary' : 
                            'secondary'
                          }>
                            {invoice.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
