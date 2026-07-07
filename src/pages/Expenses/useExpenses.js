import { useState, useEffect } from 'react';
import { listPersonalExpensesQuery } from '../../api/expenses/queries';
import { createPersonalExpenseMutation, deletePersonalExpenseMutation } from '../../api/expenses/mutations';
import { showToast } from '../../util/sonner';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await listPersonalExpensesQuery();
      setExpenses(data || []);
    } catch (err) {
      showToast.error(err.message || 'Failed to load personal expenses ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (values, { resetForm }) => {
    try {
      const newExp = await createPersonalExpenseMutation({
        description: values.description,
        amount: parseFloat(values.amount),
        category: values.category,
        date: values.date ? new Date(values.date).toISOString() : undefined
      });
      setExpenses((prev) => [newExp, ...prev]);
      setIsModalOpen(false);
      resetForm();
      showToast.success('Personal expense logged successfully! 💰');
    } catch (err) {
      showToast.error(err.message || 'Failed to log personal expense ❌');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deletePersonalExpenseMutation(expenseId);
      setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));
      showToast.success('Personal expense deleted! 🗑️');
    } catch (err) {
      showToast.error(err.message || 'Failed to delete expense ❌');
    }
  };

  const getLocalDateString = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filtered Expenses list by category and date
  const filteredExpenses = expenses.filter((exp) => {
    if (categoryFilter && exp.category !== categoryFilter) return false;
    if (dateFilter) {
      const expDateStr = getLocalDateString(exp.date);
      if (expDateStr !== dateFilter) return false;
    }
    return true;
  });

  // Calculate statistics
  // 1. Overall Total Spent (sum of all expenses)
  const totalSpentOverall = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Average Day Expense (overall total / unique days)
  const uniqueDays = new Set(expenses.map(exp => getLocalDateString(exp.date)));
  const uniqueDaysCount = uniqueDays.size;
  const averageDailyExpense = uniqueDaysCount > 0 ? totalSpentOverall / uniqueDaysCount : 0;

  // 3. Filtered spent for active date/category filter
  const filteredSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    expenses: filteredExpenses,
    rawExpensesCount: expenses.length,
    loading,
    isModalOpen,
    setIsModalOpen,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    handleAddExpense,
    handleDeleteExpense,
    stats: {
      totalSpent: totalSpentOverall,
      averageExpense: averageDailyExpense,
      filteredSpent,
      logsCount: expenses.length,
      filteredLogsCount: filteredExpenses.length,
      uniqueDaysCount
    }
  };
};
