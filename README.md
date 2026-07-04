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
    ├── Api_Structure.md      # API endpoints reference
    ├── Database_Schema.md    # Database schema documentation
    ├── openapi.yaml          # OpenAPI 3.0 specification
    ├── swagger-ui.html       # Interactive Swagger UI (open in browser)
    ├── architecture.md       # System architecture overview
    └── architecture.png      # Architecture diagram
```


## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **MySQL** 8.0+
- **Git**


## Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/ShreyasTambolkar/Project-Manager.git
cd Project-Manager
```

### 2. Set up environment variables

```bash
cd project_api
cp .env.example .env
```

Open `.env` and update these values with your local credentials:

```env
# ─── Database (update with your MySQL credentials) ───
DB_HOST=localhost
DB_NAME=project_db
DB_USER=root
DB_PASSWORD=your_mysql_password    # ← change this
DB_PORT=3306

# ─── Microservice Ports (no change needed) ───
AUTH_PORT=5000
STATS_PORT=5001
CHARTS_PORT=5002
LISTING_PORT=5003
CREATE_PORT=5004

# ─── Mail Settings (Gmail SMTP) ───
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com       # ← change this
MAIL_PASSWORD=your_gmail_app_password    # ← change this (see note below)

# ─── Server & Frontend ───
HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password:** Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords) and generate a 16-character app password. Use that instead of your regular Gmail password. You need 2-Step Verification enabled.

### 3. Install backend dependencies

```bash
cd project_api
pip install -r requirements.txt
```

### 4. Run database migrations

```bash
python migrate.py
```

> **Note:** You do **not** need to manually create the database. The migration script automatically creates the `project_db` database if it doesn't exist.

To check migration status:
```bash
python migrate.py --status
```

### 5. Install frontend dependencies

```bash
cd ../project
npm install
```


## Running the Application

### Option A: Start everything with one command (Windows PowerShell)

```powershell
cd project_api
.\start_all.ps1
```

This starts all 5 backend APIs + the frontend dev server together.

### Option B: Start services manually

**Backend** (run each in a separate terminal from `project_api/`):
```bash
python auth_api/app.py        # Port 5000
python stats_api/app.py       # Port 5001
python charts_api/app.py      # Port 5002
python listing_api/app.py     # Port 5003
python create_api/app.py      # Port 5004
```

**Frontend** (from `project/`):
```bash
npm run dev                   # Port 5173
```

### Services

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

These are seeded automatically via migrations.


## API Documentation

Interactive API documentation is available via **Swagger UI**:

1. Open `docs/swagger-ui.html` directly in your browser, **or**
2. Serve it locally:
   ```bash
   cd docs
   python -m http.server 8080
   ```
   Then visit: http://localhost:8080/swagger-ui.html

The full OpenAPI 3.0 spec is at `docs/openapi.yaml`.


## Features

- User login and authentication
- Forgot password with email reset link
- Dashboard with project statistics
- Department-wise chart data
- Project listing with search and sort by priority
- Create new projects
- Start, close, and cancel projects
- Request and error logging across all APIs
- Interactive Swagger API documentation


## Troubleshooting

| Problem | Solution |
|---------|----------|
| `mysql.connector` import error | Run `pip install -r requirements.txt` |
| `Access denied for user 'root'` | Check `DB_PASSWORD` in your `.env` file |
| Port already in use | Kill the process using the port, or change the port in `.env` |
| Mail sending fails | Verify Gmail App Password and that 2-Step Verification is enabled |
| Frontend can't reach APIs | Make sure all 5 API services are running |
| `migrations/ directory not found` | Run `python migrate.py` from inside the `project_api/` directory |
