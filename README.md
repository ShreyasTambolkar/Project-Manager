# Project Manager

A full-stack web application for managing and tracking projects across departments. Built with a React frontend and a Flask microservices backend.


## Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Python, Flask, Flask-CORS  
**Database:** MySQL  
**Mail:** Flask-Mail (Gmail SMTP)


## Project Structure

```
Assignment_4/
├── project/                  # Frontend (React + Vite)
│   └── src/
│       ├── pages/            # Login, Dashboard, Project Listing, Create Project, Reset Password
│       ├── components/       # Header, Sidebar, StatCard, DateField, SelectField, ActionBtn
│       └── services/         # API service functions
├── project_api/              # Backend (Flask microservices)
│   ├── auth_api/             # Auth API (port 5000) - Login, Forgot/Reset Password
│   ├── stats_api/            # Stats API (port 5001) - Project statistics
│   ├── charts_api/           # Charts API (port 5002) - Department-wise chart data
│   ├── listing_api/          # Listing API (port 5003) - Project listing, search, sort, status updates
│   ├── create_api/           # Create API (port 5004) - Create new projects
│   ├── routes/               # Route blueprints for each API
│   ├── migrations/           # SQL migration scripts
│   ├── database.py           # DB connection and seed data
│   ├── config.py             # Environment config
│   ├── logger_setup.py       # Request and error logging
│   ├── migrate.py            # Migration runner
│   └── start_all.ps1         # Starts full stack with one command
└── docs/                     # Documentation
    ├── Api_Structure.txt     # API endpoints reference
    └── Database_Schema.md    # Database schema documentation
```


## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+


## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShreyasTambolkar/Project-Manager.git
   cd Project-Manager
   ```

2. **Install backend dependencies**
   ```bash
   cd project_api
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd project
   npm install
   ```

4. **Create a MySQL database**
   ```sql
   CREATE DATABASE project_db;
   ```

5. **Configure environment variables**

   Create a `.env` file in `project_api/` with:
   ```
   DB_HOST=localhost
   DB_NAME=project_db
   DB_USER=root
   DB_PASSWORD=your_password
   DB_PORT=3306

   AUTH_PORT=5000
   STATS_PORT=5001
   CHARTS_PORT=5002
   LISTING_PORT=5003
   CREATE_PORT=5004

   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password

   HOST=0.0.0.0
   FRONTEND_URL=http://localhost:5173
   ```

6. **Run database migrations**
   ```bash
   cd project_api
   python migrate.py
   ```


## Running the Application

Start everything (migrations + all 5 APIs + frontend) with one command:

```powershell
cd project_api
.\start_all.ps1
```

This starts:

| Service      | URL                    |
|--------------|------------------------|
| Frontend     | http://localhost:5173   |
| Auth API     | http://localhost:5000   |
| Stats API    | http://localhost:5001   |
| Charts API   | http://localhost:5002   |
| Listing API  | http://localhost:5003   |
| Create API   | http://localhost:5004   |

Press `Ctrl+C` to stop all services.


## Default Login Credentials

| Email               | Password  |
|---------------------|-----------|
| alice@projects.com  | Alice@123 |
| bob@projects.com    | Bob@456   |


## Features

- User login and authentication
- Forgot password with email reset link
- Dashboard with project statistics
- Department-wise chart data
- Project listing with search and sort by priority
- Create new projects
- Start, close, and cancel projects
- Request and error logging across all APIs
