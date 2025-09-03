import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Customer } from '../../types';
import { mockCustomers } from '../../data/mockData';
import { Modal } from '../UI/Modal';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { CustomerForm } from './CustomerForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function CustomersList() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', mockCustomers);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id 
          ? { ...c, ...customerData }
          : c
      ));
    } else {
      // Create new customer
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...customerData,
        createdAt: new Date().toISOString()
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
            <p className="text-sm text-gray-600">Manage your customer relationships</p>
          </div>
          <button 
            onClick={handleCreateCustomer}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{customer.name}</h4>
                  <p className="text-sm text-gray-600">{customer.company}</p>
                </div>
                <div className="flex space-x-1">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditCustomer(customer)}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCustomer(customer)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{customer.address}</p>
                </div>
              </div>
            
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Customer since {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}