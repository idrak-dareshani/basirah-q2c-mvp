import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Send } from 'lucide-react';
import { Quote } from '../../types';
import { QuoteForm } from './QuoteForm';
import { Modal } from '../UI/Modal';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { useSupabaseQuery, useSupabaseMutation } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';

export function QuotesList() {
  const { data: quotesData, loading, error, refetch } = useSupabaseQuery<any>(
    'q2c_quotes',
    `
      *,
      customer:q2c_customers(*),
      items:q2c_quote_items(
        *,
        product:q2c_products(*)
      )
    `
  );
  const { update, remove, loading: mutationLoading } = useSupabaseMutation('q2c_quotes');
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  // Transform Supabase data to match our Quote interface
  const quotes: Quote[] = quotesData.map((quote: any) => ({
    id: quote.id,
    quoteNumber: quote.quote_number,
    customerId: quote.customer_id,
    customer: {
      id: quote.customer.id,
      name: quote.customer.name,
      email: quote.customer.email,
      phone: quote.customer.phone,
      company: quote.customer.company,
      address: quote.customer.address,
      createdAt: quote.customer.created_at
    },
    items: quote.items.map((item: any) => ({
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
    subtotal: quote.subtotal,
    tax: quote.tax,
    total: quote.total,
    status: quote.status,
    validUntil: quote.valid_until,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at
  }));

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

  const handleSaveQuote = async (quoteData: Partial<Quote>) => {
    try {
      if (editingQuote) {
        // Update existing quote
        await update(editingQuote.id, {
          customer_id: quoteData.customerId,
          subtotal: quoteData.subtotal,
          tax: quoteData.tax,
          total: quoteData.total,
          valid_until: quoteData.validUntil,
          status: quoteData.status
        });

        // Update quote items
        if (quoteData.items) {
          // Delete existing items
          await supabase
            .from('q2c_quote_items')
            .delete()
            .eq('quote_id', editingQuote.id);

          // Insert new items
          const itemsToInsert = quoteData.items.map(item => ({
            quote_id: editingQuote.id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            discount: item.discount,
            total: item.total
          }));

          await supabase
            .from('q2c_quote_items')
            .insert(itemsToInsert);
        }
      } else {
        // Create new quote
        const quoteNumber = `Q-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`;
        
        const { data: newQuote, error } = await supabase
          .from('q2c_quotes')
          .insert({
            quote_number: quoteNumber,
            customer_id: quoteData.customerId,
            subtotal: quoteData.subtotal,
            tax: quoteData.tax,
            total: quoteData.total,
            valid_until: quoteData.validUntil,
            status: quoteData.status
          })
          .select()
          .single();

        if (error) throw error;

        // Insert quote items
        if (quoteData.items && newQuote) {
          const itemsToInsert = quoteData.items.map(item => ({
            quote_id: newQuote.id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            discount: item.discount,
            total: item.total
          }));

          await supabase
            .from('q2c_quote_items')
            .insert(itemsToInsert);
        }
      }
      
      await refetch();
    } catch (error) {
      console.error('Error saving quote:', error);
    }
    
    setShowForm(false);
    setEditingQuote(null);
  };

  const handleDeleteQuote = (quote: Quote) => {
    setQuoteToDelete(quote);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (quoteToDelete) {
      await remove(quoteToDelete.id);
      await refetch();
      setShowDeleteDialog(false);
      setQuoteToDelete(null);
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: Quote['status']) => {
    await update(quoteId, { status: newStatus });
    await refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading quotes: {error}</p>
        <button 
          onClick={refetch}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            disabled={mutationLoading}
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