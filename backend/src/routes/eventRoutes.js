import express from "express";
import {
  createEvent,
  getEventsByUser,
  updateEvent,
  deleteEvent,
} from "../controllers/EventController.js";

const router = express.Router();

router.post("/", createEvent);                  // POST /api/events
router.get("/", getEventsByUser);        // GET /api/events/:userId
router.get("/:eventId", getEventsByUser);        // GET /api/events/:userId
router.put("/:eventId", updateEvent);           // PUT /api/events/:eventId
router.delete("/:eventId", deleteEvent);        // DELETE /api/events/:eventId

// module.exports = router;
export default router;
