export const getSessions = () =>
  JSON.parse(localStorage.getItem("sessions") || "[]");

export const saveSessions = (sessions) =>
  localStorage.setItem("sessions", JSON.stringify(sessions));
