import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { IndianRupee, Package, Utensils, TrendingUp, Clock, ChevronRight, Settings } from 'lucide-react';
import OrdersTable from '@/components/admin/OrdersTable';
import SalesChart from '@/components/admin/SalesChart';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get total stats
  const { count: ordersCount } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true });

  const { count: menuCount } = await supabase
    .from('MenuItem')
    .select('*', { count: 'exact', head: true });

  const { data: revenueData } = await supabase
    .from('Order')
    .select('total')
    .eq('paymentStatus', 'PAID');

  const totalRevenue = revenueData?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  // Last 7 days sales data
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: weeklyOrders } = await supabase
    .from('Order')
    .select('total, createdAt')
    .gte('createdAt', sevenDaysAgo.toISOString())
    .eq('paymentStatus', 'PAID');

  // Process data for chart
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split('T')[0],
      day: days[d.getDay()],
      total: 0
    };
  });

  weeklyOrders?.forEach(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const dayData = last7Days.find(d => d.date === orderDate);
    if (dayData) {
      dayData.total += order.total || 0;
    }
  });

  const chartData = last7Days.map(({ day, total }) => ({ day, total }));

  const { data: recentOrders } = await supabase
    .from('Order')
    .select('*, orderItems:OrderItem(*)')
    .order('createdAt', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-500 mt-2 text-lg">Real-time overview of Tummy Tikki Burger</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/menu"
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Menu
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200 flex items-center gap-2"
              >
                Back to Website
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <SalesChart data={chartData} />
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-gray-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Pro Insights</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Growth Recommendation</p>

                <div className="mt-8 space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">Peak Day</p>
                    <p className="font-bold text-lg">{chartData.sort((a, b) => b.total - a.total)[0]?.day || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Avg Ticket</p>
                    <p className="font-bold text-lg">₹{ordersCount ? Math.round(totalRevenue / ordersCount) : 0}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                  View Full Report
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              Manage Orders
            </h2>
            <OrdersTable orders={recentOrders || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

