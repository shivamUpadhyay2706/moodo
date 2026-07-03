import React from 'react';
import { Formik, Form } from 'formik';
import { Plus, Trash2, Wallet, Layers, Activity, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { useExpenses } from './useExpenses';
import { INITIAL_VALUES, EXPENSE_SCHEMA, CATEGORY_OPTIONS, CATEGORY_EMOJIS } from './constant';
import Input from '../../component/Input';
import Select from '../../component/Select';
import Modal from '../../component/Modal';
import Button from '../../component/Button';

const Expenses = () => {
  const {
    expenses: filteredExpenses,
    rawExpensesCount,
    loading,
    isModalOpen,
    setIsModalOpen,
    categoryFilter,
    setCategoryFilter,
    handleAddExpense,
    handleDeleteExpense,
    stats
  } = useExpenses();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Today';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white m-0">
            Personal Expense Tracker 💰
          </h2>
          <p className="text-sm font-medium text-slate-400">
            Log and manage your personal spending privately and securely.
          </p>
        </div>
        
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 font-bold px-5 py-2.5 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-200 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Log Expense
        </Button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Spent */}
        <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-slate-700/80 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-200">
            <Wallet size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Spent
            </span>
            <span className="text-2xl font-black tracking-tight text-indigo-400">
              {formatCurrency(stats.totalSpent)}
            </span>
          </div>
        </div>

        {/* Number of Logs */}
        <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-slate-700/80 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-200">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Logged Items
            </span>
            <span className="text-2xl font-black tracking-tight text-emerald-400">
              {stats.logsCount}
            </span>
          </div>
        </div>

        {/* Average Expense */}
        <div className="relative overflow-hidden bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-slate-700/80 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-200">
            <Activity size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Average Expense
            </span>
            <span className="text-2xl font-black tracking-tight text-cyan-400">
              {formatCurrency(stats.averageExpense)}
            </span>
          </div>
        </div>

      </div>

      {/* Main List & Filters Section */}
      <div className="bg-[#0b0c10]/70 border border-slate-900 rounded-3xl p-6 space-y-6">
        
        {/* Filters and Counters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-bold text-slate-300">
              Expense Logs ({stats.logsCount})
            </span>
          </div>

          {/* Category Filter Selector */}
          <div className="w-full md:w-56 shrink-0 z-30">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: '', label: 'All Categories' },
                ...CATEGORY_OPTIONS
              ]}
            />
          </div>
        </div>

        {/* Grid/List of Expenses */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg className="animate-spin h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Syncing Ledger...
            </span>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800/80 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              {categoryFilter ? <ShieldAlert size={20} /> : <Wallet size={20} />}
            </div>
            <p className="text-sm font-bold text-slate-300 mb-1">
              {categoryFilter ? 'No items in this category' : 'No expenses logged yet!'}
            </p>
            <p className="text-xs font-semibold text-slate-500 max-w-xs">
              {categoryFilter ? 'Try clearing your filter or selecting another category.' : 'Click "Log Expense" at the top to track your first personal expenditure.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredExpenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-slate-950/20 border border-slate-900 hover:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-200 group"
              >
                {/* Info block */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg select-none">
                    {CATEGORY_EMOJIS[exp.category] || '🏷️'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-slate-200 block truncate leading-tight mb-1">
                      {exp.description}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-600" />
                        {formatDate(exp.date)}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-700 hidden sm:inline" />
                      <span className="flex items-center gap-1 uppercase tracking-wide text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800/80 px-1.5 py-0.5 rounded-md">
                        <Tag size={10} className="text-indigo-400" />
                        {exp.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Cost */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-900/40 pt-2.5 sm:pt-0 sm:border-none">
                  <span className="text-base font-black tracking-tight text-slate-200">
                    {formatCurrency(exp.amount)}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteExpense(exp._id)}
                    className="p-2 py-1.5 px-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all duration-200 cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Log Expense Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Personal Expense 💳"
      >
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={EXPENSE_SCHEMA}
          onSubmit={handleAddExpense}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <Input
                label="Description 📝"
                name="description"
                placeholder="e.g., Target grocery run"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Amount (₹) 💰"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />

                <Input
                  label="Date (Optional) 📅"
                  name="date"
                  type="date"
                />
              </div>

              <div className="z-50">
                <Select
                  label="Category 🏷️"
                  name="category"
                  options={CATEGORY_OPTIONS}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-900 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors border border-transparent hover:border-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="font-bold px-5 py-2 cursor-pointer"
                >
                  Log Expense
                </Button>
              </div>

            </Form>
          )}
        </Formik>
      </Modal>

    </div>
  );
};

export default Expenses;
