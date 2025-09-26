import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userObj = JSON.parse(stored);
      setUser(userObj);
      if (userObj.role === "mentor") {
        // Mentor: fetch all sessions
        fetch("http://localhost:5000/api/sessions")
          .then((res) => (res.ok ? res.json() : { sessions: [] }))
          .then((data) => setSessions(data.sessions || []))
          .catch(() => setSessions([]));
      } else {
        // Student: fetch only their sessions
        fetch(
          `http://localhost:5000/api/sessions?student=${encodeURIComponent(
            userObj.name
          )}`
        )
          .then((res) => (res.ok ? res.json() : { sessions: [] }))
          .then((data) => setSessions(data.sessions || []))
          .catch(() => setSessions([]));
      }
    }
  }, []);

  const handleStudent = () => {
    if (!studentName.trim()) {
      setError("Please enter your name");
      return;
    }
    localStorage.setItem("studentName", studentName);
    navigate("/student");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-12 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          Mentorship Scheduler
        </h1>
        {user ? (
          <>
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                Welcome, {user.name}!
              </div>
              <div className="text-gray-600 mb-1">
                Role: <span className="font-bold capitalize">{user.role}</span>
              </div>
              <div className="text-gray-600 mb-1">
                Email: <span className="font-mono">{user.email}</span>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-blue-700">
                {user.role === "mentor"
                  ? "Upcoming Sessions"
                  : "Your Session Requests"}
              </h2>
              {sessions.length === 0 ? (
                <div className="text-gray-500">
                  {user.role === "mentor"
                    ? "No upcoming sessions found."
                    : "No session requests found."}
                </div>
              ) : user.role === "mentor" ? (
                <table className="min-w-full bg-white rounded shadow border border-gray-200 text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2">Student</th>
                      <th className="py-1 px-2">Topic</th>
                      <th className="py-1 px-2">Date</th>
                      <th className="py-1 px-2">Time</th>
                      <th className="py-1 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, idx) => (
                      <tr key={s._id || s.id || idx} className="border-t">
                        <td className="py-1 px-2">{s.student}</td>
                        <td className="py-1 px-2">{s.topic}</td>
                        <td className="py-1 px-2">{s.date}</td>
                        <td className="py-1 px-2">{s.time}</td>
                        <td className="py-1 px-2">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full bg-white rounded shadow border border-gray-200 text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2">Topic</th>
                      <th className="py-1 px-2">Date</th>
                      <th className="py-1 px-2">Time</th>
                      <th className="py-1 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, idx) => (
                      <tr key={s._id || s.id || idx} className="border-t">
                        <td className="py-1 px-2">{s.topic}</td>
                        <td className="py-1 px-2">{s.date}</td>
                        <td className="py-1 px-2">{s.time}</td>
                        <td className="py-1 px-2">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-gray-600 text-center">
              Please{" "}
              <a href="/login" className="text-blue-600 underline">
                login
              </a>{" "}
              or{" "}
              <a href="/register" className="text-blue-600 underline">
                register
              </a>{" "}
              to continue.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
