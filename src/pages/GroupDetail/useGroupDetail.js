import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getGroupMembersQuery,
  listTasksQuery,
  createTaskMutation,
  updateTaskMutation,
  deleteTaskMutation,
  listExpensesQuery,
  getExpenseBalancesQuery,
  createExpenseMutation,
  deleteExpenseMutation,
  listPlansQuery,
  createPlanMutation,
  deletePlanMutation,
} from '../../api';
import { showToast } from '../../util/sonner';

export const useGroupDetail = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('tasks');
  const [members, setMembers] = useState([]);
  
  // Data lists
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({ balances: [], settlements: [] });
  const [plans, setPlans] = useState([]);

  // Loaders
  const [loading, setLoading] = useState(false);

  // Modals
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  // Detail panel states
  const [selectedTask, setSelectedTask] = useState(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');

  // Fetch Members list (essential for paidBy / assignees selection lists)
  const fetchMembers = useCallback(async () => {
    try {
      const data = await getGroupMembersQuery(groupId);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  }, [groupId]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTasksQuery({ groupId });
      setTasks(data);
    } catch (error) {
      showToast.error('Could not fetch group tasks ❌');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listExpensesQuery(groupId);
      setExpenses(data);
    } catch (error) {
      showToast.error('Could not fetch group expenses ❌');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchBalances = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpenseBalancesQuery(groupId);
      setBalances(data);
    } catch (error) {
      showToast.error('Could not calculate balances ❌');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listPlansQuery(groupId);
      setPlans(data);
    } catch (error) {
      showToast.error('Could not load itineraries ❌');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Load current tab data
  const loadTabData = useCallback(async () => {
    if (activeTab === 'tasks') await fetchTasks();
    if (activeTab === 'expenses') await fetchExpenses();
    if (activeTab === 'balances') await fetchBalances();
    if (activeTab === 'plans') await fetchPlans();
  }, [activeTab, fetchTasks, fetchExpenses, fetchBalances, fetchPlans]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  // Handlers for Tasks
  const handleCreateGroupTask = async (values, { resetForm }) => {
    const toastId = showToast.loading('Creating group task...');
    try {
      const tags = values.tagsString
        ? values.tagsString.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
      
      const payload = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate || undefined,
        tags,
        recurrence: values.recurrence,
        groupId,
        assignees: values.assignees,
      };

      await createTaskMutation(payload);
      showToast.dismiss(toastId);
      showToast.success('Group task added! 🚀');
      setIsTaskOpen(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Task creation failed ❌');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTaskMutation(task._id, { status: newStatus });
      fetchTasks();
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask((prev) => ({ ...prev, status: newStatus }));
      }
      const formattedStatus = newStatus.replace('_', ' ');
      showToast.success(`Group task status updated to "${formattedStatus}"! ⚡`);
    } catch (error) {
      showToast.error(error.message || 'Failed to update status ❌');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? 🗑️')) return;
    try {
      await deleteTaskMutation(taskId);
      showToast.success('Task deleted! 🗑️');
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      showToast.error('Could not delete task ❌');
    }
  };

  const handleToggleSubtask = async (task, subtaskIndex) => {
    try {
      const updatedSubtasks = task.subtasks.map((st, idx) =>
        idx === subtaskIndex ? { ...st, isCompleted: !st.isCompleted } : st
      );
      const updated = await updateTaskMutation(task._id, { subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(updated);
      }
    } catch (error) {
      showToast.error('Failed to toggle checklist ❌');
    }
  };

  const handleAddSubtask = async (task) => {
    if (!subtaskTitle.trim()) return;
    try {
      const updatedSubtasks = [...task.subtasks, { title: subtaskTitle, isCompleted: false }];
      const updated = await updateTaskMutation(task._id, { subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(updated);
      }
      setSubtaskTitle('');
      showToast.success('Item added! 📝');
    } catch (error) {
      showToast.error('Failed to add checklist item ❌');
    }
  };

  const handleDeleteSubtask = async (task, subtaskIndex) => {
    try {
      const updatedSubtasks = task.subtasks.filter((_, idx) => idx !== subtaskIndex);
      const updated = await updateTaskMutation(task._id, { subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(updated);
      }
      showToast.success('Item deleted 🗑️');
    } catch (error) {
      showToast.error('Failed to delete checklist item ❌');
    }
  };

  // Handlers for Expenses
  const handleCreateExpense = async (values, { resetForm }) => {
    const toastId = showToast.loading('Adding group expense...');
    try {
      const payload = {
        description: values.description,
        amount: parseFloat(values.amount),
        paidBy: values.paidBy || undefined,
        splitAmong: values.splitAmong.length > 0 ? values.splitAmong : undefined,
        date: values.date || undefined,
      };

      await createExpenseMutation(groupId, payload);
      showToast.dismiss(toastId);
      showToast.success('Expense logged successfully! 💰');
      setIsExpenseOpen(false);
      resetForm();
      fetchExpenses();
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Log expense failed ❌');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this expense? 🗑️')) return;
    try {
      await deleteExpenseMutation(groupId, expenseId);
      showToast.success('Expense deleted! 🗑️');
      fetchExpenses();
    } catch (error) {
      showToast.error('Could not delete expense ❌');
    }
  };

  // Handlers for Plans
  const handleCreatePlan = async (values, { resetForm }) => {
    const toastId = showToast.loading('Scheduling itinerary item...');
    try {
      const payload = {
        title: values.title,
        description: values.description,
        location: values.location,
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
        category: values.category,
      };

      await createPlanMutation(groupId, payload);
      showToast.dismiss(toastId);
      showToast.success('Itinerary item added! 🗓️');
      setIsPlanOpen(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Could not schedule plan ❌');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Delete this itinerary item? 🗑️')) return;
    try {
      await deletePlanMutation(groupId, planId);
      showToast.success('Itinerary item removed! 🗑️');
      fetchPlans();
    } catch (error) {
      showToast.error('Could not delete plan ❌');
    }
  };

  return {
    groupId,
    activeTab,
    setActiveTab,
    members,
    tasks,
    expenses,
    balances,
    plans,
    loading,
    isTaskOpen,
    setIsTaskOpen,
    isExpenseOpen,
    setIsExpenseOpen,
    isPlanOpen,
    setIsPlanOpen,
    selectedTask,
    setSelectedTask,
    subtaskTitle,
    setSubtaskTitle,
    handleCreateGroupTask,
    handleStatusChange,
    handleDeleteTask,
    handleToggleSubtask,
    handleAddSubtask,
    handleDeleteSubtask,
    handleCreateExpense,
    handleDeleteExpense,
    handleCreatePlan,
    handleDeletePlan,
  };
};
