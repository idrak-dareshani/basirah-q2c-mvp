import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { SalesChart } from './SalesChart';
import { PipelineOverview } from './PipelineOverview';
import { FileText, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { mockDashboardStats } from '../../data/mockData';

export function Dashboard() {
  const stats = mockDashboardStats;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quotes"
          value={stats.totalQuotes}
          change={`+${stats.quotesThisMonth} this month`}
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Active Orders"
          value={stats.totalOrders}
          change={`+${stats.ordersThisMonth} this month`}
          changeType="positive"
          icon={ShoppingCart}
          color="emerald"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={`+$${stats.revenueThisMonth.toLocaleString()} this month`}
          changeType="positive"
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="Pending Payments"
          value={`$${stats.pendingPayments.toLocaleString()}`}
          change={`${stats.conversionRate}% conversion rate`}
          changeType="neutral"
          icon={Clock}
          color="amber"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <PipelineOverview />
      </div>
      
      <RecentActivity />
    </div>
  );
}