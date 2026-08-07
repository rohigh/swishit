'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function checkAdminAndFetch() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // Security check: Must be authenticated AND match the admin email
        const userEmail = user?.email?.toLowerCase().trim();
        if (error || !user || userEmail !== 'swishitt@gmail.com') {
          console.log("Admin auth rejected. User object:", user);
          setAuthError(`Access Denied! \nEmail detected: ${user?.email || 'None'}`);
          setLoading(false);
          return;
        }
        
        setUser(user);

        // Fetch ALL orders
        const { data: dbOrders, error: dbErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbErr) throw dbErr;
        
        setOrders(dbOrders || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
        setLoadingOrders(false);
      }
    }
    checkAdminAndFetch();
  }, [router, supabase]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistic UI update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating status:', errorData.error);
        
        // Revert on error
        const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
        if (data) {
           setOrders(orders.map(o => o.id === orderId ? data : o));
        }
        alert('Failed to update order status securely. See console.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-body text-text">
        <Navbar />
        <main className="flex-grow pt-36 pb-20 flex items-center justify-center">
          <div className="w-12 h-12 border-3 border-text/20 border-t-text rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-body text-text">
        <Navbar />
        <main className="flex-grow pt-36 pb-20 flex flex-col items-center justify-center px-4">
          <div className="bg-red-50 text-red-800 p-8 rounded-3xl border border-red-200 shadow-md max-w-lg text-center">
            <h2 className="text-2xl font-heading font-bold mb-4">Security Rejection</h2>
            <p className="whitespace-pre-wrap font-mono text-sm">{authError}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  // Analytics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, ord) => sum + (ord.total || 0), 0);
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const completedCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body text-text">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-text/70 font-medium">Manage all incoming Swishit orders and revenue.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-text/10 flex flex-col">
            <span className="text-sm font-mono font-bold uppercase text-text/60 mb-1">Total Revenue</span>
            <span className="text-3xl font-heading font-bold text-text">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-text/10 flex flex-col">
            <span className="text-sm font-mono font-bold uppercase text-text/60 mb-1">Total Orders</span>
            <span className="text-3xl font-heading font-bold text-text">{orders.length}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-text/10 flex flex-col">
            <span className="text-sm font-mono font-bold uppercase text-text/60 mb-1">Pending Processing</span>
            <span className="text-3xl font-heading font-bold text-[#F0A93B]">{processingCount}</span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-text/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-text/10 flex justify-between items-center bg-surface-raised">
            <h2 className="text-xl font-heading font-semibold">All Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface/50 border-b border-text/10 text-xs font-mono font-bold uppercase tracking-wider text-text/60">
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text/10">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-text/60 font-medium">
                      No orders found in the database.
                    </td>
                  </tr>
                ) : (
                  orders.map(ord => {
                    const addr = ord.shipping_address || {};
                    const items = Array.isArray(ord.items) ? ord.items : [];
                    return (
                      <tr key={ord.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-6 py-4 align-top">
                          <div className="font-mono font-bold text-sm mb-1">{ord.order_number}</div>
                          <div className="text-xs text-text/60">
                            {new Date(ord.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                          </div>
                          <div className="mt-2 text-xs font-bold uppercase text-text/70">{ord.payment_method === 'online' ? '💳 Online' : '🚚 COD'}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="font-semibold text-sm mb-1">{addr.firstName} {addr.lastName}</div>
                          <div className="text-xs text-text/80 mb-1">{addr.email}</div>
                          <div className="text-xs text-text/60">{addr.phone}</div>
                          <div className="mt-2 text-xs text-text/60 max-w-[200px] truncate" title={`${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}`}>
                            {addr.street}, {addr.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="space-y-1">
                            {items.map((it, idx) => (
                              <div key={idx} className="text-xs flex items-center gap-2">
                                <span className="font-bold text-text">x{it.quantity}</span>
                                <span className="truncate max-w-[150px]" title={it.title}>{it.title}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="font-bold text-sm font-heading">₹{ord.total}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <select 
                            value={ord.status || 'Processing'} 
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className={`text-xs font-bold rounded-full px-3 py-1.5 border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                              ord.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                              ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              ord.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-[#F0A93B]/20 text-[#D48820] border-[#F0A93B]/30'
                            }`}
                          >
                            <option value="Processing">● Processing</option>
                            <option value="Shipped">● Shipped</option>
                            <option value="Delivered">● Delivered</option>
                            <option value="Cancelled">● Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
