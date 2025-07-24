import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Spinner from '../spinners/Spinner';
import { toast } from 'sonner';
import { Calculator, Search, TrendingUp, DollarSign, Users, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import SlackDashboardCard from '../SlackDashboardCard';

interface Investment {
  id: number;
  plan: string;
  amount: number;
  duration: number; // Duration in days
  userId: number | null;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  totalReturn: number;
  createdAt: string;
}

const InvestmentManagement = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [calculateInterestLoading, setCalculateInterestLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/investments');
        setInvestments(response.data.investmentPlans);
      } catch (error) {
        console.error('Error fetching investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const handleCalculateInterest = async () => {
    setCalculateInterestLoading(true);
    try {
      const response = await axiosInstance.post('/api/investments/calculate-interest', {});

      if (response.data.data) {
        toast.success(`Interest calculated successfully! Processed ${response.data.data.processed} investments, credited $${response.data.data.totalCredited.toFixed(2)} total`);
      } else {
        toast.success('Interest calculation completed successfully');
      }
    } catch (error: any) {
      console.error('Error calculating interest:', error);
      toast.error(error.response?.data?.message || 'Failed to calculate interest');
    } finally {
      setCalculateInterestLoading(false);
    }
  };

  const filteredInvestments = useMemo(() => {
    return investments.filter(investment =>
      investment.plan.toLowerCase().includes(searchText.toLowerCase()) ||
      (investment.user?.name.toLowerCase().includes(searchText.toLowerCase()) || '') ||
      (investment.user?.email.toLowerCase().includes(searchText.toLowerCase()) || '')
    );
  }, [investments, searchText]);

  const paginatedInvestments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvestments.slice(startIndex, endIndex);
  }, [filteredInvestments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInvestments.length / itemsPerPage);

  // Calculate statistics with null checks
  const totalInvestmentAmount = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalReturns = investments.reduce((sum, inv) => sum + (inv.totalReturn || 0), 0);
  const averageInterestRate = investments.length > 0
    ? investments.reduce((sum, inv) => sum + (inv.interestRate || 0), 0) / investments.length
    : 0; return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Investment Management</h1>
            </div>
            <p className="text-gray-600">Monitor and manage all user investments across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCalculateInterest}
              disabled={calculateInterestLoading}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              {calculateInterestLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Interest</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards using SlackDashboardCard for consistency */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SlackDashboardCard
            title="Total Investments"
            value={investments.length}
            subtitle="Active user investments"
            icon={TrendingUp}
            color="blue"
            trend={{
              value: 15.3,
              direction: 'up',
              period: 'this month'
            }}
          />

          <SlackDashboardCard
            title="Total Amount"
            value={`$${totalInvestmentAmount.toLocaleString()}`}
            subtitle="Total invested capital"
            icon={DollarSign}
            color="green"
            trend={{
              value: 23.7,
              direction: 'up',
              period: 'this quarter'
            }}
          />

          <SlackDashboardCard
            title="Total Returns"
            value={`$${totalReturns.toLocaleString()}`}
            subtitle="Generated returns"
            icon={TrendingUp}
            color="purple"
            trend={{
              value: 18.2,
              direction: 'up',
              period: 'this month'
            }}
          />

          <SlackDashboardCard
            title="Avg. Interest Rate"
            value={`${averageInterestRate.toFixed(1)}%`}
            subtitle="Across all investments"
            icon={Users}
            color="yellow"
            trend={{
              value: 5.4,
              direction: 'up',
              period: 'this week'
            }}
          />
        </div>

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Investment Data
            </CardTitle>
            <CardDescription>
              Search and filter through all user investments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by plan, user name, or email..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner />
              </div>
            ) : investments.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <BarChart3 className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No investments found</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no user investments to display.</p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-semibold text-gray-900">Investment</TableCell>
                        <TableCell className="font-semibold text-gray-900">User</TableCell>
                        <TableCell className="font-semibold text-gray-900">Amount Range</TableCell>
                        <TableCell className="font-semibold text-gray-900">Performance</TableCell>
                        <TableCell className="font-semibold text-gray-900">Created</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedInvestments.map((investment, index) => (
                        <TableRow key={investment.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{investment.plan}</div>
                              <Badge variant="outline" className="text-xs">
                                ID: {investment.id}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">
                                {investment.user?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {investment.user?.email || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">
                                ${(investment.minimumAmount || 0).toLocaleString()} - ${(investment.maximumAmount || 0).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Invested: ${(investment.amount || 0).toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {(investment.interestRate || 0)}% Rate
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500">
                                Returns: ${(investment.totalReturn || 0).toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {investment.createdAt ? new Date(investment.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {investment.createdAt ? new Date(investment.createdAt).toLocaleTimeString() : 'N/A'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvestments.length)} of {filteredInvestments.length} investments
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
};

export default InvestmentManagement;