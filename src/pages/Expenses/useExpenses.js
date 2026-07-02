import { useState, useEffect } from 'react';
import { listPersonalExpensesQuery } from '../../api/expenses/queries';
import { createPersonalExpenseMutation, deletePersonalExpenseMutation } from '../../api/expenses/mutations';
import { showToast } from '../../util/sonner';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

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

  // Filtered Expenses list
  const filteredExpenses = categoryFilter
    ? expenses.filter((exp) => exp.category === categoryFilter)
    : expenses;

  // Calculate statistics
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const logsCount = filteredExpenses.length;
  const averageExpense = logsCount > 0 ? totalSpent / logsCount : 0;

  return {
    expenses: filteredExpenses,
    rawExpensesCount: expenses.length,
    loading,
    isModalOpen,
    setIsModalOpen,
    categoryFilter,
    setCategoryFilter,
    handleAddExpense,
    handleDeleteExpense,
    stats: {
      totalSpent,
      logsCount,
      averageExpense
    }
  };
};
