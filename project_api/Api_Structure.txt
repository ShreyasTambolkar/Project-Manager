API STRUCTURE

Base_url = "http://localhost"

there are 5 apis running on different ports:

1. auth api - port 5000
2. stats api - port 5001
3. charts api - port 5002
4. listing api - port 5003
5. create api - port 5004


1. AUTH API (port 5000)


a) login
url: POST http://localhost:5000/login
request:
{
"email": "alice@projects.com",
"password": "Alice@123"
}
responses:

- 200 = login successful
- 400 = email or password missing
- 401 = email not found or wrong password


b) forgot password
url: POST http://localhost:5000/forgot-password
request:
{
"email": "alice@projects.com"
}
responses:

- 200 = reset link sent (same response whether email exists or not)
- 400 = email missing
- 500 = server error (e.g. mail delivery failed)



2. STATS API (port 5001)


a) get project stats
url: GET http://localhost:5001/projects/stats
request: none
response (200):
{
"total": 40,
"closed": 29,
"running": 5,
"cancelled": 3,
"closure_delay": 2
}




3. CHARTS API (port 5002)


a) get department wise stats
url: GET http://localhost:5002/projects/chart/dept-stats
request: none
response (200):
[
{ "department": "Finance", "total": 4, "closed": 3 },
{ "department": "HR", "total": 6, "closed": 5 },
{ "department": "Maintenance", "total": 7, "closed": 7 }
]


4. LISTING API (port 5003)



a) get all projects
url: GET http://localhost:5003/projects
url with search: GET http://localhost:5003/projects?q=Filter

responses:

- 200 = returns list of projects
- 404 = no projects found

b) get projects sorted by priority
url: GET http://localhost:5003/projects/sorted
request: none
responses:

- 200 = returns projects sorted high > medium > low
- 404 = no projects found

c) get single project
url: GET http://localhost:5003/projects/1
request: none
responses:

- 200 = returns the project
- 404 = project not found


d) start project
url: POST http://localhost:5003/projects/1/start
request: none
responses:

- 200 = status set to Running
- 404 = project not found

e) close project
url: POST http://localhost:5003/projects/1/close
request: none
responses:

- 200 = status set to Closed
- 404 = project not found

f) cancel project
url: POST http://localhost:5003/projects/1/cancel
request: none
responses:

- 200 = status set to Cancelled
- 404 = project not found


5. CREATE API (port 5004)


a) create new project
url: POST http://localhost:5004/projects
request:
{
"project_name": "New Valve Installation",
"start_date": "2024-01-15",
"end_date": "2024-06-30",
"reason": "Business",
"type": "Internal",
"division": "Compressor",
"category": "Quality A",
"priority": "High",
"department": "Strategy",
"location": "Pune",
"status": "Registered"
}

responses:

- 201 = project created
- 400 = missing project_name / invalid priority / invalid status
- 409 = project name already exists


 STATUS CODES USED

200 = success
201 = created successfully
400 = missing or invalid data
401 = unauthorized ,wrong login
404 = not found
409 = duplicate data
500 = server error
