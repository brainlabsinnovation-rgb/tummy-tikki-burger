import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { IndianRupee, Package, Utensils, TrendingUp, Clock, ChevronRight } from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch stats using Supabase
  // Note: If RLS is enabled, these might require a Service Role key or authenticated user.
  // Using public client for now as requested.

  // Using authenticated client to respect RLS policies
  const supabase = await createClient();

  const { count: ordersCount } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true });

  const { count: menuCount } = await supabase
    .from('MenuItem')
    .select('*', { count: 'exact', head: true });

  // For revenue, we fetch 'total' of paid orders and sum it up
  const { data: revenueData } = await supabase
    .from('Order')
    .select('total')
    .eq('paymentStatus', 'PAID');

  const totalRevenue = revenueData?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('Order')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-500 mt-2 text-lg">Real-time overview of Tummy Tikki Burger</p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200 flex items-center gap-2"
            >
              Back to Website
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Orders Stat */}
            <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500 rounded-xl text-white">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-orange-900 uppercase tracking-wider">Total Orders</p>
              </div>
              <p className="text-4xl font-black text-gray-900">{ordersCount || 0}</p>
              <p className="text-orange-600 text-sm mt-1 font-medium">Updated just now</p>
            </div>

            {/* Menu Items Stat */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500 rounded-xl text-white">
                  <Utensils className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-blue-900 uppercase tracking-wider">Menu Items</p>
              </div>
              <p className="text-4xl font-black text-gray-900">{menuCount || 0}</p>
              <p className="text-blue-600 text-sm mt-1 font-medium">Available in menu</p>
            </div>

            {/* Revenue Stat */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500 rounded-xl text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-green-900 uppercase tracking-wider">Total Revenue</p>
              </div>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="w-6 h-6 text-gray-900" />
                <p className="text-4xl font-black text-gray-900">{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-green-600 text-sm mt-1 font-medium">Paid orders only</p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              Recent Orders
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-orange-600">{order.orderNumber}</span>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{order.deliveryName}</p>
                          <p className="text-xs text-gray-500">{order.deliveryPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.paymentStatus === 'PAID' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-black text-gray-900">₹{order.total}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                        No orders found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

