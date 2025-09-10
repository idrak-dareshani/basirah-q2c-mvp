import React, { useState } from 'react';
import { Invoice, Order } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabase';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSave: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
  const { data: ordersData } = useSupabaseQuery<any>(
    'q2c_orders',
    `
      *,
      customer:q2c_customers(*),
      quote:q2c_quotes(
        items:q2c_quote_items(
          *,
          product:q2c_products(*)
        )
      )
    `,
    []
  );
  const [selectedOrderId, setSelectedOrderId] = useState(invoice?.orderId || '');
  const [status, setStatus] = useState<Invoice['status']>(invoice?.status || 'draft');
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ''
  );

  // Transform orders data
  const orders: Order[] = ordersData.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    quoteId: order.quote_id,
    customerId: order.customer_id,
    customer: {
      id: order.customer.id,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      company: order.customer.company,
      address: order.customer.address,
      createdAt: order.customer.created_at
    },
    items: order.quote.items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        category: item.product.category,
        sku: item.product.sku
      },
      quantity: item.quantity,
      unitPrice: item.unit_price,
      discount: item.discount,
      total: item.total
    })),
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }));

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const availableOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) return;

    const invoiceData = {
      invoiceNumber: invoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      orderId: selectedOrderId,
      customerId: selectedOrder.customerId,
      customer: selectedOrder.customer,
      items: selectedOrder.items,
      total: selectedOrder.total,
      status,
      dueDate: new Date(dueDate).toISOString(),
      paidAt: status === 'paid' ? new Date().toISOString() : undefined
    };

    onSave(invoiceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order *
          </label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!!invoice}
          >
            <option value="">Select an order</option>
            {availableOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.orderNumber} - {order.customer.name} (${order.total.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Invoice['status'])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {selectedOrder && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Invoice Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="text-sm font-medium">{selectedOrder.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Company:</span>
              <span className="text-sm font-medium">{selectedOrder.customer.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Items:</span>
              <span className="text-sm font-medium">{selectedOrder.items.length}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>${selectedOrder.total.toLocaleString()}</span>
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
          disabled={!selectedOrderId || !dueDate}
        >
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}