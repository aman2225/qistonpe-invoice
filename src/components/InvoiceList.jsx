import React, { useState, useMemo, useCallback } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceCard from './InvoiceCard';
import SummaryCards from './SummaryCards';

const InvoiceList = () => {
  const { invoices, markAsPaid } = useInvoices();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        inv =>
          inv.id.toLowerCase().includes(query) ||
          inv.customerName.toLowerCase().includes(query)
      );
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          comparison = new Date(a.invoiceDate) - new Date(b.invoiceDate);
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [invoices, statusFilter, searchQuery, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setIsLoading(false);
  }, [statusFilter, searchQuery, sortBy, sortOrder]);

  const handleMarkAsPaid = useCallback((invoiceId) => {
    const today = new Date().toISOString().split('T')[0];
    markAsPaid(invoiceId, today);
  }, [markAsPaid]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage === currentPage) return;
    
    setIsLoading(true);
    // Simulate loading delay for realistic UX
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsLoading(false);
    }, 600); // 600ms delay for smooth transition
  }, [currentPage]);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="w-full">
      <SummaryCards filteredInvoices={filteredInvoices} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invoice List</h2>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by invoice number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 self-center">Sort by:</span>
            <button
              onClick={() => handleSort('amount')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'amount'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Amount {getSortIcon('amount')}
            </button>
            <button
              onClick={() => handleSort('date')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Date {getSortIcon('date')}
            </button>
            <button
              onClick={() => handleSort('dueDate')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                sortBy === 'dueDate'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Due Date {getSortIcon('dueDate')}
            </button>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading invoices...
              </span>
            ) : (
              `Showing ${paginatedInvoices.length} of ${filteredInvoices.length} invoice(s)`
            )}
          </p>
        </div>

        {/* Invoice List */}
        {paginatedInvoices.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No invoices found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first invoice to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: itemsPerPage }, (_, index) => (
                  <div key={`skeleton-${index}`} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-6">
                        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                paginatedInvoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onMarkAsPaid={handleMarkAsPaid}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {isLoading && currentPage > 1 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    'Previous'
                  )}
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {isLoading && currentPage < totalPages ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;