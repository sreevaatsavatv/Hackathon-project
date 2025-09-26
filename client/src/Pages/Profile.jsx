import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userObj = JSON.parse(stored);
      setUser(userObj);
      if (userObj.role === "mentor") {
        setSessionsLoading(true);
        fetch("http://localhost:5000/api/sessions")
          .then((res) => res.json())
          .then((data) => setSessions(data.sessions || []))
          .finally(() => setSessionsLoading(false));
      }
    }
    setLoading(false);
  }, []);

  if (loading)
    return <div className="text-center text-white mt-10">Loading...</div>;
  if (!user)
    return <div className="text-center text-red-400 mt-10">No user found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Profile
        </h2>
        <div className="mb-4">
          <span className="block text-gray-400 mb-1">Name</span>
          <span className="block text-lg text-white font-semibold">
            {user.name}
          </span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-400 mb-1">Email</span>
          <span className="block text-lg text-white font-semibold">
            {user.email}
          </span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-400 mb-1">Role</span>
          <span className="block text-lg text-white font-semibold capitalize">
            {user.role}
          </span>
        </div>

        {/* Mentor: Upcoming Sessions */}
        {user.role === "mentor" && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">
              Upcoming Sessions
            </h3>
            {sessionsLoading ? (
              <div className="text-gray-300 text-center">
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-gray-400 text-center">
                No upcoming sessions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded shadow border border-gray-700 text-white">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left">Student</th>
                      <th className="py-2 px-4 text-left">Topic</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Time</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, idx) => (
                      <tr
                        key={s._id || s.id || idx}
                        className="border-t border-gray-700"
                      >
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
