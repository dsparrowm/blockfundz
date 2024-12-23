import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"; // Adjust the import paths as necessary
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/investments', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
          }
        });
        console.log(response.data.investmentPlans);
        setInvestments(response.data.investmentPlans);
      } catch (error) {
        console.error('Error fetching investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

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

  return (
    <div>
      <input
        type="text"
        placeholder="Search investments..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-slate-400"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table className="text-white">
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Minimum Amount</TableCell>
                <TableCell>Maximum Amount</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Total Return</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='text-center'>No investments found</TableCell>
                </TableRow>
              ) : (
              <>
                {paginatedInvestments.map(investment => (
                  <TableRow key={investment.id}>
                    <TableCell>{investment.id}</TableCell>
                    <TableCell>{investment.plan}</TableCell>
                    <TableCell>{investment.minimumAmount}</TableCell>
                    <TableCell>{investment.maximumAmount}</TableCell>
                    <TableCell>{investment.interestRate}</TableCell>
                    <TableCell>{investment.totalReturn}</TableCell>
                    <TableCell>{investment.user ? investment.user.name : 'N/A'}</TableCell>
                    <TableCell>{investment.user ? investment.user.email : 'N/A'}</TableCell>
                    <TableCell>{new Date(investment.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {totalPages !== 0 && <span className='text-white-400'>Page {currentPage} of {totalPages}</span>}
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestmentManagement;