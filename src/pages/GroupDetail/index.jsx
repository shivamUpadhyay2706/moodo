import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import {
  ListTodo, DollarSign, Wallet, Calendar, Plus, Trash2, ArrowLeftRight,
  ChevronLeft, Users, Tag, AlertCircle, CheckCircle2, Circle, Clock, Play, MapPin, Sparkles, ArrowRight
} from 'lucide-react';
import { useGroupDetail } from './useGroupDetail';
import {
  INITIAL_EXPENSE_VALUES,
  EXPENSE_SCHEMA,
  INITIAL_PLAN_VALUES,
  PLAN_SCHEMA,
  PLAN_CATEGORIES,
  INITIAL_GROUP_TASK_VALUES,
  GROUP_TASK_SCHEMA,
} from './constant';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, RECURRENCE_OPTIONS } from '../Tasks/constant';
import Input from '../../component/Input';
import Select from '../../component/Select';
import Button from '../../component/Button';
import Modal from '../../component/Modal';

const GroupDetail = () => {
  const {
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
  } = useGroupDetail();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-455 bg-rose-550/10 border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-550/10 border-amber-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-550/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getPlanCategoryStyle = (cat) => {
    switch (cat) {
      case 'travel': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'lodging': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'food': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'activity': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'function_event': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-550/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Back to Groups link */}
      <div className="flex items-center select-none">
        <Link 
          to="/groups" 
          className="text-xs font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Workspaces
        </Link>
      </div>

      {/* 🧭 Tabs Controller */}
      <div className="flex flex-wrap border-b border-slate-900 gap-2 p-1.5 bg-slate-950/40 rounded-2xl select-none">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'tasks'
              ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <ListTodo size={16} />
          Group Tasks
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'expenses'
              ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <DollarSign size={16} />
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'balances'
              ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Wallet size={16} />
          Debt Settlement
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'plans'
              ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Calendar size={16} />
          Itineraries
        </button>
      </div>

      {/* 🚀 Loading state */}
      {loading && (
        <div className="text-center py-12 text-slate-500 font-medium select-none">
          Updating group workspace...
        </div>
      )}

      {/* 📋 WORKSPACE RENDERERS */}
      {!loading && (
        <div>
          
          {/* ============ TABS: GROUP TASKS ============ */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center p-4 bg-slate-900/20 border border-slate-900 rounded-2xl">
                <span className="text-sm font-bold text-slate-450">Track & Delegate Work</span>
                <Button 
                  onClick={() => setIsTaskOpen(true)} 
                  variant="primary" 
                  className="flex items-center gap-1.5 py-2"
                >
                  <Plus size={16} />
                  Add Task
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl text-slate-500 select-none">
                      <ListTodo size={40} className="mx-auto text-slate-700 mb-2" />
                      <p className="font-bold">No group tasks scheduled</p>
                      <p className="text-xs mt-0.5">Delegate a task to keep the squad on track!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task._id}
                        onClick={() => setSelectedTask(task)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center gap-4 ${
                          selectedTask && selectedTask._id === task._id
                            ? 'border-indigo-500/80 bg-indigo-500/5 glow-indigo'
                            : 'border-slate-800/60 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task, task.status === 'completed' ? 'pending' : 'completed');
                            }}
                            className="mt-0.5"
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle2 size={18} className="text-emerald-400" />
                            ) : (
                              <Circle size={18} className="text-slate-500" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <h4 className={`text-sm font-bold text-slate-200 truncate ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-medium">
                              {task.dueDate && (
                                <span className="flex items-center gap-0.5">
                                  <Calendar size={11} />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              {task.assignees?.length > 0 && (
                                <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full text-indigo-400">
                                  <Users size={10} />
                                  {task.assignees.map(a => `@${a.username}`).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-1">
                  {selectedTask ? (
                    <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/35 p-5 glass-panel space-y-5 glow-indigo">
                      <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${getPriorityColor(selectedTask.priority)}`}>
                            {selectedTask.priority}
                          </span>
                          <h3 className="text-base font-bold text-slate-100 mt-2">
                            {selectedTask.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(selectedTask._id)}
                          className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/5 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {selectedTask.description && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</span>
                          <p className="text-xs text-slate-350 leading-relaxed font-sans">{selectedTask.description}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Members</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedTask.assignees?.length === 0 ? (
                            <span className="text-xs text-slate-500 italic">Unassigned (Group Task)</span>
                          ) : (
                            selectedTask.assignees.map(a => (
                              <span key={a._id} className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/10 font-bold">
                                @{a.username}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Status select toggle */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Update Status</span>
                        <div className="grid grid-cols-3 gap-2">
                          {['pending', 'in_progress', 'completed'].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(selectedTask, st)}
                              className={`py-1 rounded-lg text-[10px] font-bold capitalize transition-all border ${
                                selectedTask.status === st
                                  ? 'bg-indigo-550 border-indigo-550 text-white'
                                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {st.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subtasks checklist */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <ListTodo size={12} />
                          Checklist
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add item..."
                            value={subtaskTitle}
                            onChange={(e) => setSubtaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(selectedTask)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg text-slate-200 bg-slate-950/40 border border-slate-800 outline-none focus:border-indigo-500 transition-colors"
                          />
                          <button
                            onClick={() => handleAddSubtask(selectedTask)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-xs"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {selectedTask.subtasks?.map((st, idx) => (
                            <div key={st._id || idx} className="flex justify-between items-center group/sub p-1 rounded-lg hover:bg-slate-800/30">
                              <button
                                onClick={() => handleToggleSubtask(selectedTask, idx)}
                                className="flex items-center gap-2 text-left min-w-0 text-xs font-semibold text-slate-350"
                              >
                                {st.isCompleted ? (
                                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle size={13} className="text-slate-500 shrink-0" />
                                )}
                                <span className={`truncate ${st.isCompleted ? 'line-through text-slate-500' : ''}`}>
                                  {st.title}
                                </span>
                              </button>
                              <button
                                onClick={() => handleDeleteSubtask(selectedTask, idx)}
                                className="opacity-0 group-hover/sub:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/10 p-6 text-center text-slate-500 italic text-xs select-none border-dashed">
                      Select a task to assign squad members & checklists.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ============ TABS: EXPENSES ============ */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center p-4 bg-slate-900/20 border border-slate-900 rounded-2xl">
                <span className="text-sm font-bold text-slate-450">Split Bills & Expenses</span>
                <Button 
                  onClick={() => setIsExpenseOpen(true)} 
                  variant="success" 
                  className="flex items-center gap-1.5 py-2"
                >
                  <Plus size={16} />
                  Log Expense
                </Button>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl text-slate-500 select-none">
                  <DollarSign size={40} className="mx-auto text-slate-700 mb-2" />
                  <p className="font-bold">No expenses logged yet</p>
                  <p className="text-xs mt-0.5">Log group checks, lodging costs, or dining tabs to split debts.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {expenses.map((exp) => (
                    <div key={exp._id} className="relative group rounded-2xl border border-slate-800/80 bg-slate-900/25 hover:bg-slate-900/40 p-5 transition-all duration-300">
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-200 truncate">{exp.description}</h4>
                          <span className="text-[10px] text-slate-550 block mt-0.5">
                            {new Date(exp.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-lg font-black text-emerald-400 text-glow-indigo">
                          ${exp.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="border-t border-slate-800/60 pt-4 mt-5 flex justify-between items-center text-xs">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-indigo-400 block">
                            Paid by: @{exp.paidBy?.username}
                          </span>
                          <span className="text-[10px] text-slate-450 block truncate mt-0.5">
                            Split among: {exp.splitAmong?.map(u => `@${u.username}`).join(', ')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ============ TABS: BALANCES ============ */}
          {activeTab === 'balances' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Credit List Breakdown */}
                <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 glass-panel space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-1.5 select-none">
                    <Users size={16} />
                    Group Balances
                  </h3>

                  <div className="space-y-3">
                    {balances.balances?.length === 0 ? (
                      <span className="text-xs text-slate-500 italic block">No active balances.</span>
                    ) : (
                      balances.balances.map((bal) => {
                        const positive = bal.netBalance > 0.01;
                        const negative = bal.netBalance < -0.01;
                        return (
                          <div key={bal.userId} className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-950/20 border border-slate-900">
                            <span className="text-xs font-bold text-slate-200">@{bal.username}</span>
                            <span className={`text-xs font-black tracking-wide ${
                              positive 
                                ? 'text-emerald-400' 
                                : negative 
                                  ? 'text-rose-455' 
                                  : 'text-slate-500'
                            }`}>
                              {positive ? `+ $${bal.netBalance.toFixed(2)}` : negative ? `- $${Math.abs(bal.netBalance).toFixed(2)}` : 'Settle'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Settle Up solver */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 glass-panel space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-1.5 select-none">
                    <ArrowLeftRight size={16} className="text-indigo-400" />
                    Squad Settlements (Greedy Solver)
                  </h3>

                  {balances.settlements?.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 select-none">
                      <CheckCircle2 size={36} className="mx-auto text-emerald-500/60 mb-2 animate-float" />
                      <p className="font-bold text-slate-400">Squad is all squared up! 🎉</p>
                      <p className="text-xs mt-0.5">No outstanding balances or transaction actions needed.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {balances.settlements.map((set, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-550/15 glow-indigo hover:border-indigo-500/30 transition-colors duration-300">
                          
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-rose-400 bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10">
                              @{set.fromUsername}
                            </span>
                            <ArrowRight size={14} className="text-indigo-400" />
                            <span className="font-bold text-emerald-400 bg-emerald-550/5 px-2.5 py-1 rounded-lg border border-emerald-550/10">
                              @{set.toUsername}
                            </span>
                          </div>

                          <div className="flex justify-between sm:justify-end items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Suggested transfer</span>
                            <span className="text-base font-black text-slate-100 text-glow-indigo bg-slate-900 border border-slate-800 px-3.5 py-1 rounded-xl">
                              ${set.amount.toFixed(2)}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ============ TABS: ITINERARY PLANS ============ */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center p-4 bg-slate-900/20 border border-slate-900 rounded-2xl">
                <span className="text-sm font-bold text-slate-450">Itinerary Schedule Timeline</span>
                <Button 
                  onClick={() => setIsPlanOpen(true)} 
                  variant="primary" 
                  className="flex items-center gap-1.5 py-2"
                >
                  <Plus size={16} />
                  Add Plan
                </Button>
              </div>

              {plans.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl text-slate-500 select-none">
                  <Calendar size={40} className="mx-auto text-slate-700 mb-2" />
                  <p className="font-bold">Itinerary is empty</p>
                  <p className="text-xs mt-0.5">Schedule flights, hotel bookings, reservations, or meetups.</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                  {plans.map((plan) => (
                    <div key={plan._id} className="relative group rounded-2xl border border-slate-800/80 bg-slate-900/25 p-5 transition-all duration-300">
                      
                      {/* Timeline dot */}
                      <div className="absolute -left-[32px] top-6 w-3 h-3 rounded-full bg-indigo-500 border border-slate-950 group-hover:scale-125 transition-transform" />
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider ${getPlanCategoryStyle(plan.category)}`}>
                              {plan.category}
                            </span>
                            {plan.startTime && (
                              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded-lg border border-indigo-500/10 select-none">
                                {new Date(plan.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-sm font-bold text-slate-200">{plan.title}</h4>
                          
                          {plan.location && (
                            <span className="text-xs text-slate-450 flex items-center gap-1 select-none">
                              <MapPin size={12} className="text-slate-500" />
                              {plan.location}
                            </span>
                          )}
                          
                          {plan.description && (
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">{plan.description}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeletePlan(plan._id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ============ MODAL: ADD TASK ============ */}
      <Modal
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        title="Add Group Task 🎯"
      >
        <Formik
          initialValues={INITIAL_GROUP_TASK_VALUES}
          validationSchema={GROUP_TASK_SCHEMA}
          onSubmit={handleCreateGroupTask}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <Input
                name="title"
                type="text"
                label="Task Title"
                placeholder="Submit repository code, write deck..."
              />
              <Input
                name="description"
                type="text"
                label="Description"
                placeholder="Provide task directions..."
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

              {/* Assignee Checkboxes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 select-none">Assign Squad Members</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-900">
                  {members.map(member => (
                    <label key={member._id} className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer select-none">
                      <Field 
                        type="checkbox" 
                        name="assignees" 
                        value={member._id} 
                        className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      @{member.username}
                    </label>
                  ))}
                </div>
              </div>

              <Input
                name="tagsString"
                type="text"
                label="Tags (Comma separated)"
                placeholder="engineering, travel"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button onClick={() => setIsTaskOpen(false)} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Create Group Task</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* ============ MODAL: LOG EXPENSE ============ */}
      <Modal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        title="Log Group Expense 💰"
      >
        <Formik
          initialValues={INITIAL_EXPENSE_VALUES}
          validationSchema={EXPENSE_SCHEMA}
          onSubmit={handleCreateExpense}
        >
          {() => (
            <Form className="space-y-4">
              <Input
                name="description"
                type="text"
                label="Expense Description"
                placeholder="Dinner tab, cabin rent..."
              />
              <Input
                name="amount"
                type="number"
                label="Total Cost ($)"
                placeholder="0.00"
              />
              
              <Select
                name="paidBy"
                label="Payer (Paid By)"
                options={[
                  { value: '', label: '🤖 Current Logged-in User' },
                  ...members.map(m => ({ value: m._id, label: `@${m.username}` }))
                ]}
              />

              {/* Split among list */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 select-none">Split Among (Defaults to all squad)</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-900">
                  {members.map(member => (
                    <label key={member._id} className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer select-none">
                      <Field 
                        type="checkbox" 
                        name="splitAmong" 
                        value={member._id}
                        className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      @{member.username}
                    </label>
                  ))}
                </div>
              </div>

              <Input
                name="date"
                type="date"
                label="Transaction Date"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button onClick={() => setIsExpenseOpen(false)} variant="secondary">Cancel</Button>
                <Button type="submit" variant="success">Log Split Expense</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* ============ MODAL: SCHEDULE PLAN ============ */}
      <Modal
        isOpen={isPlanOpen}
        onClose={() => setIsPlanOpen(false)}
        title="Schedule Itinerary 🗓️"
      >
        <Formik
          initialValues={INITIAL_PLAN_VALUES}
          validationSchema={PLAN_SCHEMA}
          onSubmit={handleCreatePlan}
        >
          {() => (
            <Form className="space-y-4">
              <Input
                name="title"
                type="text"
                label="Event Title"
                placeholder="Flight departure, check-in, meetup..."
              />
              <Input
                name="description"
                type="text"
                label="Event Notes"
                placeholder="Flight details, confirmation codes..."
              />
              <Input
                name="location"
                type="text"
                label="Location/Address"
                placeholder="Terminal 3, Hilton Hotel..."
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="startTime"
                  type="datetime-local"
                  label="Start Time"
                />
                <Input
                  name="endTime"
                  type="datetime-local"
                  label="End Time"
                />
              </div>

              <Select
                name="category"
                label="Plan Category"
                options={PLAN_CATEGORIES}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button onClick={() => setIsPlanOpen(false)} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Schedule Event</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

    </div>
  );
};

export default GroupDetail;
