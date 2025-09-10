import React from 'react';
import { 
  BarChart3,
  FileText, 
  Users, 
  ShoppingCart, 
  Receipt, 
  Package,
  Settings,
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
    <div className={`fixed left-0 top-16 z-30 ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-[calc(100vh-4rem)] flex flex-col transition-all duration-300`}>
      <nav className="flex-1 pt-5 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'} text-left rounded-lg transition-all duration-200 hover:bg-blue-50 ${
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
    </div>
  );
}