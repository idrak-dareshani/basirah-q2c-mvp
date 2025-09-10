import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  ShoppingCart, 
  Receipt, 
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'quotes', label: 'Quotes', icon: FileText },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-screen flex flex-col transition-all duration-300`}>
      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-200 flex items-center justify-between`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Basirah-Q2C</h1>
            <p className="text-sm text-gray-600 mt-1">Quote to Cash System</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} text-left rounded-lg transition-all duration-200 hover:bg-blue-50 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          className={`w-full flex items-center ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} text-left rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <span className="font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
}