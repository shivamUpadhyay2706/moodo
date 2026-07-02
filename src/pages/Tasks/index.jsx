import React from 'react';
import { Formik, Form } from 'formik';
import { 
  Plus, Search, Calendar, Tag, CheckCircle2, Circle, AlertCircle, 
  Trash2, ChevronRight, Play, Check, Clock, RotateCcw, ListTodo 
} from 'lucide-react';
import { useTasks } from './useTasks';
import { 
  INITIAL_TASK_VALUES, 
  TASK_SCHEMA, 
  PRIORITY_OPTIONS, 
  STATUS_OPTIONS, 
  RECURRENCE_OPTIONS 
} from './constant';
import Input from '../../component/Input';
import Select from '../../component/Select';
import Button from '../../component/Button';
import Modal from '../../component/Modal';

const Tasks = () => {
  const {
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
  } = useTasks();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-400" size={18} />;
      case 'in_progress': return <Play className="text-indigo-400 fill-indigo-400/20" size={16} />;
      default: return <Clock className="text-slate-400" size={18} />;
    }
  };

  const isOverdue = (task) => {
    return task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 Dynamic Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Progress Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 glass-panel flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-slate-400 select-none">Completion Rate</span>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse-glow" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white text-glow-indigo">
              {stats.completionRate}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 glass-panel flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-slate-400 select-none">Active Tasks</span>
            <h3 className="text-3xl font-black text-white mt-1">{stats.totalTasks}</h3>
            <span className="text-xs text-slate-500 mt-1 block">
              {stats.inProgressTasks} in progress • {stats.pendingTasks} pending
            </span>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 text-indigo-400">
            <ListTodo size={24} />
          </div>
        </div>

        {/* Overdue Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 glass-panel flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-slate-400 select-none">Overdue Tasks</span>
            <h3 className={`text-3xl font-black mt-1 ${stats.overdueTasks > 0 ? 'text-rose-400 text-glow-indigo' : 'text-slate-300'}`}>
              {stats.overdueTasks}
            </h3>
            <span className="text-xs text-slate-500 mt-1 block">Requires immediate attention</span>
          </div>
          <div className={`p-3 rounded-xl border ${stats.overdueTasks > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-slate-800/50 border-slate-700/30 text-slate-500'}`}>
            <AlertCircle size={24} />
          </div>
        </div>

        {/* Priority Grid Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 glass-panel">
          <span className="text-sm font-bold text-slate-400 select-none mb-3 block">Task Priorities</span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-2">
              <span className="text-xs font-bold text-rose-400 block">High</span>
              <span className="text-lg font-black text-slate-200">{stats.byPriority.high}</span>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-2">
              <span className="text-xs font-bold text-amber-400 block">Med</span>
              <span className="text-lg font-black text-slate-200">{stats.byPriority.medium}</span>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-2">
              <span className="text-xs font-bold text-emerald-400 block">Low</span>
              <span className="text-lg font-black text-slate-200">{stats.byPriority.low}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 🔍 Filters & Create Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 bg-slate-900/20 border border-slate-900 rounded-2xl">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl text-slate-200 bg-slate-950/40 border border-slate-800 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: '⏱️ Pending' },
              { value: 'in_progress', label: '⚡ In Progress' },
              { value: 'completed', label: '✅ Completed' }
            ]}
          />

          {/* Priority filter */}
          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'high', label: '🔴 High' },
              { value: 'medium', label: '🟡 Medium' },
              { value: 'low', label: '🟢 Low' }
            ]}
          />

        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Create Task
        </Button>
      </div>

      {/* 📋 Task Workspace Grid (Main List + Details View) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Task List (Left/Center 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Loading tasks workspace...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl text-slate-500 select-none">
              <ListTodo size={48} className="mx-auto text-slate-700 mb-3" />
              <p className="font-bold">No tasks found</p>
              <p className="text-sm mt-1">Create a new task to get started!</p>
            </div>
          ) : (
            tasks.map((task) => {
              const overdue = isOverdue(task);
              const isSelected = selectedTask && selectedTask._id === task._id;
              return (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    isSelected
                      ? 'border-indigo-500/80 bg-indigo-500/5 glow-indigo'
                      : 'border-slate-800/60 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(
                          task,
                          task.status === 'completed' ? 'pending' : 'completed'
                        );
                      }}
                      className="mt-1 transition-transform active:scale-75"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-base font-bold text-slate-200 truncate ${
                        task.status === 'completed' ? 'line-through text-slate-500' : ''
                      }`}>
                        {task.title}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                        {/* Due Date */}
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 font-semibold ${
                            overdue ? 'text-rose-400 font-bold' : ''
                          }`}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                            {overdue && ' (Overdue)'}
                          </span>
                        )}

                        {/* Recurrence */}
                        {task.recurrence && task.recurrence !== 'none' && (
                          <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-semibold text-[10px]">
                            {task.recurrence}
                          </span>
                        )}

                        {/* Subtask count */}
                        {task.subtasks?.length > 0 && (
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded-md font-medium">
                            Checklist: {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* Tags */}
                    <div className="hidden sm:flex gap-1">
                      {task.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold bg-slate-800 border border-slate-700/30 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Priority badge */}
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider select-none ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <ChevronRight className="text-slate-600 hidden sm:block" size={18} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Task Details & Subtasks Sidebar (Right 1 col) */}
        <div className="lg:col-span-1">
          {selectedTask ? (
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/35 p-5 glass-panel space-y-5 animate-float glow-indigo">
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider select-none ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-2 font-sans tracking-wide">
                    {selectedTask.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteTask(selectedTask._id)}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {selectedTask.description && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</span>
                  <p className="text-sm text-slate-350 leading-relaxed font-sans">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {/* Status Select Toggle */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Update Status</span>
                <div className="grid grid-cols-3 gap-2">
                  {['pending', 'in_progress', 'completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedTask, st)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                        selectedTask.status === st
                          ? 'bg-indigo-550 border-indigo-500 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtask Checklist */}
              <div className="space-y-3 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo size={14} />
                  Checklist
                </span>
                
                {/* Subtask input creator */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(selectedTask)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg text-slate-200 bg-slate-950/40 border border-slate-800 outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={() => handleAddSubtask(selectedTask)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtask list */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedTask.subtasks?.length === 0 ? (
                    <span className="text-xs text-slate-500 italic block pl-1">No checklist items yet.</span>
                  ) : (
                    selectedTask.subtasks.map((st, idx) => (
                      <div key={st._id || idx} className="flex justify-between items-center group/item p-1.5 rounded-lg hover:bg-slate-800/30">
                        <button
                          onClick={() => handleToggleSubtask(selectedTask, idx)}
                          className="flex items-center gap-2 text-left min-w-0 text-xs font-semibold text-slate-300"
                        >
                          {st.isCompleted ? (
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Circle size={14} className="text-slate-500 shrink-0" />
                          )}
                          <span className={`truncate ${st.isCompleted ? 'line-through text-slate-500' : ''}`}>
                            {st.title}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteSubtask(selectedTask, idx)}
                          className="opacity-0 group-hover/item:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/10 p-8 text-center text-slate-500 italic text-sm select-none border-dashed">
              Select a task to view checklist & adjust details.
            </div>
          )}
        </div>

      </div>

      {/* ➕ Create Task Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task ⚡"
      >
        <Formik
          initialValues={INITIAL_TASK_VALUES}
          validationSchema={TASK_SCHEMA}
          onSubmit={handleCreateTask}
        >
          {() => (
            <Form className="space-y-4">
              <Input
                name="title"
                type="text"
                label="Task Title"
                placeholder="Buy grocery, design mockup..."
              />
              <Input
                name="description"
                type="text"
                label="Description"
                placeholder="Include short details..."
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  name="priority"
                  label="Priority"
                  options={PRIORITY_OPTIONS}
                />
                <Select
                  name="status"
                  label="Status"
                  options={STATUS_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="dueDate"
                  type="date"
                  label="Due Date"
                />
                <Select
                  name="recurrence"
                  label="Recurrence"
                  options={RECURRENCE_OPTIONS}
                />
              </div>

              <Input
                name="tagsString"
                type="text"
                label="Tags (Comma separated)"
                placeholder="work, personal, coding"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button
                  onClick={() => setIsCreateOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Create Task 🚀
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

    </div>
  );
};

export default Tasks;
