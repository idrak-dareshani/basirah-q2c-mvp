import React, { useState } from 'react';
import { Save, User, Building, CreditCard, Bell, Shield, Database } from 'lucide-react';
import { generateSeedData } from '../../utils/seedData';

export function Settings() {
  const [activeSection, setActiveSection] = useState('company');
  const [isGeneratingSeed, setIsGeneratingSeed] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  const sections = [
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleGenerateSeedData = async () => {
    setIsGeneratingSeed(true);
    setSeedResult(null);
    
    try {
      const result = await generateSeedData();
      setSeedResult(result);
    } catch (error) {
      console.error('Failed to generate seed data:', error);
      setSeedResult({ error: 'Failed to generate seed data' });
    } finally {
      setIsGeneratingSeed(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        <p className="text-sm text-gray-600">Configure your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeSection === 'company' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Basirah Technologies"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID
                    </label>
                    <input
                      type="text"
                      defaultValue="123-45-6789"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      defaultValue="123 Business Street, Suite 100, City, State 12345"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">User Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john.doe@basirah.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Sales Manager</option>
                      <option>Admin</option>
                      <option>Sales Representative</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Data Management</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h5 className="font-medium text-amber-800 mb-2">Generate Sample Data</h5>
                  <p className="text-sm text-amber-700 mb-4">
                    This will populate your database with sample customers, products, quotes, orders, and invoices. 
                    <strong className="text-amber-800"> Warning: This will clear existing data!</strong>
                  </p>
                  <button
                    onClick={handleGenerateSeedData}
                    disabled={isGeneratingSeed}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isGeneratingSeed ? 'Generating...' : 'Generate Sample Data'}</span>
                  </button>
                  
                  {seedResult && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      {seedResult.error ? (
                        <p className="text-red-600 text-sm">{seedResult.error}</p>
                      ) : (
                        <div className="text-sm text-green-700">
                          <p className="font-medium mb-2">✅ Sample data generated successfully!</p>
                          <ul className="space-y-1">
                            <li>• {seedResult.customers} customers</li>
                            <li>• {seedResult.products} products</li>
                            <li>• {seedResult.quotes} quotes</li>
                            <li>• {seedResult.quoteItems} quote items</li>
                            <li>• {seedResult.orders} orders</li>
                            <li>• {seedResult.invoices} invoices</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}