import React from 'react';

export function SalesChart() {
  const data = [
    { month: 'Jan', revenue: 45000, quotes: 12 },
    { month: 'Feb', revenue: 52000, quotes: 15 },
    { month: 'Mar', revenue: 48000, quotes: 13 },
    { month: 'Apr', revenue: 61000, quotes: 18 },
    { month: 'May', revenue: 55000, quotes: 16 },
    { month: 'Jun', revenue: 67000, quotes: 20 },
  ];
  
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <p className="text-sm text-gray-600">Monthly revenue and quote activity</p>
      </div>
      
      <div className="h-64 flex items-end space-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full relative mb-2">
              <div 
                className="bg-blue-600 rounded-t-md transition-all duration-500 hover:bg-blue-700"
                style={{ 
                  height: `${(item.revenue / maxRevenue) * 200}px`,
                  minHeight: '20px'
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">{item.month}</p>
              <p className="text-xs text-gray-600">${(item.revenue / 1000).toFixed(0)}k</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}