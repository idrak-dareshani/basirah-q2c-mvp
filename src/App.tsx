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
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header 
          title="Basirah-Q2C" 
          subtitle="Quote to Cash System" 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 p-6 pt-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;