# Architecture

```
┌──────────────────────────────────────────┐
│        React Frontend (Vite :5173)        │
│                                           │
│  Login | Dashboard | Listing | Create     │
└──────────────┬───────────────────────────┘
               │ HTTP / REST
    ┌──────────┴──────────┐
    │                     │
┌───┴───┐ ┌──────┐ ┌─────┴──┐ ┌────────┐ ┌────────┐
│ Auth  │ │Stats │ │Charts  │ │Listing │ │Create  │
│ :5000 │ │:5001 │ │ :5002  │ │ :5003  │ │ :5004  │
└───┬───┘ └──┬───┘ └───┬────┘ └───┬────┘ └───┬────┘
    │        │         │          │           │
    └────────┴─────────┴──────────┴───────────┘
                       │
              ┌────────┴────────┐
              │  MySQL (project_db)  │
              │     :3306       │
              └─────────────────┘

Auth API ──── Gmail SMTP (password reset emails)
```

## Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, Flask (5 microservices)
- **Database:** MySQL
- **Mail:** Flask-Mail (Gmail SMTP)

## Services

| Service     | Port | What it does                     |
|-------------|------|----------------------------------|
| Auth API    | 5000 | Login, forgot/reset password     |
| Stats API   | 5001 | Project statistics               |
| Charts API  | 5002 | Department chart data            |
| Listing API | 5003 | List, search, sort, update status|
| Create API  | 5004 | Create new projects              |
