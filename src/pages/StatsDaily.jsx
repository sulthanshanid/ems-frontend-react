import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Modal, Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { apiRequest } from "../utils/apiClient";
import API from "../config/api";
import { AuthContext } from "../context/AuthContext";
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

      // Adjusting for new API response format including workplaces & totals
      if (res.workplaces) {
        // Aggregate totals from API response
        setPresent(res.totals?.totalPresent || 0);
        setAbsent(res.totals?.totalAbsent || 0);
        setTotal(
          (res.totals?.totalPresent || 0) +
            (res.totals?.totalAbsent || 0)
        );
        setTotalWage(res.totals?.totalSalary || 0);

        // Flatten employees from all workplaces for lists
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
        // fallback if shape differs
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

  // workplaceMap now built from workplaces array, not employees list
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
        backgroundColor: ["#198754", "#dc3545"],
      },
    ],
  };

  const weeklyBarData = {
    labels: weeklyData.map((d) => d.date),
    datasets: [
      {
        label: "Present",
        data: weeklyData.map((d) => d.present),
        backgroundColor: "#0d6efd",
      },
      {
        label: "Absent",
        data: weeklyData.map((d) => d.absent),
        backgroundColor: "#ffc107",
      },
    ],
  };

  return (
    <>
      <style>{`
        .dashboard-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
          background: #fff;
        }
        .dashboard-card h5 {
          margin-bottom: 1rem;
          font-weight: 600;
          color: #333;
        }
        .employee-list li {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          transition: background 0.2s;
        }
        .employee-list li:hover {
          background-color: #f8f9fa;
          cursor: default;
        }
        table.table {
          margin-bottom: 0;
        }
        table.table tbody tr:hover {
          background-color: #eef5ff;
          cursor: pointer;
        }
        .container {
          max-width: 1140px;
        }
        .badge {
          font-size: 0.8rem;
          padding: 0.25em 0.5em;
          border-radius: 0.35rem;
        }
        @media (max-width: 768px) {
          .dashboard-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>

      <div className="container py-5">
        <h1 className="mb-4">Attendance Dashboard</h1>

        {/* Summary Cards */}
        <div className="row text-center mb-4">
          <div className="col-md-3 mb-3">
            <div className="p-4 bg-success text-white dashboard-card">
              <h2>{present}</h2>
              <p>Present Today</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-4 bg-danger text-white dashboard-card">
              <h2>{absent}</h2>
              <p>Absent Today</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-4 bg-info text-white dashboard-card">
              <h2>{total}</h2>
              <p>Total Employees</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-4 bg-warning text-dark dashboard-card">
              <h4>Total Wage (Present)</h4>
              <h3>{totalWage.toFixed(2)} AED</h3>
            </div>
          </div>
        </div>

        {/* Workplace Summary */}
        <div className="dashboard-card p-3 mb-4">
          <h5 className="text-center">Workplace Summary</h5>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Workplace</th>
                <th>Employee Count</th>
                <th>Total Wage (AED)</th>
                <th>Overtime Employees</th>
              </tr>
            </thead>
            <tbody>
                
              {Object.entries(workplaceMap).map(([name, data]) => (
                <tr
                  key={name}
                  onClick={() => openModal(name, data.employees)}
                  title="Click for employee details"
                >
                  <td className="text-primary text-decoration-underline">
                    {name}
                  </td>
                  <td>{data.employees.length}</td>
                  <td>{data.wage.toFixed(2)} AED</td>
                  <td>{data.overtimeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts and Lists */}
        <div className="row">
          <div className="col-md-6">
            <div className="dashboard-card p-3 mb-4">
              <h5 className="text-center">Attendance Breakdown</h5>
              <Pie data={pieData} />
            </div>
            <div className="dashboard-card p-3">
              <h5 className="text-center">Present Employees</h5>
              <ul className="list-group employee-list">
                {presentEmployees.length > 0 ? (
                  presentEmployees.map((emp) => (
                    <li key={emp.employee_id} className="list-group-item">
                      <strong>{emp.name}</strong> (ID: {emp.employee_id})<br />
                      <small>
                        Base: {emp.basic_wage} AED | OT:{" "}
                        <span className="text-danger fw-bold">
                          {emp.overtime_wage?.toFixed(2)} AED
                        </span>{" "}
                        | Total: {emp.total_daily_wage} AED | Workplace:{" "}
                        {emp.workplace_name}
                      </small>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">No data</li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="dashboard-card p-3 mb-4">
              <h5 className="text-center">Past Week Overview</h5>
              <Bar
                data={weeklyBarData}
                options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
            <div className="dashboard-card p-3">
              <h5 className="text-center">Absent Employees</h5>
              <ul className="list-group employee-list">
                {absentEmployees.length > 0 ? (
                  absentEmployees.map((emp) => (
                    <li key={emp.employee_id} className="list-group-item">
                      <strong>{emp.name}</strong> (ID: {emp.employee_id})<br />
                      <small>Workplace: {emp.workplace_name}</small>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">No data</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Employee Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <div ref={modalRef}>
            <Modal.Header closeButton>
              <Modal.Title>Employees at {modalWorkplace}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul className="list-group">
                {modalEmployees.map((emp) => {
                  const baseWage = emp.basic_wage || 0;
                  const overtimeWage = emp.overtime_wage || 0;
                  const totalWage = emp.total_daily_wage || 0;
                  const hasOvertime = overtimeWage > 0;

                  return (
                    <li key={emp.employee_id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{emp.name}</strong> (ID: {emp.employee_id})
                          <br />
                          <small>
                            Base: {baseWage.toFixed(2)} AED |{" "}
                            {hasOvertime && (
                              <>
                                OT:{" "}
                                <span className="text-danger fw-bold">
                                  {overtimeWage.toFixed(2)} AED
                                </span>{" "}
                                |{" "}
                              </>
                            )}
                            Total: {totalWage.toFixed(2)} AED
                          </small>
                        </div>
                        {hasOvertime ? (
                          <span className="badge bg-danger">Overtime</span>
                        ) : (
                          <span className="badge bg-secondary">Normal</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-primary" onClick={downloadPDF}>
                Download PDF
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </>
  );
}
