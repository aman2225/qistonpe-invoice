import React from 'react';
import { formatCurrency, formatDate, calculateDays } from '../utils/invoiceUtils';

const InvoiceCard = ({ invoice, onMarkAsPaid }) => {
  const daysInfo = calculateDays(invoice.dueDate, invoice.paymentDate);

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      overdue: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDaysDisplay = () => {
    if (invoice.status === 'paid') {
      if (daysInfo.type === 'early') {
        return <span className="text-green-600 font-medium">Paid {daysInfo.days} days early</span>;
      } else if (daysInfo.type === 'late') {
        return <span className="text-orange-600 font-medium">Paid {daysInfo.days} days late</span>;
      } else if (daysInfo.type === 'ontime') {
        return <span className="text-green-600 font-medium">Paid on time</span>;
      }
    } else if (invoice.status === 'overdue') {
      return <span className="text-red-600 font-bold">Overdue by {daysInfo.days} days</span>;
    } else {
      return <span className="text-gray-600 dark:text-gray-400">Due in {daysInfo.days} days</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invoice Number</p>
            <p className="font-semibold text-gray-900 dark:text-white">{invoice.id}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{invoice.customerName}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invoice Date</p>
            <p className="text-gray-900 dark:text-gray-100">{formatDate(invoice.invoiceDate)}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
            <p className="text-gray-900 dark:text-gray-100">{formatDate(invoice.dueDate)}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(invoice.amount)}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex flex-col gap-2">
            <div>{getStatusBadge(invoice.status)}</div>
            <div className="text-sm">{getDaysDisplay()}</div>
          </div>
          
          {invoice.status !== 'paid' && (
            <button
              onClick={() => onMarkAsPaid(invoice.id)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;