
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_URL = "http://localhost:5000/api/transactions";
const BUDGET_API_URL = "http://localhost:5000/api/budgets";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected month
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Transaction form
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Budget form
  const [budgetForm, setBudgetForm] = useState({
    category: "Food",
    amount: "",
  });

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Could not load transactions. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch budgets for selected month
  const fetchBudgets = async () => {
    try {
      const response = await axios.get(
        `${BUDGET_API_URL}?month=${selectedMonth}`
      );

      setBudgets(response.data.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch budgets whenever selected month changes
  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  // Handle transaction form inputs
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Add transaction
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(API_URL, {
        ...formData,
        amount: Number(formData.amount),
      });

      alert("Transaction added successfully!");

      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);

      alert(
        error.response?.data?.message ||
          "Could not add transaction."
      );
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this transaction?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Could not delete transaction.");
    }
  };

  // Save or update budget
  const handleBudgetSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(BUDGET_API_URL, {
        category: budgetForm.category,
        amount: Number(budgetForm.amount),
        month: selectedMonth,
      });

      alert("Budget saved successfully!");

      setBudgetForm({
        category: "Food",
        amount: "",
      });

      fetchBudgets();
    } catch (error) {
      console.error("Error saving budget:", error);

      alert(
        error.response?.data?.message ||
          "Could not save budget."
      );
    }
  };

  // Delete budget
  const handleBudgetDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      await axios.delete(`${BUDGET_API_URL}/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Could not delete budget.");
    }
  };

  // Filter transactions by selected month
  const monthlyTransactions = transactions.filter((item) => {
    const transactionMonth = String(item.date).slice(0, 7);
    return transactionMonth === selectedMonth;
  });

  // Monthly income
  const totalIncome = monthlyTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  // Monthly expenses
  const totalExpenses = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  // Monthly balance
  const balance = totalIncome - totalExpenses;

  // Expense transactions
  const expenseTransactions = monthlyTransactions.filter(
    (item) => item.type === "expense"
  );

  // Calculate expense totals by category
  const categoryTotals = {};

  expenseTransactions.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) + item.amount;
  });

  // Calculate budget summary
  const totalBudget = budgets.reduce(
    (total, item) => total + item.amount,
    0
  );

  const remainingBudget = totalBudget -
    budgets.reduce((total, budget) => {
      return (
        total +
        (categoryTotals[budget.category] || 0)
      );
    }, 0);

  // Doughnut chart data
  const expenseChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#4263eb",
          "#16a36a",
          "#e05252",
          "#f59f00",
          "#7950f2",
          "#15aabf",
          "#e64980",
          "#868e96",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Income vs expenses chart data
  const comparisonChartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#16a36a", "#e05252"],
        borderRadius: 8,
      },
    ],
  };

  // Currency formatting
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>SmartExpense</h1>
        <p>Personal Finance Tracker</p>
      </header>

      <main className="container">

        {/* Monthly Filter */}
        <section className="month-filter">
          <label htmlFor="month">Select Month:</label>

          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(event.target.value)
            }
          />
        </section>

        {/* Summary Cards */}
        <section className="summary">

          <div className="summary-card balance-card">
            <h3>Monthly Balance</h3>
            <h2>{formatCurrency(balance)}</h2>
          </div>

          <div className="summary-card income-card">
            <h3>Monthly Income</h3>
            <h2>{formatCurrency(totalIncome)}</h2>
          </div>

          <div className="summary-card expense-card">
            <h3>Monthly Expenses</h3>
            <h2>{formatCurrency(totalExpenses)}</h2>
          </div>

        </section>

        {/* Add Transaction and Recent Transactions */}
        <section className="content">

          {/* Add Transaction Form */}
          <div className="form-section">
            <h2>Add Transaction</h2>

            <form onSubmit={handleSubmit}>

              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Grocery Shopping"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />

              <label>Transaction Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Salary</option>
                <option>Shopping</option>
                <option>Education</option>
                <option>Health</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Add a note (optional)"
                value={formData.description}
                onChange={handleChange}
              />

              <button type="submit">
                Add Transaction
              </button>

            </form>
          </div>

          {/* Recent Transactions */}
          <div className="transactions-section">
            <h2>Transactions for Selected Month</h2>

            {loading ? (
              <p>Loading transactions...</p>
            ) : monthlyTransactions.length === 0 ? (
              <p>No transactions found for this month.</p>
            ) : (
              <div className="transaction-list">

                {monthlyTransactions.map((item) => (
                  <div
                    className="transaction-item"
                    key={item._id}
                  >

                    <div>
                      <h3>{item.title}</h3>
                      <p>
                        {item.category} ·{" "}
                        {new Date(item.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="transaction-actions">

                      <strong className={item.type}>
                        {item.type === "income" ? "+" : "-"}
                        {formatCurrency(item.amount)}
                      </strong>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}
          </div>

        </section>

        {/* Monthly Budget Management */}
        <section className="budget-section">

          <h2>Monthly Budget Management</h2>

          <p>
            Set spending limits for different categories.
          </p>

          {/* Budget Summary */}
          <div className="summary">

            <div className="summary-card">
              <h3>Total Budget</h3>
              <h2>{formatCurrency(totalBudget)}</h2>
            </div>

            <div className="summary-card expense-card">
              <h3>Remaining Budget</h3>
              <h2>{formatCurrency(remainingBudget)}</h2>
            </div>

          </div>

          {/* Add Budget Form */}
          <div className="budget-form">

            <h3>Set Monthly Budget</h3>

            <form onSubmit={handleBudgetSubmit}>

              <label>Category</label>

              <select
                value={budgetForm.category}
                onChange={(event) =>
                  setBudgetForm({
                    ...budgetForm,
                    category: event.target.value,
                  })
                }
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Education</option>
                <option>Health</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>

              <label>Monthly Budget Amount (₹)</label>

              <input
                type="number"
                placeholder="Enter budget amount"
                min="0.01"
                step="0.01"
                value={budgetForm.amount}
                onChange={(event) =>
                  setBudgetForm({
                    ...budgetForm,
                    amount: event.target.value,
                  })
                }
                required
              />

              <button type="submit">
                Save Budget
              </button>

            </form>

          </div>

          {/* Budget List */}
          <div className="budget-list">

            <h3>Budget Overview</h3>

            {budgets.length === 0 ? (
              <p>No budgets set for this month yet.</p>
            ) : (
              budgets.map((budget) => {

                const spent =
                  categoryTotals[budget.category] || 0;

                const remaining = budget.amount - spent;

                const percentage = Math.min(
                  (spent / budget.amount) * 100,
                  100
                );

                const exceeded = spent > budget.amount;

                return (
                  <div
                    className="budget-card"
                    key={budget._id}
                  >

                    <div className="budget-card-header">

                      <div>
                        <h3>{budget.category}</h3>
                        <p>
                          Spent: {formatCurrency(spent)}
                        </p>
                      </div>

                      <div>
                        <strong>
                          {formatCurrency(budget.amount)}
                        </strong>
                      </div>

                    </div>

                    <div className="budget-progress">
                      <div
                        className={`budget-progress-fill ${
                          exceeded ? "over-budget" : ""
                        }`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="budget-card-footer">

                      <span>
                        {Math.round((spent / budget.amount) * 100)}% used
                      </span>

                      <strong
                        className={
                          exceeded ? "expense" : "income"
                        }
                      >
                        {exceeded
                          ? `Exceeded by ${formatCurrency(Math.abs(remaining))}`
                          : `${formatCurrency(remaining)} remaining`}
                      </strong>

                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleBudgetDelete(budget._id)
                      }
                    >
                      Delete Budget
                    </button>

                  </div>
                );
              })
            )}

          </div>

        </section>

        {/* Monthly Analytics Charts */}
        <section className="charts-section">

          {/* Expense Category Doughnut Chart */}
          <div className="chart-card">
            <h2>Monthly Expenses by Category</h2>

            {expenseTransactions.length > 0 ? (
              <div className="chart-container">

                <Doughnut
                  data={expenseChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />

              </div>
            ) : (
              <p>No expense data available for this month.</p>
            )}

          </div>

          {/* Income vs Expenses Bar Chart */}
          <div className="chart-card">
            <h2>Monthly Income vs Expenses</h2>

            <div className="chart-container">

              <Bar
                data={comparisonChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />

            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;
