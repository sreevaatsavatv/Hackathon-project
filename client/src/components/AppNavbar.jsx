import { useNavigate } from "react-router-dom";

export default function AppNavbar({
  user,
  role,
  alwaysShowBothRoles,
  onLogout,
}) {
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 shadow z-10 bg-gray-900 border-b border-gray-800 sticky top-0">
      <span
        className="text-2xl font-extrabold tracking-tight cursor-pointer select-none text-white drop-shadow"
        onClick={() => navigate("/")}
      >
        Mentorship Scheduler
      </span>
      <div className="flex gap-2 items-center">
        {!isLoggedIn && (
          <>
            <button
              className="px-5 py-2 rounded font-semibold bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-5 py-2 rounded font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        )}
        {isLoggedIn && (
          <>
            <button
              className="px-4 py-1 rounded font-semibold bg-gray-800 text-gray-100 hover:bg-gray-700 mr-2"
              onClick={() => navigate("/profile")}
            >
              {user?.name ? `${user.name} (Profile)` : "Profile"}
            </button>
            {role === "student" && (
              <button
                className="px-4 py-1 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => navigate("/student")}
              >
                Student Dashboard
              </button>
            )}
            {role === "mentor" && (
              <button
                className="px-4 py-1 rounded font-semibold bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => navigate("/mentor")}
              >
                Mentor Dashboard
              </button>
            )}
            <button
              className="px-4 py-1 rounded font-semibold bg-red-600 text-white hover:bg-red-700 ml-2"
              onClick={() => {
                if (typeof onLogout === "function") {
                  onLogout();
                } else {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
