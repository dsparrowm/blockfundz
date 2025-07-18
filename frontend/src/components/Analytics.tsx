import { SlackDashboardCard } from './SlackDashboardCard';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your investment performance and portfolio analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SlackDashboardCard
          title="Portfolio Value"
          value="$0.00"
          subtitle="Total portfolio worth"
          icon={DollarSign}
          color="green"
          trend={{
            value: 0,
            direction: 'up',
            period: 'this month'
          }}
        />

        <SlackDashboardCard
          title="Total Return"
          value="$0.00"
          subtitle="Overall profit/loss"
          icon={TrendingUp}
          color="blue"
          trend={{
            value: 0,
            direction: 'up',
            period: 'all time'
          }}
        />

        <SlackDashboardCard
          title="Active Investments"
          value="0"
          subtitle="Current positions"
          icon={Activity}
          color="purple"
        />

        <SlackDashboardCard
          title="Performance"
          value="0%"
          subtitle="Portfolio growth"
          icon={BarChart3}
          color="yellow"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600">Detailed analytics and performance charts will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;