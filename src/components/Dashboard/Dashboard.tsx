import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { SalesChart } from './SalesChart';
import { PipelineOverview } from './PipelineOverview';
import { FileText, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockQuotes, mockOrders, mockInvoices } from '../../data/mockData';
import { Quote, Order, Invoice } from '../../types';

export function Dashboard() {
  const [quotes] = useLocalStorage<Quote[]>('quotes', mockQuotes);
  const [orders] = useLocalStorage<Order[]>('orders', mockOrders);
  const [invoices] = useLocalStorage<Invoice[]>('invoices', mockInvoices);

  // Calculate real-time stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const quotesThisMonth = quotes.filter(q => {
    const quoteDate = new Date(q.createdAt);
    return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear;
  }).length;

  const ordersThisMonth = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  }).length;

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const revenueThisMonth = invoices
    .filter(i => {
      const invoiceDate = new Date(i.createdAt);
      return i.status === 'paid' && 
             invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear;
    })
    .reduce((sum, i) => sum + i.total, 0);

  const pendingPayments = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  const conversionRate = quotes.length > 0 
    ? (orders.length / quotes.length) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quotes"
          value={quotes.length}
          change={`+${quotesThisMonth} this month`}
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Active Orders"
          value={orders.length}
          change={`+${ordersThisMonth} this month`}
          changeType="positive"
          icon={ShoppingCart}
          color="emerald"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={`+$${revenueThisMonth.toLocaleString()} this month`}
          changeType="positive"
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="Pending Payments"
          value={`$${pendingPayments.toLocaleString()}`}
          change={`${conversionRate.toFixed(1)}% conversion rate`}
          changeType="neutral"
          icon={Clock}
          color="amber"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart quotes={quotes} orders={orders} invoices={invoices} />
        <PipelineOverview quotes={quotes} />
      </div>
      
      <RecentActivity quotes={quotes} orders={orders} invoices={invoices} />
    </div>
  );
}