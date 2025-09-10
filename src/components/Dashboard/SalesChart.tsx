import React from 'react';

interface SalesChartProps {
  quotesData: any[];
  ordersData: any[];
  invoicesData: any[];
}

export function SalesChart({ quotesData, ordersData, invoicesData }: SalesChartProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  const data = months.map((month, index) => {
    const monthlyRevenue = invoicesData
      .filter((i: any) => {
        const invoiceDate = new Date(i.created_at);
        return i.status === 'paid' && 
               invoiceDate.getMonth() === index && 
               invoiceDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, i: any) => sum + i.total, 0);

    const monthlyQuotes = quotesData
      .filter((q: any) => {
        const quoteDate = new Date(q.created_at);
        return quoteDate.getMonth() === index && quoteDate.getFullYear() === currentYear;
      }).length;

    return {
      month,
      revenue: monthlyRevenue,
      quotes: monthlyQuotes
    };
  }).slice(0, 6); // Show last 6 months
  
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