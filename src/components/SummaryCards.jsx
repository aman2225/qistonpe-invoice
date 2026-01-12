import React, { useMemo } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { formatCurrency, calculateAveragePaymentDelay, isInCurrentMonth } from '../utils/invoiceUtils';

const SummaryCards = ({ filteredInvoices }) => {
  const { invoices } = useInvoices();

  const summary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total Outstanding (pending + overdue from filtered)
    const totalOutstanding = filteredInvoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Total Overdue (overdue from filtered)
    const totalOverdue = filteredInvoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Total Paid This Month (from all invoices, not filtered)
    const totalPaidThisMonth = invoices
      .filter(inv => inv.status === 'paid' && isInCurrentMonth(inv.paymentDate))
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Average Payment Delay (from all paid invoices, not filtered)
    const avgDelay = calculateAveragePaymentDelay(invoices);

    return {
      totalOutstanding,
      totalOverdue,
      totalPaidThisMonth,
      avgDelay,
    };
  }, [filteredInvoices, invoices]);

  const cards = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(summary.totalOutstanding),
      subtitle: 'Pending + Overdue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Overdue',
      value: formatCurrency(summary.totalOverdue),
      subtitle: 'Past due date',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    {
      title: 'Total Paid (This Month)',
      value: formatCurrency(summary.totalPaidThisMonth),
      subtitle: 'Paid in current month',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      title: 'Average Payment Delay',
      value: `${summary.avgDelay} days`,
      subtitle: 'For paid invoices',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border-2 rounded-lg p-4 shadow-sm`}
        >
          <h3 className={`text-sm font-medium ${card.textColor} mb-1`}>
            {card.title}
          </h3>
          <p className={`text-2xl font-bold ${card.textColor} mb-1`}>
            {card.value}
          </p>
          <p className="text-xs text-gray-600">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;