import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { QuotesList } from './components/Quotes/QuotesList';
import { CustomersList } from './components/Customers/CustomersList';
import { OrdersList } from './components/Orders/OrdersList';
import { InvoicesList } from './components/Invoices/InvoicesList';
import { ProductsList } from './components/Products/ProductsList';
import { Settings } from './components/Settings/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'quotes': return 'Quotes';
      case 'customers': return 'Customers';
      case 'orders': return 'Orders';
      case 'invoices': return 'Invoices';
      case 'products': return 'Products & Services';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'quotes': return <QuotesList />;
      case 'customers': return <CustomersList />;
      case 'orders': return <OrdersList />;
      case 'invoices': return <InvoicesList />;
      case 'products': return <ProductsList />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;