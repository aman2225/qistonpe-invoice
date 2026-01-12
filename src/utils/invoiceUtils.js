/**
 * Calculate invoice status based on payment date and due date
 */
export const calculateStatus = (paymentDate, dueDate) => {
  if (paymentDate) {
    return 'paid';
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  if (due < today) {
    return 'overdue';
  }
  
  return 'pending';
};

/**
 * Calculate days until due or days overdue
 */
export const calculateDays = (dueDate, paymentDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  if (paymentDate) {
    const payment = new Date(paymentDate);
    payment.setHours(0, 0, 0, 0);
    const diffTime = payment - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { type: 'ontime', days: 0 };
    }
    
    return { type: payment < due ? 'early' : 'late', days: Math.abs(diffDays) };
  }
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { type: 'overdue', days: Math.abs(diffDays) };
  }
  
  return { type: 'due', days: diffDays };
};

/**
 * Calculate due date from invoice date and payment terms
 */
export const calculateDueDate = (invoiceDate, paymentTerms) => {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString().split('T')[0];
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Check if date is in current month
 */
export const isInCurrentMonth = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

/**
 * Calculate average payment delay for paid invoices
 */
export const calculateAveragePaymentDelay = (invoices) => {
  const paidInvoices = invoices.filter(inv => inv.paymentDate);
  
  if (paidInvoices.length === 0) return 0;
  
  const delays = paidInvoices.map(invoice => {
    const dueDate = new Date(invoice.dueDate);
    const paymentDate = new Date(invoice.paymentDate);
    const diffTime = paymentDate - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });
  
  const sum = delays.reduce((acc, delay) => acc + delay, 0);
  return Math.round(sum / delays.length);
};