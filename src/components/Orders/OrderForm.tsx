import React, { useState } from 'react';
import { Order, Quote } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockQuotes } from '../../data/mockData';

interface OrderFormProps {
  order?: Order | null;
  onSave: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  const [quotes] = useLocalStorage<Quote[]>('quotes', mockQuotes);
  const [selectedQuoteId, setSelectedQuoteId] = useState(order?.quoteId || '');
  const [status, setStatus] = useState<Order['status']>(order?.status || 'pending');

  const selectedQuote = quotes.find(q => q.id === selectedQuoteId);
  const approvedQuotes = quotes.filter(q => q.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedQuote) return;

    const orderData = {
      orderNumber: order?.orderNumber || `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      quoteId: selectedQuoteId,
      customerId: selectedQuote.customerId,
      customer: selectedQuote.customer,
      items: selectedQuote.items,
      total: selectedQuote.total,
      status
    };

    onSave(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quote *
          </label>
          <select
            value={selectedQuoteId}
            onChange={(e) => setSelectedQuoteId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!!order}
          >
            <option value="">Select an approved quote</option>
            {approvedQuotes.map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.quoteNumber} - {quote.customer.name} (${quote.total.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Order['status'])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {selectedQuote && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="text-sm font-medium">{selectedQuote.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Company:</span>
              <span className="text-sm font-medium">{selectedQuote.customer.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Items:</span>
              <span className="text-sm font-medium">{selectedQuote.items.length}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>${selectedQuote.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          disabled={!selectedQuoteId}
        >
          {order ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}