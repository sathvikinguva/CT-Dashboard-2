import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, Bell, CheckCircle } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      icon: DollarSign,
      positive: true,
      trend: [20, 25, 22, 30, 28, 35, 32, 40, 38, 45]
    },
    {
      title: 'Active Users',
      value: '2,345',
      change: '+15.3%',
      icon: Users,
      positive: true,
      trend: [15, 18, 16, 22, 20, 25, 23, 28, 26, 30]
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+7.2%',
      icon: ShoppingCart,
      positive: true,
      trend: [10, 12, 11, 15, 13, 18, 16, 20, 18, 22]
    },
    {
      title: 'Growth Rate',
      value: '12.5%',
      change: '-2.4%',
      icon: TrendingUp,
      positive: false,
      trend: [25, 22, 24, 20, 18, 16, 14, 12, 10, 12]
    },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, action: 'User John Doe signed up', time: '2 minutes ago', type: 'user', read: false },
    { id: 2, action: 'New order #1234 received', time: '5 minutes ago', type: 'order', read: false },
    { id: 3, action: 'Payment processed for order #1233', time: '10 minutes ago', type: 'payment', read: true },
    { id: 4, action: 'User Jane Smith updated profile', time: '15 minutes ago', type: 'user', read: true },
    { id: 5, action: 'System backup completed', time: '1 hour ago', type: 'system', read: true },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Server maintenance scheduled for tonight', priority: 'high', time: '1 hour ago' },
    { id: 2, message: 'New feature update available', priority: 'medium', time: '3 hours ago' },
    { id: 3, message: 'Weekly report is ready', priority: 'low', time: '1 day ago' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats with slight variations
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          trend: [...stat.trend.slice(1), stat.trend[stat.trend.length - 1] + (Math.random() - 0.5) * 5]
        }))
      );

      // Occasionally add new activities
      if (Math.random() < 0.3) {
        const newActivity = {
          id: Date.now(),
          action: `System event occurred`,
          time: 'Just now',
          type: 'system',
          read: false
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markActivityAsRead = (id: number) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, read: true } : activity
      )
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const quickActions = [
    { 
      label: 'Add User', 
      color: 'bg-blue-500 hover:bg-blue-600', 
      action: () => alert('Add User functionality - would integrate with user management')
    },
    { 
      label: 'Create Report', 
      color: 'bg-green-500 hover:bg-green-600',
      action: () => alert('Report generation - would create analytics report')
    },
    { 
      label: 'Send Message', 
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => alert('Messaging system - would open communication panel')
    },
    { 
      label: 'Export Data', 
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        // Simulate data export
        const data = JSON.stringify({ stats, activities, notifications }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-data.json';
        a.click();
      }
    },
  ];

  const MiniChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end h-8 gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary-400 rounded-sm w-1 transition-all duration-300"
            style={{ 
              height: `${range > 0 ? ((value - min) / range) * 100 : 50}%`,
              opacity: 0.7 + (index / data.length) * 0.3
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-xl transition-all duration-200 hover:scale-105 bg-gray-800 border border-gray-700 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary-900/20 rounded-lg group-hover:bg-primary-900/30 transition-colors">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    stat.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <MiniChart data={stat.trend} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-gray-800 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </h3>
            <button 
              onClick={() => setActivities(prev => prev.map(a => ({ ...a, read: true })))}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              Mark all as read
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                  activity.read 
                    ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                    : 'bg-primary-900/10 hover:bg-primary-900/20 border border-primary-900/20'
                }`}
                onClick={() => markActivityAsRead(activity.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.read ? 'bg-gray-500' : 'bg-primary-400'
                  }`} />
                  <div>
                    <p className={`text-sm ${activity.read ? 'text-gray-400' : 'text-gray-300'}`}>
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
                {!activity.read && (
                  <CheckCircle className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Notifications */}
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-all group ${
                  notification.priority === 'high' 
                    ? 'border-red-500/20 bg-red-900/10' 
                    : notification.priority === 'medium'
                    ? 'border-yellow-500/20 bg-yellow-900/10'
                    : 'border-gray-600 bg-gray-700/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 transform ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Server Status
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-bold text-white">Online</span>
          </div>
          <p className="text-sm text-gray-400">Uptime: 99.9%</p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Response Time
          </h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-white">245ms</span>
            <span className="text-sm font-medium text-green-400">-12ms</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Storage Used
          </h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-white">67%</span>
            <span className="text-sm font-medium text-yellow-400">+5%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full w-2/3 transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;