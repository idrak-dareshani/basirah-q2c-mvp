import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { mockProducts } from '../../data/mockData';

export function ProductsList() {
  const [products] = useState<Product[]>(mockProducts);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'software': return 'bg-blue-100 text-blue-800';
      case 'services': return 'bg-emerald-100 text-emerald-800';
      case 'cloud services': return 'bg-purple-100 text-purple-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Products & Services</h3>
          <p className="text-sm text-gray-600">Manage your product catalog and pricing</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SKU:</span>
                <span className="text-sm font-medium text-gray-900">{product.sku}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="text-lg font-bold text-emerald-600">${product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}