import React, { useState } from 'react';
import { Plus, Eye, Edit, Send, DollarSign, Download, Trash2 } from 'lucide-react';
import { Invoice } from '../../types';
import { mockInvoices } from '../../data/mockData';
import { Modal } from '../UI/Modal';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { InvoiceForm } from './InvoiceForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function InvoicesList() {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', mockInvoices);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(i => 
        i.id === editingInvoice.id 
          ? { ...i, ...invoiceData }
          : i
      ));
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        ...invoiceData,
        createdAt: new Date().toISOString()
      };
      setInvoices(prev => [...prev, newInvoice]);
    }
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      setInvoices(prev => prev.filter(i => i.id !== invoiceToDelete.id));
      setShowDeleteDialog(false);
      setInvoiceToDelete(null);
    }
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(prev => prev.map(i => 
      i.id === invoiceId 
        ? { 
            ...i, 
            status: newStatus, 
            paidAt: newStatus === 'paid' ? new Date().toISOString() : i.paidAt 
          }
        : i
    ));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
            <p className="text-sm text-gray-600">Manage billing and payment collection</p>
          </div>
          <button 
            onClick={handleCreateInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
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
                    Due Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                        <p className="text-sm text-gray-600">{invoice.customer.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">${invoice.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value as Invoice['status'])}
                        className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(invoice.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(invoice.id, 'sent')}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          disabled={invoice.status === 'sent' || invoice.status === 'paid'}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(invoice.id, 'paid')}
                          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                          disabled={invoice.status === 'paid'}
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteInvoice(invoice)}
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
        title={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
      >
        <InvoiceForm
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoiceToDelete?.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}