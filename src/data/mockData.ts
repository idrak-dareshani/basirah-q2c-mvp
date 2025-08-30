import { Customer, Product, Quote, Order, Invoice, DashboardStats } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    address: '123 Business Ave, New York, NY 10001',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@innovate.io',
    phone: '+1 (555) 987-6543',
    company: 'Innovate Industries',
    address: '456 Innovation Dr, San Francisco, CA 94105',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@globaltech.com',
    phone: '+1 (555) 456-7890',
    company: 'GlobalTech Enterprises',
    address: '789 Enterprise Blvd, Austin, TX 73301',
    createdAt: '2024-02-01T09:15:00Z'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Enterprise Software License',
    description: 'Annual license for enterprise software suite',
    price: 5000,
    category: 'Software',
    sku: 'ESL-001'
  },
  {
    id: '2',
    name: 'Professional Consulting',
    description: 'Expert consulting services per hour',
    price: 200,
    category: 'Services',
    sku: 'PC-002'
  },
  {
    id: '3',
    name: 'Cloud Storage Package',
    description: 'Premium cloud storage with 1TB capacity',
    price: 100,
    category: 'Cloud Services',
    sku: 'CSP-003'
  },
  {
    id: '4',
    name: 'Security Audit',
    description: 'Comprehensive security assessment',
    price: 3000,
    category: 'Security',
    sku: 'SA-004'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'Q-2024-001',
    customerId: '1',
    customer: mockCustomers[0],
    items: [
      {
        id: '1',
        productId: '1',
        product: mockProducts[0],
        quantity: 2,
        unitPrice: 5000,
        discount: 0.1,
        total: 9000
      }
    ],
    subtotal: 10000,
    tax: 1000,
    total: 9000,
    status: 'approved',
    validUntil: '2024-03-15T23:59:59Z',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    quoteNumber: 'Q-2024-002',
    customerId: '2',
    customer: mockCustomers[1],
    items: [
      {
        id: '2',
        productId: '2',
        product: mockProducts[1],
        quantity: 50,
        unitPrice: 200,
        discount: 0.05,
        total: 9500
      }
    ],
    subtotal: 10000,
    tax: 950,
    total: 9500,
    status: 'sent',
    validUntil: '2024-04-01T23:59:59Z',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    quoteId: '1',
    customerId: '1',
    customer: mockCustomers[0],
    items: mockQuotes[0].items,
    total: 9000,
    status: 'confirmed',
    createdAt: '2024-02-16T10:00:00Z',
    updatedAt: '2024-02-16T10:00:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    orderId: '1',
    customerId: '1',
    customer: mockCustomers[0],
    items: mockQuotes[0].items,
    total: 9000,
    status: 'sent',
    dueDate: '2024-03-16T23:59:59Z',
    createdAt: '2024-02-17T10:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalQuotes: 45,
  totalOrders: 32,
  totalRevenue: 285000,
  pendingPayments: 45000,
  quotesThisMonth: 8,
  ordersThisMonth: 6,
  revenueThisMonth: 54000,
  conversionRate: 71.1
};