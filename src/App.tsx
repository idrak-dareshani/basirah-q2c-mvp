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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Basirah-Q2C', subtitle: 'Quote to Cash System' };
      case 'quotes': return { title: 'Quotes', subtitle: 'Manage your sales quotes and proposals' };
      case 'customers': return { title: 'Customers', subtitle: 'Manage your customer relationships' };
      case 'orders': return { title: 'Orders', subtitle: 'Track and manage customer orders' };
      case 'invoices': return { title: 'Invoices', subtitle: 'Manage billing and payment collection' };
      case 'products': return { title: 'Products & Services', subtitle: 'Manage your product catalog and pricing' };
      case 'settings': return { title: 'Settings', subtitle: 'Configure your account and system preferences' };
      default: return { title: 'Basirah-Q2C', subtitle: 'Quote to Cash System' };
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

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;