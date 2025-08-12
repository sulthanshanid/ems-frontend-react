const API_BASE_URL = "http://localhost:5000/api";

const API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  WORKPLACES: `${API_BASE_URL}/workplaces`,
  LOANS: `${API_BASE_URL}/loans`,
  DEDUCTIONS: `${API_BASE_URL}/deductions`,
  ATTENDANCE: `${API_BASE_URL}/attendance`,
  ATTENDANCE_SUMMARY: `${API_BASE_URL}/attendance/summary`,
  DAILY: `${API_BASE_URL}/stats/daily`,
  WEEKLY: `${API_BASE_URL}/stats/weekly`,
  PROFILE: `${API_BASE_URL}/profile`,
  SUPERADMIN: `${API_BASE_URL}/superadmin`,
  VALIDATE_TOKEN: `${API_BASE_URL}/auth/validate-token`,
  EMPLOYEES: `${API_BASE_URL}/employees`,
  PROFILE: `${API_BASE_URL}/profile`,
  SALARY_SUMMARY: `${API_BASE_URL}/salary/summary`,
  STATS: `${API_BASE_URL}/stats`,
  DASHSTATS: `${API_BASE_URL}/stats/dashstats`,
  RECENT: `${API_BASE_URL}/stats/recent-activity`,
};

export default API;
