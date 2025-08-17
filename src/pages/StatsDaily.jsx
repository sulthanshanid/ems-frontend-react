import React, { useState, useEffect, useRef, useContext } from "react";
import { Pie, Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";
import SideBar from "../components/Sidebar";
import Footer from "../components/Footer";  
import Topbar from "../components/Topbar";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function StatsDaily() {
  const { token } = useContext(AuthContext);

  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalWage, setTotalWage] = useState(0);
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [workplaceMap, setWorkplaceMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalWorkplace, setModalWorkplace] = useState("");
  const [modalEmployees, setModalEmployees] = useState([]);
  const modalRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiRequest(API.DAILY, "GET", null, token);
      const weekRes = await apiRequest(API.WEEKLY, "GET", null, token);

      if (res.workplaces) {
        setPresent(res.totals?.totalPresent || 0);
        setAbsent(res.totals?.totalAbsent || 0);
        setTotal(
          (res.totals?.totalPresent || 0) + (res.totals?.totalAbsent || 0)
        );
        setTotalWage(res.totals?.totalSalary || 0);

        let allPresentEmps = [];
        let allAbsentEmps = [];

        res.workplaces.forEach((wp) => {
          allPresentEmps = allPresentEmps.concat(
            wp.presentEmployees.map((emp) => ({
              ...emp,
              workplace_name: wp.workplace_name,
            }))
          );
          allAbsentEmps = allAbsentEmps.concat(
            wp.absentEmployees.map((emp) => ({
              ...emp,
              workplace_name: wp.workplace_name,
            }))
          );
        });

        setPresentEmployees(allPresentEmps);
        setAbsentEmployees(allAbsentEmps);
        buildWorkplaceSummary(res.workplaces);
      } else {
        setPresent(res.present || 0);
        setAbsent(res.absent || 0);
        setTotal(res.total || 0);
        setPresentEmployees(res.presentEmployees || []);
        setAbsentEmployees(res.absentEmployees || []);
        buildWorkplaceSummary(res.presentEmployees || []);
      }

      setWeeklyData(weekRes);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  function buildWorkplaceSummary(workplaces) {
    const map = {};
    workplaces.forEach((wp) => {
      let wageSum = 0;
      let overtimeCount = 0;
      wp.presentEmployees.forEach((emp) => {
        wageSum += emp.total_daily_wage || 0;
        if ((emp.overtime_wage || 0) > 0) overtimeCount++;
      });
      map[wp.workplace_name] = {
        employees: wp.presentEmployees.concat(wp.absentEmployees),
        wage: wageSum,
        overtimeCount,
      };
    });
    setWorkplaceMap(map);
  }

  function openModal(workplace, employees) {
    setModalWorkplace(workplace);
    setModalEmployees(employees);
    setShowModal(true);
  }

  function downloadPDF() {
    html2canvas(modalRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("employee-details.pdf");
    });
  }

  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  const weeklyBarData = {
    labels: weeklyData.map((d) => d.date),
    datasets: [
      {
        label: "Present",
        data: weeklyData.map((d) => d.present),
        backgroundColor: "#2563eb",
      },
      {
        label: "Absent",
        data: weeklyData.map((d) => d.absent),
        backgroundColor: "#f59e0b",
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar/>

      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <Topbar />

        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Attendance Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              label="Present Today"
              value={present}
              color="bg-green-500"
            />
            <SummaryCard
              label="Absent Today"
              value={absent}
              color="bg-red-500"
            />
            <SummaryCard
              label="Total Employees"
              value={total}
              color="bg-blue-500"
            />
            <SummaryCard
              label="Total Wage (Present)"
              value={`${totalWage.toFixed(2)} AED`}
              color="bg-yellow-400 text-black"
            />
          </div>

          {/* Workplace Summary Table */}
          <div className="bg-white rounded-2xl shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Workplace Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Workplace</th>
                    <th>Employee Count</th>
                    <th>Total Wage (AED)</th>
                    <th>Overtime Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(workplaceMap).map(([name, data]) => (
                    <tr
                      key={name}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openModal(name, data.employees)}
                    >
                      <td className="px-4 py-2 text-blue-600 underline">
                        {name}
                      </td>
                      <td className="text-center">{data.employees.length}</td>
                      <td className="text-center">
                        {data.wage.toFixed(2)} AED
                      </td>
                      <td className="text-center">{data.overtimeCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts & Employee Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Attendance Breakdown">
              <Pie data={pieData} />
            </ChartCard>

            <ChartCard title="Past Week Overview">
              <Bar
                data={weeklyBarData}
                options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </ChartCard>

            <ListCard
              title="Present Employees"
              items={presentEmployees}
              type="present"
            />
            <ListCard
              title="Absent Employees"
              items={absentEmployees}
              type="absent"
            />
          </div>

          {/* Footer */}
          <Footer/>
        </main>

        {/* Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-lg max-w-2xl w-full"
            >
              <h2 className="text-xl font-bold mb-4">
                Employees at {modalWorkplace}
              </h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {modalEmployees.map((emp) => (
                  <div
                    key={emp.employee_id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {emp.name} (ID: {emp.employee_id})
                      </p>
                      <p className="text-sm text-gray-600">
                        Base: {emp.basic_wage?.toFixed(2)} AED |{" "}
                        {emp.overtime_wage > 0 && (
                          <>
                            OT:{" "}
                            <span className="text-red-600 font-semibold">
                              {emp.overtime_wage.toFixed(2)}
                            </span>{" "}
                            |{" "}
                          </>
                        )}
                        Total: {emp.total_daily_wage?.toFixed(2)} AED
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        emp.overtime_wage > 0
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {emp.overtime_wage > 0 ? "Overtime" : "Normal"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={downloadPDF}
                >
                  Download PDF
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Reusable Components ---
const SummaryCard = ({ label, value, color }) => (
  <div className={`rounded-2xl shadow p-4 text-center text-white ${color}`}>
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="mt-1 text-sm">{label}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-4">
    <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
    {children}
  </div>
);

const ListCard = ({ title, items, type }) => (
  <div className="bg-white rounded-2xl shadow p-4 max-h-[400px] overflow-y-auto">
    <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
    <ul className="space-y-2">
      {items.length ? (
        items.map((emp) => (
          <li key={emp.employee_id} className="p-2 border rounded-lg">
            <p className="font-medium">
              {emp.name} (ID: {emp.employee_id})
            </p>
            {type === "present" && (
              <p className="text-sm text-gray-600">
                Base: {emp.basic_wage} AED | OT:{" "}
                <span className="text-red-600">
                  {emp.overtime_wage?.toFixed(2)}
                </span>{" "}
                | Total: {emp.total_daily_wage} AED | Workplace:{" "}
                {emp.workplace_name}
              </p>
            )}
            {type === "absent" && (
              <p className="text-sm text-gray-600">
                Workplace: {emp.workplace_name}
              </p>
            )}
          </li>
        ))
      ) : (
        <li className="text-gray-500 text-center py-2">No data</li>
      )}
    </ul>
  </div>
);
