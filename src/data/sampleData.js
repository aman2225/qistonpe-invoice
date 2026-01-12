/**
 * Generate sample invoices for initial load
 */
export const generateSampleInvoices = () => {
  const today = new Date();
  const customers = [
    'Acme Manufacturing Ltd',
    'Tech Solutions Inc',
    'Global Trading Co',
    'Sunrise Industries',
    'Delta Services',
    'Prime Logistics',
    'Innovation Labs',
    'Mega Corp',
    'Startup Hub',
    'Business Partners Ltd',
  ];

  const invoices = [];
  
  for (let i = 1; i <= 10; i++) {
    const invoiceDate = new Date(today);
    invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 60));
    
    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTerms);
    
    // 40% paid, 30% pending, 30% overdue
    const statusRand = Math.random();
    let paymentDate = null;
    if (statusRand < 0.4) {
      // Paid invoice
      paymentDate = new Date(dueDate);
      paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 10) - 5); // -5 to +5 days from due
      if (paymentDate > today) paymentDate = today;
    }
    
    invoices.push({
      id: `INV-${String(i).padStart(3, '0')}`,
      customerName: customers[i - 1],
      amount: Math.floor(Math.random() * 100000) + 10000,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      paymentTerms,
      dueDate: dueDate.toISOString().split('T')[0],
      paymentDate: paymentDate ? paymentDate.toISOString().split('T')[0] : null,
    });
  }
  
  return invoices;
};