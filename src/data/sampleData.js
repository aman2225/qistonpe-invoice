/**
 * Generate sample invoices for initial load
 */
export const generateSampleInvoices = () => {
  const today = new Date();
  const customerPrefixes = [
    'Acme', 'Tech', 'Global', 'Sunrise', 'Delta', 'Prime', 'Innovation', 'Mega', 'Startup', 'Business',
    'Elite', 'Pro', 'Star', 'Royal', 'Premium', 'Ultra', 'Super', 'Apex', 'Nexus', 'Vector',
    'Quantum', 'Alpha', 'Beta', 'Gamma', 'Sigma', 'Omega', 'Zenith', 'Phoenix', 'Titan', 'Orion'
  ];
  
  const customerSuffixes = [
    'Manufacturing Ltd', 'Solutions Inc', 'Trading Co', 'Industries', 'Services', 'Logistics',
    'Labs', 'Corp', 'Hub', 'Partners Ltd', 'Group', 'Enterprises', 'Holdings', 'Systems',
    'Technologies', 'International', 'Global', 'Worldwide', 'Dynamics', 'Ventures'
  ];

  // Generate more diverse customer names
  const generateCustomerName = (index) => {
    if (index < 10) {
      // Use some predefined names for first 10
      const predefined = [
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
      return predefined[index];
    }
    
    // Generate random combinations for the rest
    const prefix = customerPrefixes[Math.floor(Math.random() * customerPrefixes.length)];
    const suffix = customerSuffixes[Math.floor(Math.random() * customerSuffixes.length)];
    return `${prefix} ${suffix}`;
  };

  const invoices = [];
  
  for (let i = 1; i <= 150; i++) {
    const invoiceDate = new Date(today);
    invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 90)); // Up to 90 days back
    
    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTerms);
    
    // 40% paid, 30% pending, 30% overdue
    const statusRand = Math.random();
    let paymentDate = null;
    if (statusRand < 0.4) {
      // Paid invoice
      paymentDate = new Date(dueDate);
      paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 15) - 5); // -5 to +10 days from due
      if (paymentDate > today) paymentDate = today;
    }
    
    invoices.push({
      id: `INV-${String(i).padStart(4, '0')}`,
      customerName: generateCustomerName(i - 1),
      amount: Math.floor(Math.random() * 100000) + 10000,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      paymentTerms,
      dueDate: dueDate.toISOString().split('T')[0],
      paymentDate: paymentDate ? paymentDate.toISOString().split('T')[0] : null,
    });
  }
  
  return invoices;
};