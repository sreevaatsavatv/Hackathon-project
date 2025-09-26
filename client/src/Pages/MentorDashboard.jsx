import { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar.jsx";

export default function MentorDashboard() {
  const [sessions, setSessions] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []));
  }, []);

  const updateStatus = async (id, status, newTime) => {
    const res = await fetch(`http://localhost:5000/api/sessions/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, time: newTime }),
    });
    const data = await res.json();
    if (res.ok) {
      setSessions((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status, time: newTime || s.time } : s
        )
      );
      setNotification(
        status === "Rescheduled"
          ? "Session rescheduled and student notified."
          : `Session ${status.toLowerCase()}.`
      );
    }
    setRescheduleId(null);
    setRescheduleTime("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AppNavbar removed: now only rendered in App.jsx */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Mentor Dashboard
        </h2>
        {notification && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700 text-center font-medium">
            {notification}
          </div>
        )}
        <div className="space-y-4 mb-10">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-gray-200"
            >
              <div className="font-semibold text-lg">{s.topic}</div>
              <div className="text-gray-500 text-sm">
                {s.date} at {s.time} – Requested by {s.student}
              </div>
              {s.status === "Pending" ? (
                rescheduleId === s._id ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="New Time (e.g. 11:00 AM)"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
                        onClick={() => {
                          if (rescheduleTime)
                            updateStatus(s._id, "Rescheduled", rescheduleTime);
                        }}
                      >
                        Confirm Reschedule
                      </button>
                      <button
                        className="px-4 py-1 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setRescheduleId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
                      onClick={() => updateStatus(s._id, "Accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                      onClick={() => updateStatus(s._id, "Declined")}
                    >
                      Decline
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
                      onClick={() => setRescheduleId(s._id)}
                    >
                      Reschedule
                    </button>
                  </div>
                )
              ) : (
                <div className="mt-2 text-sm text-gray-600">
                  Status: <span className="font-semibold">{s.status}</span>
                  {s.status === "Rescheduled" && <span> to {s.time}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Upcoming sessions table */}
        <h3 className="text-2xl font-semibold mb-4">Upcoming Sessions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Student</th>
                <th className="py-2 px-4 text-left">Topic</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="py-2 px-4">{s.student}</td>
                    <td className="py-2 px-4">{s.topic}</td>
                    <td className="py-2 px-4">{s.date}</td>
                    <td className="py-2 px-4">{s.time}</td>
                    <td className="py-2 px-4">{s.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
