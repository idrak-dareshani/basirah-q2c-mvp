import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Send } from 'lucide-react';
import { Quote } from '../../types';
import { mockQuotes } from '../../data/mockData';
import { QuoteForm } from './QuoteForm';
import { Modal } from '../UI/Modal';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function QuotesList() {
  const [quotes, setQuotes] = useLocalStorage<Quote[]>('quotes', mockQuotes);
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateQuote = () => {
    setEditingQuote(null);
    setShowForm(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleSaveQuote = (quoteData: Partial<Quote>) => {
    if (editingQuote) {
      // Update existing quote
      setQuotes(prev => prev.map(q => 
        q.id === editingQuote.id 
          ? { ...q, ...quoteData, updatedAt: new Date().toISOString() }
          : q
      ));
    } else {
      // Create new quote
      const newQuote: Quote = {
        id: Date.now().toString(),
        quoteNumber: `Q-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`,
        ...quoteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Quote;
      setQuotes(prev => [...prev, newQuote]);
    }
    setShowForm(false);
    setEditingQuote(null);
  };

  const handleDeleteQuote = (quote: Quote) => {
    setQuoteToDelete(quote);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (quoteToDelete) {
      setQuotes(prev => prev.filter(q => q.id !== quoteToDelete.id));
      setShowDeleteDialog(false);
      setQuoteToDelete(null);
    }
  };

  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    setQuotes(prev => prev.map(q => 
      q.id === quoteId 
        ? { ...q, status: newStatus, updatedAt: new Date().toISOString() }
        : q
    ));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quotes</h3>
            <p className="text-sm text-gray-600">Manage your sales quotes and proposals</p>
          </div>
          <button
            onClick={handleCreateQuote}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Quote</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote #
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
                    Valid Until
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{quote.quoteNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{quote.customer.name}</p>
                        <p className="text-sm text-gray-600">{quote.customer.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">${quote.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as Quote['status'])}
                        className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(quote.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditQuote(quote)}
                          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(quote.id, 'sent')}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          disabled={quote.status === 'sent'}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuote(quote)}
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
        title={editingQuote ? 'Edit Quote' : 'Create New Quote'}
        size="xl"
      >
        <QuoteForm 
          quote={editingQuote}
          onClose={() => setShowForm(false)}
          onSave={handleSaveQuote}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Quote"
        message={`Are you sure you want to delete quote ${quoteToDelete?.quoteNumber}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}