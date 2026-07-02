import React from 'react';
import { Formik, Form } from 'formik';
import { User, Lock, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from './useAuth';
import {
  INITIAL_LOGIN_VALUES,
  INITIAL_REGISTER_VALUES,
  LOGIN_SCHEMA,
  REGISTER_SCHEMA,
} from './constant';
import Input from '../../component/Input';
import Button from '../../component/Button';

const Auth = () => {
  const {
    isLoginMode,
    toggleMode,
    loading,
    handleLoginSubmit,
    handleRegisterSubmit,
  } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080d] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* App Logo/Header */}
        <div className="flex items-center gap-2 mb-6 animate-float select-none">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white" size={22} />
          </div>
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-sans">
            moodo
          </span>
        </div>

        {/* Card Panel */}
        <div className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-950/20 hover:border-slate-700/80 transition-colors duration-500">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-8 p-1 bg-slate-950/60 rounded-xl select-none">
            <button
              onClick={() => !isLoginMode && toggleMode()}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                isLoginMode
                  ? 'bg-slate-800 text-indigo-400 shadow-inner'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LogIn size={16} />
              Login
            </button>
            <button
              onClick={() => isLoginMode && toggleMode()}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                !isLoginMode
                  ? 'bg-slate-800 text-pink-400 shadow-inner'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <UserPlus size={16} />
              Register
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-100 mb-2 font-sans tracking-wide">
            {isLoginMode ? 'Welcome Back!' : 'Join the Club!'}
          </h2>
          <p className="text-sm text-slate-400 mb-6 font-sans">
            {isLoginMode
              ? 'Enter your credentials to manage your tasks & splits.'
              : 'Sign up to coordinate trips, tasklists, and solve group debts.'}
          </p>

          {isLoginMode ? (
            <Formik
              initialValues={INITIAL_LOGIN_VALUES}
              validationSchema={LOGIN_SCHEMA}
              onSubmit={handleLoginSubmit}
            >
              {() => (
                <Form className="space-y-5">
                  <Input
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Enter your username"
                    icon={User}
                  />
                  <Input
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    icon={Lock}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={loading}
                    className="mt-2"
                  >
                    Sign In ⚡
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={INITIAL_REGISTER_VALUES}
              validationSchema={REGISTER_SCHEMA}
              onSubmit={handleRegisterSubmit}
            >
              {() => (
                <Form className="space-y-5">
                  <Input
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Pick a unique username"
                    icon={User}
                  />
                  <Input
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Create a strong password"
                    icon={Lock}
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Verify your password"
                    icon={Lock}
                  />
                  <Button
                    type="submit"
                    variant="success"
                    fullWidth
                    isLoading={loading}
                    className="mt-2"
                  >
                    Register Account 🚀
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
