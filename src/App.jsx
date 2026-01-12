import React, { useState } from 'react';
import { InvoiceProvider } from './context/InvoiceContext';
import InvoiceList from './components/InvoiceList';
import AddInvoiceModal from './components/AddInvoiceModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">QistonPe Invoice Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">MSME Invoice Management System</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                + Add Invoice
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InvoiceList />
        </main>

        <AddInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </InvoiceProvider>
  );
}

export default App;