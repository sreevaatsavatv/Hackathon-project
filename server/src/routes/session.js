const express = require("express");
const sessionController = require("../controllers/sessionController");
const router = express.Router();

// POST /api/sessions - create a session
router.post("/", sessionController.createSession);

// GET /api/sessions?student=NAME - get sessions for a student
router.get("/", sessionController.getSessions);

// POST /api/sessions/:id/status - update session status
router.post("/:id/status", sessionController.updateSessionStatus);

module.exports = router;
