# SmartExpense – Personal Finance Tracker

A full-stack personal finance management application that helps users track income, monitor expenses, manage monthly budgets, and visualize their spending habits.

## Project Overview

SmartExpense is designed to make personal financial management simple. Users can record income and expenses, organize transactions by category, monitor their monthly budget, and view financial summaries through interactive charts.

## Features

- **Transaction Management:** Add, view, and delete income and expense transactions.
- **Category Management:** Organize transactions into categories such as Food, Travel, Shopping, Salary, Health, and Education.
- **Financial Dashboard:** View total income, total expenses, and available balance.
- **Interactive Charts:** Visualize expense categories and compare income with expenses.
- **Monthly Filtering:** Filter transactions and analytics by month.
- **Monthly Budget Management:** Set budgets for individual categories, track spending, and view remaining budgets.
- **Database Storage:** Store transactions and budgets using MongoDB.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Database ODM | Mongoose |
| API Communication | Axios |
| Charts | Chart.js, react-chartjs-2 |
| Icons | React Icons |
| Version Control | Git and GitHub |

## Application Architecture

```text
                 SmartExpense
                      |
          +-----------+-----------+
          |                       |
       Frontend                 Backend
       React.js                Node.js
          |                       |
          |                    Express.js
          |                       |
          +------ REST API -------+
                                  |
                              Mongoose
                                  |
                              MongoDB
```

## Project Structure

```text
SmartExpense/
│
├── backend/
│   ├── models/
│   │   ├── Budget.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── budgetRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Git
- Visual Studio Code (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/Akshaysunakari18/SmartExpense.git
cd SmartExpense
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the placeholder with your own MongoDB Atlas connection string. Never publish your actual `.env` file or database credentials.

Start the backend:

```bash
node server.js
```

Backend URL: `http://localhost:5000`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## API Endpoints

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Budgets

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/budgets` | Get all budgets |
| GET | `/api/budgets?month=2026-10` | Get budgets for a month |
| POST | `/api/budgets` | Add or update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |

## Future Improvements

- User registration and authentication
- Multiple user accounts
- Downloadable monthly financial reports
- Advanced spending analytics
- Savings goals and financial recommendations
- Deployment to cloud hosting

## Learning Outcomes

Through this project, I gained practical experience in:

- Building a full-stack application using React and Node.js.
- Developing REST APIs using Express.js.
- Connecting an application to MongoDB Atlas.
- Performing CRUD operations.
- Integrating interactive charts.
- Managing frontend and backend communication.
- Using Git and GitHub for version control.

## Author

**Akshay Sunkari**

- GitHub: https://github.com/Akshaysunakari18
- LinkedIn: https://linkedin.com/in/akshay-sunkari-99806a267

---

*SmartExpense – Track your money. Understand your spending. Manage your future.*