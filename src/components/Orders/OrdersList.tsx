import React, { useState } from 'react';
import { Plus, Eye, Edit, Truck, CheckCircle, Trash2 } from 'lucide-react';
import { Order } from '../../types';
import { mockOrders } from '../../data/mockData';
import { Modal } from '../UI/Modal';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { OrderForm } from './OrderForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function OrdersList() {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', mockOrders);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleSaveOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingOrder) {
      // Update existing order
      setOrders(prev => prev.map(o => 
        o.id === editingOrder.id 
          ? { ...o, ...orderData, updatedAt: new Date().toISOString() }
          : o
      ));
    } else {
      // Create new order
      const newOrder: Order = {
        id: Date.now().toString(),
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOrders(prev => [...prev, newOrder]);
    }
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
      setShowDeleteDialog(false);
      setOrderToDelete(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
        : o
    ));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
            <p className="text-sm text-gray-600">Track and manage customer orders</p>
          </div>
          <button 
            onClick={handleCreateOrder}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-sm text-gray-600">{order.customer.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">${order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          disabled={order.status === 'shipped' || order.status === 'delivered'}
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                          disabled={order.status === 'delivered'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingOrder ? 'Edit Order' : 'Create New Order'}
      >
        <OrderForm
          order={editingOrder}
          onSave={handleSaveOrder}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order ${orderToDelete?.orderNumber}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}