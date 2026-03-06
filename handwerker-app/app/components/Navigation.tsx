'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} href="/">
          🔨 Handwerker Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              href="/" 
              active={pathname === '/'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/customers" 
              active={pathname?.startsWith('/customers')}
            >
              Kunden
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/jobs" 
              active={pathname?.startsWith('/jobs')}
            >
              Aufträge
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/appointments" 
              active={pathname?.startsWith('/appointments')}
            >
              Termine
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              href="/invoices" 
              active={pathname?.startsWith('/invoices')}
            >
              Rechnungen
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
