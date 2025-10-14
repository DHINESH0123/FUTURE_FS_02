import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, Users, Heart, ShoppingCart, Bell, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const KPI = ({ label, value, icon: Icon, testid }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card data-testid={testid} className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-1">{label}</div>
          <div className="text-3xl font-bold font-heading">{value}</div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function Admin() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/admin/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  // Mock chart data since we don't have historical data
  const priceDropData = [
    { date: 'Jan', drop: 12 },
    { date: 'Feb', drop: 19 },
    { date: 'Mar', drop: 15 },
    { date: 'Apr', drop: 25 },
    { date: 'May', drop: 22 },
    { date: 'Jun', drop: 30 }
  ];

  const userActivityData = [
    { name: 'Wishlist', value: analytics?.totalWishlists || 0 },
    { name: 'Cart', value: analytics?.totalCarts || 0 },
    { name: 'Alerts', value: analytics?.totalAlerts || 0 }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Analytics and insights for SMARTDEAL HUB</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KPI 
            label="Total Products" 
            value={analytics?.totalProducts || 0} 
            icon={Package}
            testid="kpi-products"
          />
          <KPI 
            label="Total Users" 
            value={analytics?.totalUsers || 0} 
            icon={Users}
            testid="kpi-users"
          />
          <KPI 
            label="Wishlists" 
            value={analytics?.totalWishlists || 0} 
            icon={Heart}
            testid="kpi-wishlists"
          />
          <KPI 
            label="Cart Items" 
            value={analytics?.totalCarts || 0} 
            icon={ShoppingCart}
            testid="kpi-carts"
          />
          <KPI 
            label="Price Alerts" 
            value={analytics?.totalAlerts || 0} 
            icon={Bell}
            testid="kpi-alerts"
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="brands">Brand Analysis</TabsTrigger>
            <TabsTrigger value="activity">User Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Price Drops Over Time</h3>
              </div>
              <div data-testid="admin-chart-line" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceDropData}>
                    <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="drop" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Price Drops"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="brands">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Brand Distribution</h3>
              <div data-testid="admin-chart-bar" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topBrands || []}>
                    <XAxis dataKey="brand" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">User Activity Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userActivityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
          <Card className="p-6 mt-8">
            <h3 className="font-semibold text-lg mb-4">Recent Price Alerts</h3>
            <div className="space-y-3">
              {analytics.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{activity.data.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Target: ₹{activity.data.targetPrice}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.data.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}