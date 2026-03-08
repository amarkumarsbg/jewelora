import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  X,
  Package,
  MessageSquare,
  PlusCircle,
  DollarSign,
  FileText,
  Layers,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";

const adminNavItems = [
  { path: "/admin/orders", label: "Orders", icon: Package },
  { path: "/admin/sales", label: "Sales Dashboard", icon: BarChart3 },
  { path: "/admin/message", label: "Messages", icon: MessageSquare },
  { path: "/addproduct", label: "Add Product", icon: PlusCircle },
  { path: "/admin/finance", label: "Finance", icon: DollarSign },
  { path: "/admin/finance/add", label: "Add Finance", icon: FileText },
  { path: "/admin/inventory", label: "Inventory", icon: Layers },
];

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 h-screen bg-white border-r border-border z-30">
        <div className="p-6 border-b border-border">
          <span className="font-heading text-xl font-bold text-neutral-dark">
            Jewelora Admin
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNavItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-neutral-mid hover:bg-primary-light/50 hover:text-primary"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <span className="font-heading text-lg font-bold">Admin</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-2"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {adminNavItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive ? "bg-primary-light text-primary" : "text-neutral-mid"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-20 lg:top-0 z-20 bg-white/95 backdrop-blur border-b border-border px-4 py-4 lg:px-8 flex items-center justify-between">
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 text-sm text-neutral-mid">
              <User size={18} />
              <span>{currentUser?.email}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
