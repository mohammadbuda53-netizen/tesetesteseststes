export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  notes?: string;
}

export interface Job {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: 'Offen' | 'In Bearbeitung' | 'Abgeschlossen' | 'Storniert';
  priority: 'Niedrig' | 'Mittel' | 'Hoch';
  startDate?: string;
  endDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  photos?: string[];
}

export interface Appointment {
  id: string;
  customerId: string;
  jobId?: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'Geplant' | 'Bestätigt' | 'Abgeschlossen' | 'Abgesagt';
  createdAt: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  jobId?: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Entwurf' | 'Gesendet' | 'Bezahlt' | 'Überfällig';
  createdAt: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalCustomers: number;
  activeJobs: number;
  upcomingAppointments: number;
  pendingInvoices: number;
  monthlyRevenue: number;
}
