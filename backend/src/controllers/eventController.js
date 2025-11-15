import Event from '../models/eventModel.js';

// Create event
export const createEvent = async (req, res) => {
  try {
    const { userId, title, date } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }
    if (!title) {
      return res.status(400).json({ message: "Event title is required" });
    }
    if (!date) {
      return res.status(400).json({ message: "Event date is required" });
    }

    // Check if date is in the past
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return res.status(400).json({ message: "Cannot create events in the past" });
    }

    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// Get all events for a user
export const getEventsByUser = async (req, res) => {
  try {
    // If eventId is provided, return single event
    if (req.params.eventId) {
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      return res.status(200).json(event);
    }
    
    // If userId is provided in query, filter by userId
    const { userId } = req.query;
    if (userId) {
      const events = await Event.find({ userId: userId })
        .sort({ date: 1, startTime: 1 }); // Sort by date and time
      return res.status(200).json(events);
    }
    
    // Otherwise return all events (for admin or testing)
    const events = await Event.find({}).sort({ date: 1, startTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { date } = req.body;

    // Check if date is being updated to past
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        return res.status(400).json({ message: "Cannot update event to a past date" });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};
