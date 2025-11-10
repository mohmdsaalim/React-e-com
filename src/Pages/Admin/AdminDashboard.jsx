import React, { useState, useEffect } from 'react';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiPackage, 
  FiTrendingUp, 
  FiTrendingDown,
  FiAlertCircle, 
  FiCalendar, 
  FiEye, 
  FiRefreshCw, 
  FiBarChart2, 
  FiShoppingCart,
  FiStar,
  FiArrowRight,
  FiCreditCard
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  // FC Barcelona Colors
  const barcaColors = {
    primary: '#004D98',    // Dark Blue
    secondary: '#A50044',  // Red
    accent: '#EDBB00',     // Gold/Yellow
    lightBlue: '#5B8CD9',  // Light Blue
    lightRed: '#D94F8A',   // Light Red
    background: '#F5F7FA', // Light background
    cardBg: '#FFFFFF'      // White cards
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:3000/orders'),
        axios.get('http://localhost:3000/users'),
        axios.get('http://localhost:3000/products')
      ]);

      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      
      // Flatten products from all categories
      const productsData = productsRes.data || {};
      const allProducts = [
        ...(productsData.kids_kits || []),
        ...(productsData.apparel || []),
        ...(productsData.new_era || [])
      ];

      // Calculate statistics
      const totalRevenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + (order.total || 0), 0);

      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const confirmedOrders = orders.filter(order => order.status === 'confirmed').length;
      const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.status === 'active').length;

      // Calculate product statistics
      const totalProducts = allProducts.length;
      const inStockProducts = allProducts.filter(p => p.stock_quantity > 10).length;
      const lowStockProducts = allProducts.filter(p => p.stock_quantity <= 10 && p.stock_quantity > 0).length;
      const outOfStockProducts = allProducts.filter(p => p.stock_quantity === 0).length;

      // Get recent orders (last 5)
      const recent = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Calculate top products based on orders
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          const productId = item.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              ...item,
              totalSales: 0,
              totalRevenue: 0
            };
          }
          productSales[productId].totalSales += item.quantity;
          productSales[productId].totalRevenue += item.price_inr * item.quantity;
        });
      });

      const topProductsData = Object.values(productSales)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 4)
        .map((product, index) => ({
          id: product.productId,
          name: product.name,
          sales: product.totalSales,
          revenue: product.totalRevenue,
          growth: Math.floor(Math.random() * 20) + 5 // Mock growth for now
        }));

      // Generate user activity from recent orders and user actions
      const activityData = recent.slice(0, 4).map(order => {
        const user = users.find(u => u.id === order.userId);
        return {
          user: user ? `${user.firstName} ${user.lastName}` : 'Customer',
          action: 'placed_order',
          target: order.items?.[0]?.name || 'Product',
          time: formatTimeAgo(order.createdAt),
          amount: order.total
        };
      });

      setStats({
        totalRevenue,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        totalUsers,
        activeUsers,
        totalOrders: orders.length,
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        conversionRate: Math.round((orders.length / Math.max(users.length, 1)) * 100) || 0,
        avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
      });

      setRecentOrders(recent);
      setTopProducts(topProductsData);
      setUserActivity(activityData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Mock data for charts based on actual orders
  const generateChartData = (orders) => {
    const monthlyData = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0 };
      }
      
      if (order.status === 'delivered') {
        monthlyData[month].revenue += order.total || 0;
      }
      monthlyData[month].orders += 1;
    });

    return Object.keys(monthlyData).map(month => ({
      name: month,
      revenue: monthlyData[month].revenue,
      orders: monthlyData[month].orders
    }));
  };

  const generateSalesData = (products) => {
    const categories = {};
    
    products.forEach(product => {
      const category = product.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      // Mock sales data based on stock movement
      categories[category] += Math.floor((100 - product.stock_quantity) * 10);
    });

    const colors = [barcaColors.primary, barcaColors.secondary, barcaColors.accent, barcaColors.lightBlue, barcaColors.lightRed];
    
    return Object.keys(categories).map((category, index) => ({
      name: category,
      sales: categories[category],
      fill: colors[index % colors.length]
    }));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const refreshData = () => {
    fetchDashboardData();
    toast.success('Dashboard data refreshed');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: barcaColors.accent,
      confirmed: barcaColors.lightBlue,
      processing: barcaColors.primary,
      shipped: barcaColors.secondary,
      delivered: '#10b981', // Green for delivered
      cancelled: '#ef4444'  // Red for cancelled
    };
    return colors[status] || '#6b7280';
  };

  const getActionIcon = (action) => {
    const icons = {
      placed_order: <FiShoppingCart className="w-5 h-5" />,
      created_account: <FiUsers className="w-5 h-5" />,
      wrote_review: <FiStar className="w-5 h-5" />,
      updated_profile: <FiUsers className="w-5 h-5" />
    };
    return icons[action] || <FiUsers className="w-5 h-5" />;
  };

  const getActionColor = (action) => {
    const colors = {
      placed_order: `text-[${barcaColors.secondary}] bg-red-50`,
      created_account: `text-[${barcaColors.primary}] bg-blue-50`,
      wrote_review: `text-[${barcaColors.accent}] bg-yellow-50`,
      updated_profile: 'text-orange-600 bg-orange-100'
    };
    return colors[action] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const revenueData = generateChartData(recentOrders);
  const salesData = generateSalesData([...recentOrders.flatMap(order => order.items || [])]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                FC Barcelona Store
              </h1>
              <p className="text-gray-600">Dashboard Overview & Analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">₹{stats.totalRevenue?.toLocaleString()}</p>
              <div className="flex items-center">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-600">+{stats.conversionRate}%</span>
                <span className="text-sm text-gray-500 ml-2">conversion</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalOrders}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span className="text-green-600">{stats.deliveredOrders} delivered</span>
                <span>•</span>
                <span className="text-blue-600">{stats.confirmedOrders} confirmed</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.pendingOrders}</p>
              <div className="flex items-center">
                <FiAlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-yellow-600">Needs attention</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiPackage className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers}</p>
              <div className="flex items-center">
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-600">{stats.activeUsers} active</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Total Products</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <FiPackage className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">In Stock</p>
              <p className="text-lg font-bold text-green-600">{stats.inStockProducts}</p>
            </div>
            <FiTrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Low Stock</p>
              <p className="text-lg font-bold text-yellow-600">{stats.lowStockProducts}</p>
            </div>
            <FiTrendingDown className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Out of Stock</p>
              <p className="text-lg font-bold text-red-600">{stats.outOfStockProducts}</p>
            </div>
            <FiAlertCircle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Orders</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={barcaColors.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={barcaColors.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={barcaColors.primary} 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke={barcaColors.secondary} 
                  strokeWidth={2}
                  dot={{ fill: barcaColors.secondary, strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FiShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">
                      {order.items?.length || 0} items • {order.userId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">₹{order.total}</p>
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity & Top Products */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="flex items-center justify-center w-8 h-8 rounded text-white text-xs font-bold shadow"
                      style={{ 
                        backgroundColor: index === 0 ? barcaColors.accent : 
                                       index === 1 ? barcaColors.primary : 
                                       index === 2 ? barcaColors.secondary : '#6b7280'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">₹{product.revenue?.toLocaleString()}</p>
                    <div className="flex items-center text-green-600 text-xs">
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                      +{product.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {userActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="p-2 rounded-lg bg-blue-50">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {activity.action.replace('_', ' ')} {activity.target}
                    </p>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-semibold text-green-600 text-sm">₹{activity.amount}</p>
                    )}
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Avg. Order Value</p>
              <p className="text-lg font-bold text-gray-900">₹{stats.avgOrderValue}</p>
            </div>
            <FiCreditCard className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Conversion Rate</p>
              <p className="text-lg font-bold text-gray-900">{stats.conversionRate}%</p>
            </div>
            <FiBarChart2 className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Delivered Orders</p>
              <p className="text-lg font-bold text-gray-900">{stats.deliveredOrders}</p>
            </div>
            <FiPackage className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Cancelled Orders</p>
              <p className="text-lg font-bold text-gray-900">{stats.cancelledOrders}</p>
            </div>
            <FiAlertCircle className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;