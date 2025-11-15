import Event from '../models/eventModel.js';

//create
export const createEvent = async (req,res)=>{
        // console.log("Request Body:", req.body);

        // res.status(201).json({message:"Create Event endpoint hit"});
    try{
        // return;
        // let payload = req.body;
        // let dataToSave = {};
        // if (!payload || Object.keys(payload).length === 0) {
        //     return res.status(400).json({ message: "Invalid event data" });
        // }
        // if (payload.userId && typeof payload.userId !== 'string') {
        //     return res.status(400).json({ message: "Invalid userId format" });
        // } else {
        //     dataToSave.user_id = String(payload.userId);
        // }
        // console.log("dataToSave:", dataToSave);
        // res.status(400).json({ message: "Invalid event data" });
        // return;
        // dataToSave.title = payload.title || "Untitled Event";
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    }catch (error) {
        res.status(500).json({message:"Error creating event", error});
    }
};

// Get all events
export const getEventsByUser = async (req, res) => {
  try {
    if (req.params.eventId) {
      const event = await Event.findById(req.params.eventId);
      return res.status(200).json(event);
    }
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Update
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

//Delete
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
