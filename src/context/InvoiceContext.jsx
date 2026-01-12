import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateStatus } from '../utils/invoiceUtils';
import { generateSampleInvoices } from '../data/sampleData';

const InvoiceContext = createContext();

const STORAGE_KEY = 'qistonpe-invoices';

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load invoices from localStorage on mount and recalculate statuses
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let loadedInvoices;
      
      if (stored) {
        const parsed = JSON.parse(stored);
        // Recalculate statuses on load (important for overdue detection)
        loadedInvoices = parsed.map(inv => ({
          ...inv,
          status: calculateStatus(inv.paymentDate, inv.dueDate),
        }));
        setInvoices(loadedInvoices);
      } else {
        // Initialize with sample data
        const sampleData = generateSampleInvoices();
        loadedInvoices = sampleData.map(inv => ({
          ...inv,
          status: calculateStatus(inv.paymentDate, inv.dueDate),
        }));
        setInvoices(loadedInvoices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedInvoices));
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      const sampleData = generateSampleInvoices();
      const withStatus = sampleData.map(inv => ({
        ...inv,
        status: calculateStatus(inv.paymentDate, inv.dueDate),
      }));
      setInvoices(withStatus);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever invoices change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      } catch (error) {
        console.error('Error saving invoices:', error);
      }
    }
  }, [invoices, loading]);

  // Periodically recalculate statuses (every hour) to catch overdue invoices
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setInvoices(prev => prev.map(inv => ({
          ...inv,
          status: calculateStatus(inv.paymentDate, inv.dueDate),
        })));
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [loading]);

  const addInvoice = useCallback((invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      status: calculateStatus(invoiceData.paymentDate, invoiceData.dueDate),
    };
    setInvoices(prev => [...prev, newInvoice]);
  }, []);

  const markAsPaid = useCallback((invoiceId, paymentDate) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          paymentDate,
          status: calculateStatus(paymentDate, inv.dueDate),
        };
      }
      return inv;
    }));
  }, []);

  const value = {
    invoices,
    loading,
    addInvoice,
    markAsPaid,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};