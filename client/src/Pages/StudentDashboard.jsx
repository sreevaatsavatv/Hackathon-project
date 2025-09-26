import { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar.jsx"; // Keep this line to maintain the navbar
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function StudentDashboard() {
  const [sessions, setSessions] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notification, setNotification] = useState("");

  // Chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  // Chart data (case-insensitive, robust)
  const data = [
    {
      name: "Accepted",
      value: sessions.filter(
        (s) => (s.status || "").toLowerCase() === "accepted"
      ).length,
    },
    {
      name: "Declined",
      value: sessions.filter(
        (s) => (s.status || "").toLowerCase() === "declined"
      ).length,
    },
    {
      name: "Rescheduled",
      value: sessions.filter(
        (s) => (s.status || "").toLowerCase() === "rescheduled"
      ).length,
    },
    {
      name: "Pending",
      value: sessions.filter(
        (s) =>
          !["accepted", "declined", "rescheduled"].includes(
            (s.status || "").toLowerCase()
          )
      ).length,
    },
  ];

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      setStudentName(userObj.name);
      fetch(
        "http://localhost:5000/api/sessions?student=" +
          encodeURIComponent(userObj.name)
      )
        .then((res) => {
          if (!res.ok) throw new Error("No sessions found");
          return res.json();
        })
        .then((data) => setSessions(data.sessions || []))
        .catch(() => setSessions([]));
    }
  }, []);

  const requestSession = async () => {
    if (!user || !user.name || !topic || !date || !time) {
      setNotification("Fill all fields");
      return;
    }
    const res = await fetch("http://localhost:5000/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student: user.name, topic, date, time }),
    });
    const data = await res.json();
    if (res.ok) {
      setSessions((prev) => [...prev, data.session]);
      setTopic("");
      setDate("");
      setTime("");
      setNotification("Session requested!");
    } else {
      setNotification(data.message || "Error requesting session");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AppNavbar removed: now only rendered in App.jsx */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Student Dashboard
        </h2>
        {notification && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700 text-center font-medium">
            {notification}
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="flex flex-col gap-4">
            <input
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled
            />
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">Select Topic</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Programming">Programming</option>
              <option value="Career Guidance">Career Guidance</option>
            </select>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Select Time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
              onClick={requestSession}
            >
              Request Session
            </button>
          </div>
        </div>

        {/* Session Table */}
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white rounded shadow border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Topic</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, index) => (
                <tr key={s._id || s.id || index} className="border-t">
                  <td className="py-2 px-4">{s.topic}</td>
                  <td className="py-2 px-4">{s.date}</td>
                  <td className="py-2 px-4">{s.time}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold 
                        ${
                          s.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : s.status === "Declined"
                            ? "bg-red-100 text-red-700"
                            : s.status === "Rescheduled"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats Chart */}
        <h3 className="text-2xl font-semibold mb-4">My Session Stats</h3>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Session Report */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h4 className="text-xl font-bold mb-4 text-blue-700">
            Session Report
          </h4>
          <ul className="mb-4 text-gray-700 text-left">
            <li>
              Accepted: <span className="font-semibold">{data[0].value}</span>
            </li>
            <li>
              Declined: <span className="font-semibold">{data[1].value}</span>
            </li>
            <li>
              Rescheduled:{" "}
              <span className="font-semibold">{data[2].value}</span>
            </li>
            <li>
              Pending: <span className="font-semibold">{data[3].value}</span>
            </li>
          </ul>
          <div className="text-gray-800 font-medium">
            {data[0].value > 0
              ? `Great job! You have ${data[0].value} accepted session${
                  data[0].value > 1 ? "s" : ""
                }.`
              : data[3].value > 0
              ? `You have ${data[3].value} pending session request${
                  data[3].value > 1 ? "s" : ""
                }. Please wait for mentor response.`
              : data[1].value > 0
              ? `You have ${data[1].value} declined session${
                  data[1].value > 1 ? "s" : ""
                }. Try requesting a different time or topic.`
              : `No session activity yet. Request a session to get started!`}
          </div>
        </div>
      </div>
    </div>
  );
}
