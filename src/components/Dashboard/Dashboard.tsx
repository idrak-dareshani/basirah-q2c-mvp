import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { SalesChart } from './SalesChart';
import { PipelineOverview } from './PipelineOverview';
import { FileText, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import { Quote, Order, Invoice } from '../../types';

export function Dashboard() {
  const { data: quotesData } = useSupabaseQuery<any>('q2c_quotes', '*');
  const { data: ordersData } = useSupabaseQuery<any>('q2c_orders', '*');
  const { data: invoicesData } = useSupabaseQuery<any>('q2c_invoices', '*');

  // Transform data for calculations
  const quotes = quotesData.length;
  const orders = ordersData.length;

  // Calculate real-time stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const quotesThisMonth = quotesData.filter((q: any) => {
    const quoteDate = new Date(q.created_at);
    return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear;
  }).length;

  const ordersThisMonth = ordersData.filter((o: any) => {
    const orderDate = new Date(o.created_at);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  }).length;

  const totalRevenue = invoicesData
    .filter((i: any) => i.status === 'paid')
    .reduce((sum: number, i: any) => sum + i.total, 0);

  const revenueThisMonth = invoicesData
    .filter((i: any) => {
      const invoiceDate = new Date(i.created_at);
      return i.status === 'paid' && 
             invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear;
    })
    .reduce((sum: number, i: any) => sum + i.total, 0);

  const pendingPayments = invoicesData
    .filter((i: any) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum: number, i: any) => sum + i.total, 0);

  const conversionRate = quotes > 0 
    ? (orders / quotes) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quotes"
          value={quotes}
          change={`+${quotesThisMonth} this month`}
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Active Orders"
          value={orders}
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
        <SalesChart quotesData={quotesData} ordersData={ordersData} invoicesData={invoicesData} />
        <PipelineOverview quotesData={quotesData} />
      </div>
      
      <RecentActivity quotesData={quotesData} ordersData={ordersData} invoicesData={invoicesData} />
    </div>
  );
}