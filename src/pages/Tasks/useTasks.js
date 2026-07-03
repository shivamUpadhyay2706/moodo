import { useState, useEffect, useCallback } from 'react';
import { 
  listTasksQuery, 
  getTaskStatsQuery, 
  createTaskMutation, 
  updateTaskMutation, 
  deleteTaskMutation,
  createPersonalExpenseMutation
} from '../../api';
import { showToast } from '../../util/sonner';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    byPriority: { low: 0, medium: 0, high: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const handleAddExpense = async (values, { resetForm }) => {
    try {
      await createPersonalExpenseMutation({
        description: values.description,
        amount: parseFloat(values.amount),
        category: values.category,
        date: values.date ? new Date(values.date).toISOString() : undefined
      });
      setIsExpenseOpen(false);
      resetForm();
      showToast.success('Personal expense logged successfully! 💰');
    } catch (err) {
      showToast.error(err.message || 'Failed to log personal expense ❌');
    }
  };

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Selected task state (for details/subtasks)
  const [selectedTask, setSelectedTask] = useState(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTasksQuery({
        status: statusFilter,
        priority: priorityFilter,
        search,
        sortBy,
        sortOrder
      });
      setTasks(data);
    } catch (error) {
      showToast.error(error.message || 'Could not fetch tasks ❌');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search, sortBy, sortOrder]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getTaskStatsQuery();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const loadData = useCallback(async () => {
    await fetchTasks();
    await fetchStats();
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (values, { resetForm }) => {
    const toastId = showToast.loading('Creating task... ⏱️');
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
      };

      await createTaskMutation(payload);
      showToast.dismiss(toastId);
      showToast.success('Task created successfully! 🎉');
      setIsCreateOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Task creation failed ❌');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTaskMutation(task._id, { status: newStatus });
      loadData();
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(prev => ({ ...prev, status: newStatus }));
      }
      const formattedStatus = newStatus.replace('_', ' ');
      showToast.success(`Task status updated to "${formattedStatus}"! ⚡`);
    } catch (error) {
      showToast.error(error.message || 'Failed to update status ❌');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? 🗑️')) return;
    const toastId = showToast.loading('Deleting task...');
    try {
      await deleteTaskMutation(taskId);
      showToast.dismiss(toastId);
      showToast.success('Task deleted! 🗑️');
      setSelectedTask(null);
      loadData();
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Delete failed ❌');
    }
  };

  const handleToggleSubtask = async (task, subtaskIndex) => {
    try {
      const updatedSubtasks = task.subtasks.map((st, idx) => 
        idx === subtaskIndex ? { ...st, isCompleted: !st.isCompleted } : st
      );
      const updated = await updateTaskMutation(task._id, { subtasks: updatedSubtasks });
      
      // Update local task state
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(updated);
      }
      fetchStats();
    } catch (error) {
      showToast.error('Could not update checklist item ❌');
    }
  };

  const handleAddSubtask = async (task) => {
    if (!subtaskTitle.trim()) return;
    try {
      const updatedSubtasks = [...task.subtasks, { title: subtaskTitle, isCompleted: false }];
      const updated = await updateTaskMutation(task._id, { subtasks: updatedSubtasks });
      
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(updated);
      }
      setSubtaskTitle('');
      fetchStats();
      showToast.success('Checklist item added! 📝');
    } catch (error) {
      showToast.error('Could not add checklist item ❌');
    }
  };

  const handleDeleteSubtask = async (task, subtaskIndex) => {
    try {
      const updatedSubtasks = task.subtasks.filter((_, idx) => idx !== subtaskIndex);
      const updated = await updateTaskMutation(task._id, { subtasks: updatedSubtasks });
      
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(updated);
      }
      fetchStats();
      showToast.success('Checklist item deleted 🗑️');
    } catch (error) {
      showToast.error('Could not delete checklist item ❌');
    }
  };

  return {
    tasks,
    stats,
    loading,
    isCreateOpen,
    setIsCreateOpen,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTask,
    setSelectedTask,
    subtaskTitle,
    setSubtaskTitle,
    handleCreateTask,
    handleStatusChange,
    handleDeleteTask,
    handleToggleSubtask,
    handleAddSubtask,
    handleDeleteSubtask,
    isExpenseOpen,
    setIsExpenseOpen,
    handleAddExpense
  };
};
