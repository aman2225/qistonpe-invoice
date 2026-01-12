# QistonPe Invoice Management Dashboard

A comprehensive invoice management dashboard built for MSMEs to track invoices, payments, and credit utilization. This application helps business owners understand their cash flow at a glance.

## 🚀 Live Demo

[Deploy on Netlify/Vercel and add your deployment URL here]

## 📋 Features

### Core Features

1. **Invoice List View**
   - Display invoices with all required columns (Invoice Number, Customer Name, Invoice Date, Due Date, Amount, Status)
   - Filter by status (Paid, Pending, Overdue, All)
   - Sort by Amount, Date, or Due Date (ascending/descending)
   - Search by invoice number or customer name
   - Pagination for large datasets (15 items per page)

2. **Summary Cards**
   - **Total Outstanding**: Sum of all pending + overdue invoices
   - **Total Overdue**: Sum of overdue invoices only
   - **Total Paid (This Month)**: Sum of invoices paid in current month
   - **Average Payment Delay**: Average days between due date and payment date for paid invoices
   - All calculations update in real-time

3. **Add New Invoice**
   - Modal form with validation
   - Auto-calculates due date based on invoice date + payment terms
   - Payment terms: 7, 15, 30, 45, or 60 days
   - Form validation for required fields and positive amounts

4. **Payment Action**
   - Mark pending/overdue invoices as "Paid"
   - Automatically captures payment date (defaults to today)
   - Updates all summary calculations in real-time

### Advanced Logic

- **Auto Status Calculation**: Status automatically calculated based on payment date and due date
  - Paid: Payment date exists
  - Overdue: No payment date AND due date < today
  - Pending: No payment date AND due date >= today
  
- **Days Calculation**:
  - Pending: Shows "Due in X days"
  - Overdue: Shows "Overdue by X days" (in red)
  - Paid: Shows "Paid X days early/late" or "Paid on time"

- **Real-time Updates**: All summary cards update immediately when:
  - New invoice is added
  - Invoice is marked as paid
  - Filters are applied

## 🛠️ Tech Stack

- **React.js** 18.2.0 - UI library
- **Tailwind CSS** 3.3.6 - Styling
- **Vite** 5.0.8 - Build tool
- **localStorage** - Data persistence

## 📦 Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd qistonpe-invoice
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
qistonpe-invoice/
├── src/
│   ├── components/
│   │   ├── AddInvoiceModal.jsx    # Modal for adding new invoices
│   │   ├── InvoiceCard.jsx         # Individual invoice card component
│   │   ├── InvoiceList.jsx         # Main invoice list with filters/sorting
│   │   └── SummaryCards.jsx        # Summary statistics cards
│   ├── context/
│   │   └── InvoiceContext.jsx      # Global state management
│   ├── data/
│   │   └── sampleData.js           # Sample invoice generator
│   ├── utils/
│   │   └── invoiceUtils.js         # Utility functions for calculations
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind CSS imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Approach

### Component Structure

The application follows a component-based architecture with clear separation of concerns:

- **InvoiceContext**: Manages global invoice state using React Context API, handles localStorage persistence, and provides methods to add/update invoices
- **InvoiceList**: Main container component that handles filtering, sorting, search, and pagination logic
- **SummaryCards**: Displays real-time summary statistics with optimized calculations
- **InvoiceCard**: Reusable component for displaying individual invoice details
- **AddInvoiceModal**: Form component for adding new invoices with validation

### Optimization Techniques Used

1. **React.useMemo**: 
   - Used for expensive calculations (filtered invoices, sorted data, summary statistics, paginated data)
   - Prevents unnecessary recalculations on every render

2. **React.useCallback**:
   - Used for event handlers passed to child components (markAsPaid, handleSort)
   - Prevents unnecessary re-renders of child components

3. **Pagination**:
   - Implements pagination (15 items per page) to handle large datasets efficiently
   - Reduces DOM nodes rendered at once

4. **Context API**:
   - Used for state management to avoid prop drilling
   - Provides clean API for invoice operations

5. **localStorage Optimization**:
   - Data is saved only when invoices change (not on every render)
   - Status recalculation happens on mount and periodically (hourly) to catch overdue invoices

### Challenges Faced

1. **Status Calculation Logic**: Ensuring status updates correctly when dates change, especially for overdue detection. Solved by recalculating statuses on mount and periodically.

2. **Real-time Summary Updates**: Making sure summary cards update immediately when invoices change. Solved using useMemo with proper dependencies.

3. **Invoice ID Generation**: Generating unique invoice IDs based on existing invoices. Solved by parsing existing IDs and finding the maximum.

4. **Days Calculation Edge Cases**: Handling early payments, late payments, and on-time payments correctly. Solved with comprehensive date calculations.

5. **Performance with Large Datasets**: Ensuring the app remains responsive with 500+ invoices. Solved with pagination and memoized calculations.

## ⚡ Performance Optimizations

### Specific Optimizations Implemented

1. **Memoized Filtering & Sorting**:
   - `filteredInvoices` memoized to avoid recalculating on every render
   - Only recalculates when invoices, filters, search, or sort options change

2. **Memoized Summary Calculations**:
   - Summary statistics calculated only when filtered invoices or all invoices change
   - Avoids expensive aggregations on every render

3. **Memoized Pagination**:
   - Paginated invoices calculated only when filtered invoices or page number changes
   - Reduces rendered items from potentially 500+ to 15 per page

4. **Callback Memoization**:
   - Event handlers memoized with useCallback to prevent child re-renders
   - Stable function references passed to child components

5. **Conditional Status Updates**:
   - Status recalculation happens on mount and hourly (not continuously)
   - Reduces unnecessary state updates

### Why These Optimizations?

- **useMemo**: Prevents expensive recalculations of filtered/sorted arrays and summary totals
- **useCallback**: Maintains stable references for event handlers, preventing unnecessary child component re-renders
- **Pagination**: Essential for handling 500+ invoices without performance degradation
- **Context API**: Avoids prop drilling while maintaining clean component boundaries

### Trade-offs Made

1. **Status Updates**: Status is recalculated hourly rather than continuously. This is acceptable because:
   - Status changes are date-based (daily, not second-by-second)
   - Reduces unnecessary state updates
   - Users typically refresh or interact with the app regularly

2. **localStorage Sync**: Data is saved synchronously on every invoice change. Could be debounced, but:
   - Invoice changes are infrequent
   - Immediate persistence is important for data integrity
   - localStorage operations are fast for this use case

3. **Pagination Size**: 15 items per page. Could be configurable, but:
   - 15 is a good balance between performance and usability
   - Most users view invoices in smaller batches
   - Easy to change if needed

## 📊 Sample Data

The application initializes with 10 sample invoices featuring:
- Various customer names
- Random amounts (₹10,000 - ₹100,000)
- Different payment terms (7, 15, 30, 45, 60 days)
- Mix of paid, pending, and overdue statuses
- Realistic dates distributed over the past 60 days

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Status Color Coding**:
  - 🟢 Green for Paid invoices
  - 🟡 Yellow for Pending invoices
  - 🔴 Red for Overdue invoices
- **Visual Feedback**: Hover effects, transitions, and loading states
- **Empty States**: Helpful messages when no invoices match filters
- **Form Validation**: Real-time validation with clear error messages

## 🧪 Testing Considerations

To test with 500+ invoices:

1. Use browser console to add bulk invoices:
```javascript
// Example: Add 500 invoices
const customers = ['Customer A', 'Customer B', ...];
for (let i = 0; i < 500; i++) {
  // Add invoice logic
}
```

2. Verify:
   - Pagination works correctly
   - Filtering/search remains fast
   - Summary calculations are accurate
   - No performance lag

## 📝 Time Breakdown

- **Design & Planning**: 2 hours
  - Understanding requirements
  - Component architecture design
  - State management planning
  - Optimization strategy

- **Development**: 8 hours
  - Setting up project structure
  - Implementing core components
  - Business logic implementation
  - Styling with Tailwind CSS
  - Performance optimizations

- **Testing & Debugging**: 2 hours
  - Testing all features
  - Fixing edge cases
  - Performance testing
  - Cross-browser testing

- **Documentation**: 1 hour
  - README writing
  - Code comments
  - Deployment preparation

- **Total**: ~13 hours

## 🚀 Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"homepage": "https://yourusername.github.io/qistonpe-invoice",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

## 📄 License

This project is built for QistonPe Front-End Developer Intern assessment.

## 👤 Author

[Your Name]

---

**Note**: This application uses localStorage for data persistence. Data will be cleared if the user clears their browser data. For production use, consider integrating with a backend API.