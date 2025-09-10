import React from 'react';
import { FileText, ShoppingCart, Receipt, Clock } from 'lucide-react';

interface RecentActivityProps {
  quotesData: any[];
  ordersData: any[];
  invoicesData: any[];
}

export function RecentActivity({ quotesData, ordersData, invoicesData }: RecentActivityProps) {
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const activities = [
    ...quotesData.slice(-3).map((quote: any) => ({
      id: `quote-${quote.id}`,
      type: 'quote',
      title: `Quote ${quote.quote_number} ${quote.status}`,
      customer: 'Customer', // We'd need to join customer data
      amount: `$${quote.total.toLocaleString()}`,
      time: getTimeAgo(quote.updated_at),
      icon: FileText,
      color: 'text-blue-600'
    })),
    ...ordersData.slice(-2).map((order: any) => ({
      id: `order-${order.id}`,
      type: 'order',
      title: `Order ${order.order_number} ${order.status}`,
      customer: 'Customer', // We'd need to join customer data
      amount: `$${order.total.toLocaleString()}`,
      time: getTimeAgo(order.updated_at),
      icon: ShoppingCart,
      color: 'text-emerald-600'
    })),
    ...invoicesData.slice(-2).map((invoice: any) => ({
      id: `invoice-${invoice.id}`,
      type: 'invoice',
      title: `Invoice ${invoice.invoice_number} ${invoice.status}`,
      customer: 'Customer', // We'd need to join customer data
      amount: `$${invoice.total.toLocaleString()}`,
      time: getTimeAgo(invoice.created_at),
      icon: Receipt,
      color: 'text-purple-600'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600">Latest updates across your sales pipeline</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{activity.amount}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}