import React from 'react';

interface PipelineOverviewProps {
  quotesData: any[];
}

export function PipelineOverview({ quotesData }: PipelineOverviewProps) {
  const pipelineData = [
    { 
      stage: 'Draft', 
      count: quotesData.filter((q: any) => q.status === 'draft').length,
      value: quotesData.filter((q: any) => q.status === 'draft').reduce((sum: number, q: any) => sum + q.total, 0),
      color: 'bg-gray-400' 
    },
    { 
      stage: 'Sent', 
      count: quotesData.filter((q: any) => q.status === 'sent').length,
      value: quotesData.filter((q: any) => q.status === 'sent').reduce((sum: number, q: any) => sum + q.total, 0),
      color: 'bg-blue-500' 
    },
    { 
      stage: 'Approved', 
      count: quotesData.filter((q: any) => q.status === 'approved').length,
      value: quotesData.filter((q: any) => q.status === 'approved').reduce((sum: number, q: any) => sum + q.total, 0),
      color: 'bg-emerald-500' 
    },
    { 
      stage: 'Rejected', 
      count: quotesData.filter((q: any) => q.status === 'rejected').length,
      value: quotesData.filter((q: any) => q.status === 'rejected').reduce((sum: number, q: any) => sum + q.total, 0),
      color: 'bg-red-500' 
    },
  ];
  
  const totalValue = pipelineData.reduce((sum, stage) => sum + stage.value, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quote Pipeline</h3>
        <p className="text-sm text-gray-600">Current quotes by status</p>
      </div>
      
      <div className="space-y-4">
        {pipelineData.map((stage, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <span className="font-medium text-gray-900">{stage.stage}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{stage.count} quotes</p>
              <p className="text-sm text-gray-600">${stage.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Pipeline</span>
            <span className="font-bold text-lg text-blue-600">${totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}