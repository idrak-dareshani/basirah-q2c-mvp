import React from 'react';
import { FileText, ShoppingCart, Receipt, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'quote',
    title: 'Quote Q-2024-045 created',
    customer: 'TechCorp Solutions',
    amount: '$15,000',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    id: 2,
    type: 'order',
    title: 'Order ORD-2024-032 confirmed',
    customer: 'Innovate Industries',
    amount: '$9,500',
    time: '4 hours ago',
    icon: ShoppingCart,
    color: 'text-emerald-600'
  },
  {
    id: 3,
    type: 'invoice',
    title: 'Invoice INV-2024-028 paid',
    customer: 'GlobalTech Enterprises',
    amount: '$7,200',
    time: '1 day ago',
    icon: Receipt,
    color: 'text-purple-600'
  },
  {
    id: 4,
    type: 'quote',
    title: 'Quote Q-2024-044 expired',
    customer: 'StartupCo',
    amount: '$3,800',
    time: '2 days ago',
    icon: Clock,
    color: 'text-amber-600'
  }
];

export function RecentActivity() {
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