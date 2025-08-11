const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key_here"; // Change this to a strong secret in production

// Fake DB
let users = [
  { id: 1, name: "Admin", email: "admin@admin.com", password: "admin" },
];

let employees = [
  { id: 1, name: "John Doe", role: "Developer", salary: 50000 },
  { id: 2, name: "Jane Smith", role: "Designer", salary: 45000 },
];

app.use(cors());
app.use(bodyParser.json());

// Signup route
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const user = { id: Date.now(), name, email, password };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ user, token });
});

// Login route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ user, token });
});

// Validate token route
app.get("/api/validate-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    res.json({ valid: true, user });
  });
});

// Middleware for token verification
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Employee routes (protected)
app.get("/api/employees", verifyToken, (req, res) => {
  res.json(employees);
});

app.post("/api/employees", verifyToken, (req, res) => {
  const { name, role, salary } = req.body;
  const newEmployee = { id: Date.now(), name, role, salary };
  employees.push(newEmployee);
  res.json({ message: "Employee added", employee: newEmployee });
});

app.put("/api/employees/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, role, salary } = req.body;
  const index = employees.findIndex((emp) => emp.id == id);
  if (index === -1) return res.status(404).json({ message: "Employee not found" });

  employees[index] = { id: parseInt(id), name, role, salary };
  res.json({ message: "Employee updated", employee: employees[index] });
});

app.delete("/api/employees/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  employees = employees.filter((emp) => emp.id != id);
  res.json({ message: "Employee deleted" });
});
let deductions = [
  // sample initial data
  {
    id: 1,
    employeeId: 1,
    amount: 200.5,
    remark: "Late arrival",
    date: "2025-08-01",
  },
  {
    id: 2,
    employeeId: 2,
    amount: 100,
    remark: "Missed deadline",
    date: "2025-08-05",
  },
];

// Get all deductions
app.get("/api/deductions", verifyToken, (req, res) => {
  res.json(deductions);
});

// Get deduction by id
app.get("/api/deductions/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const deduction = deductions.find((d) => d.id == id);
  if (!deduction) return res.status(404).json({ message: "Deduction not found" });
  res.json(deduction);
});

// Add new deduction
app.post("/api/deductions", verifyToken, (req, res) => {
  const { employeeId, amount, remark, date } = req.body;
  if (!employeeId || !amount || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newDeduction = {
    id: Date.now(),
    employeeId,
    amount,
    remark: remark || "",
    date,
  };
  deductions.push(newDeduction);
  res.json({ message: "Deduction added", deduction: newDeduction });
});

// Update deduction
app.put("/api/deductions/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { employeeId, amount, remark, date } = req.body;
  const index = deductions.findIndex((d) => d.id == id);
  if (index === -1) return res.status(404).json({ message: "Deduction not found" });

  deductions[index] = {
    id: parseInt(id),
    employeeId,
    amount,
    remark: remark || "",
    date,
  };
  res.json({ message: "Deduction updated", deduction: deductions[index] });
});

// Delete deduction
app.delete("/api/deductions/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const initialLength = deductions.length;
  deductions = deductions.filter((d) => d.id != id);
  if (loans.length === initialLength) {
    return res.status(404).json({ message: "Deduction not found" });
  }
  res.json({ message: "Deduction deleted" });
});
let loans = [
  // sample initial data
  {
    id: 1,
    employeeId: 1,
    amount: 200.5,
    remark: "Late arrival",
    date: "2025-08-01",
  },
  {
    id: 2,
    employeeId: 2,
    amount: 100,
    remark: "Missed deadline",
    date: "2025-08-05",
  },
];

// Get all loans
app.get("/api/loans", verifyToken, (req, res) => {
  res.json(loans);
});

// Get deduction by id
app.get("/api/loans/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const deduction = loans.find((d) => d.id == id);
  if (!deduction) return res.status(404).json({ message: "Deduction not found" });
  res.json(deduction);
});

// Add new deduction
app.post("/api/loans", verifyToken, (req, res) => {
  const { employeeId, amount, remark, date } = req.body;
  if (!employeeId || !amount || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newDeduction = {
    id: Date.now(),
    employeeId,
    amount,
    remark: remark || "",
    date,
  };
  loans.push(newDeduction);
  res.json({ message: "Deduction added", deduction: newDeduction });
});

// Update deduction
app.put("/api/loans/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { employeeId, amount, remark, date } = req.body;
  const index = loans.findIndex((d) => d.id == id);
  if (index === -1) return res.status(404).json({ message: "Deduction not found" });

  loans[index] = {
    id: parseInt(id),
    employeeId,
    amount,
    remark: remark || "",
    date,
  };
  res.json({ message: "Deduction updated", deduction: loans[index] });
});

// Delete deduction
app.delete("/api/loans/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const initialLength = loans.length;
  loans = loans.filter((d) => d.id != id);
  if (loans.length === initialLength) {
    return res.status(404).json({ message: "Deduction not found" });
  }
  res.json({ message: "Deduction deleted" });
});
let userProfile = {
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
};

// GET /api/profile
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// PUT /api/profile
app.put("/api/profile", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  userProfile = { name, email, phone };
  res.json(userProfile);
});
// Add this near your other mock data at the top:
let workplaces = [
  { id: 1, name: "Head Office" },
  { id: 2, name: "Branch Office" },
];

// Workplaces routes (protected)
app.get("/api/workplaces", verifyToken, (req, res) => {
  res.json(workplaces);
});

app.get("/api/workplaces/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const workplace = workplaces.find((w) => w.id == id);
  if (!workplace) return res.status(404).json({ message: "Workplace not found" });
  res.json(workplace);
});

app.post("/api/workplaces", verifyToken, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Workplace name is required" });
  }
  const newWorkplace = { id: Date.now(), name: name.trim() };
  workplaces.push(newWorkplace);
  res.json({ message: "Workplace added", workplace: newWorkplace });
});

app.put("/api/workplaces/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Workplace name is required" });
  }
  const index = workplaces.findIndex((w) => w.id == id);
  if (index === -1) return res.status(404).json({ message: "Workplace not found" });

  workplaces[index] = { id: parseInt(id), name: name.trim() };
  res.json({ message: "Workplace updated", workplace: workplaces[index] });
});

app.delete("/api/workplaces/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const initialLength = workplaces.length;
  workplaces = workplaces.filter((w) => w.id != id);
  if (workplaces.length === initialLength) {
    return res.status(404).json({ message: "Workplace not found" });
  }
  res.json({ message: "Workplace deleted" });
});
// Mock attendance data store
let attendanceRecords = [
  // Sample existing records
  {
    id: 1,
    employee_id: 1,
    workplace_id: 1,
    date: "2025-08-10",
    status: "present",
    wage: 500,
  },
  {
    id: 2,
    employee_id: 2,
    workplace_id: 2,
    date: "2025-08-10",
    status: "absent",
    wage: 0,
  },
];

// Helper to generate new ID
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

// Get attendance records for a specific date
app.get("/api/attendance", verifyToken, (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: "Date query parameter required" });
  }
  const records = attendanceRecords.filter((rec) => rec.date === date);
  res.json(records);
});

// Bulk save attendance records for a date
app.post("/api/attendance", verifyToken, (req, res) => {
  const records = req.body; // expect array of attendance records
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: "Attendance records array required" });
  }

  // Validate required fields & uniqueness in input
  const seen = new Set();
  for (const rec of records) {
    const { employee_id, workplace_id, date, status, wage } = rec;
    if (
      !employee_id ||
      !workplace_id ||
      !date ||
      !status ||
      wage === undefined
    ) {
      return res.status(400).json({ message: "Missing fields in attendance record" });
    }
    const key = `${employee_id}_${date}_${workplace_id}`;
    if (seen.has(key)) {
      return res.status(400).json({ message: "Duplicate attendance record in input for employee, date, workplace" });
    }
    seen.add(key);
  }

  // Update or insert each record in mock DB
  records.forEach((rec) => {
    const index = attendanceRecords.findIndex(
      (r) =>
        r.employee_id === rec.employee_id &&
        r.workplace_id === rec.workplace_id &&
        r.date === rec.date
    );
    if (index >= 0) {
      attendanceRecords[index] = { ...attendanceRecords[index], ...rec };
    } else {
      attendanceRecords.push({ id: generateId(), ...rec });
    }
  });

  res.json({ message: "Attendance saved", attendance: records });
});

app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));
