import express from "express";
import {
  createEvent,
  getEventsByUser,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);                  // POST /api/event
router.get("/", getEventsByUser);              // GET /api/event?userId=xxx
router.get("/:eventId", getEventsByUser);      // GET /api/event/:eventId
router.put("/:eventId", updateEvent);           // PUT /api/event/:eventId
router.delete("/:eventId", deleteEvent);       // DELETE /api/event/:eventId

// module.exports = router;
export default router;
