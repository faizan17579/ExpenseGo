import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, BarChart3, PieChart, Wallet, TrendingUp, DollarSign } from "lucide-react";

const Mainpage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Floating financial elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-emerald-300/10 dark:text-emerald-500/10">
          <DollarSign size={120} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-emerald-300/10 dark:text-emerald-500/10">
          <BarChart3 size={100} />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-emerald-300/10 dark:text-emerald-500/10">
          <PieChart size={80} />
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-emerald-300/10 dark:text-emerald-500/10">
          <TrendingUp size={90} />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-emerald-600" />
          <span className="font-bold text-2xl text-slate-800 dark:text-white">ExpenseGo</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-500 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-500 transition-colors"
          >
            Pricing
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-12 pb-24 md:pt-24 md:pb-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">
              Track Your Expenses <span className="text-emerald-600">Effortlessly</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10">
              Take control of your finances with ExpenseGo. Track expenses, set budgets, and gain insights into your
              spending habits all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
              <Link
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-md text-lg"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 px-8 py-3 rounded-md text-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Placeholder Image */}
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl transform perspective-1000 rotate-y-6 hover:rotate-y-0 transition-transform duration-500">
            <img
              src="./src/assets/front.jpg"
              alt="3D Expense Tracking Visualization"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 to-transparent"></div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-white dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white">Why Choose ExpenseGo?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full w-fit mb-4">
                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">Easy Expense Tracking</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Quickly log expenses on the go. Categorize and add notes to keep everything organized.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">Insightful Reports</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Visualize your spending patterns with beautiful charts and detailed reports.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">Budget Planning</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Set monthly budgets and get alerts when you're approaching your limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-emerald-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial habits with ExpenseGo.
          </p>
          <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-md text-lg">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-800 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Wallet className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-xl">ExpenseGo</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-400 text-sm">
            © {new Date().getFullYear()} ExpenseGo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Mainpage;