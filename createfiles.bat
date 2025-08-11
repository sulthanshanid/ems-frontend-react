@echo off
REM Go to your project folder first, e.g. cd C:\path\to\project

REM Remove existing src folder if exists
rmdir /S /Q src

REM Create folders
mkdir src
mkdir src\components
mkdir src\pages
mkdir src\assets
mkdir src\styles
mkdir src\utils
mkdir src\context

REM Create component files
type nul > src\components\Navbar.jsx
type nul > src\components\Footer.jsx
type nul > src\components\ProtectedRoute.jsx

REM Create page files
type nul > src\pages\Login.jsx
type nul > src\pages\Signup.jsx
type nul > src\pages\Dashboard.jsx
type nul > src\pages\EmployeeView.jsx
type nul > src\pages\EmployeeEdit.jsx
type nul > src\pages\EmployeeAdd.jsx
type nul > src\pages\WorkplaceView.jsx
type nul > src\pages\WorkplaceEdit.jsx
type nul > src\pages\WorkplaceAdd.jsx
type nul > src\pages\LoanView.jsx
type nul > src\pages\LoanEdit.jsx
type nul > src\pages\LoanAdd.jsx
type nul > src\pages\DeductionView.jsx
type nul > src\pages\DeductionAdd.jsx
type nul > src\pages\AttendanceView.jsx
type nul > src\pages\AttendanceEdit.jsx
type nul > src\pages\AttendanceAdd.jsx
type nul > src\pages\AttendanceSummary.jsx
type nul > src\pages\AllEmployees.jsx
type nul > src\pages\StatsDaily.jsx
type nul > src\pages\Profile.jsx
type nul > src\pages\SuperAdmin.jsx

REM Assets and styles placeholders
type nul > src\assets\placeholder.txt
type nul > src\styles\global.css

REM Utils and context
type nul > src\utils\api.js
type nul > src\context\AuthContext.jsx

REM App and index files
type nul > src\App.jsx
type nul > src\index.js

echo ✅ Folder and file structure created successfully.
