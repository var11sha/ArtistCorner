import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form } from "react-bootstrap";
import "../css/scheduler.css";
import Swal from "sweetalert2";


const Scheduler = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventCategory, setEventCategory] = useState("Fitness");
  const [eventDescription, setEventDescription] = useState("");
  const [fullDay, setFullDay] = useState(false);
  const [repeat, setRepeat] = useState("None");
  const [repeatDays, setRepeatDays] = useState([]);
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")); // get logged in user

  // 🧩 Fetch events from backend when component loads
  useEffect(() => {
    if (user?._id) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/event/${user._id}`);
      const data = await res.json();
      if (res.ok) {
        // Convert backend events to FullCalendar format
        const formatted = data.map((e) => ({
          title: e.title,
          date: e.date,
        }));
        setEvents(formatted);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // 📅 When a date is clicked
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  // 💾 Save new event to backend
  const handleSaveEvent = async () => {
    // if (!eventTitle || (!eventTime && !fullDay)) {
    //   alert("⚠️ Required Fields Missing:\n\n• Please enter a title\n• Set a time or mark as full-day");
    //   return;
    // }

       if (!eventTitle || (!eventTime && !fullDay)) {
    Swal.fire({
      icon: "warning",
      title: "Required Fields Missing",
      text: "Please enter a title and set a time or mark as full-day.",
      confirmButtonColor: "#0d6efd",
    });
    return;
  }

  // success alert after saving
  Swal.fire({
    icon: "success",
    title: "Event Added!",
    text: "Your event has been successfully saved.",
    confirmButtonColor: "#198754",
  });

    const newEvent = {
      userId: user?._id || "guest", // fallback for testing
      title: eventTitle,
      description: eventDescription,
      date: selectedDate,
      startTime: fullDay ? null : eventTime,
      endTime: fullDay ? null : endTime,
      fullDay: fullDay,
      category: eventCategory,
      repeat: repeat,
      repeatDays: repeatDays,
    };

    try {
      const res = await fetch("http://localhost:5000/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();

      if (res.ok) {
        setEvents([...events, { title: data.title, date: data.date }]);
        setShowModal(false);
        resetForm();
      } else {
        alert(data.error || "Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // 🧹 Reset form
  const resetForm = () => {
    setEventTitle("");
    setEventTime("");
    setEndTime("");
    setEventCategory("Fitness");
    setEventDescription("");
    setFullDay(false);
    setRepeat("None");
    setRepeatDays([]);
  };

  return (
    <div className="container mt-4">
      <h2>📆 My Scheduler</h2>
      <p className="text-muted">Click on a date to add an event.</p>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        height="auto"
      />

      {/* Modal for Adding Event */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><b>Add Event</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><b>Event Title</b></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Morning Walk"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </Form.Group>

           <Form.Group className="mb-3">
              <Form.Check
                 type="switch"
                 id="full-day-switch"
                 label="Full Day Event"
                 checked={fullDay}
                 onChange={(e) => setFullDay(e.target.checked)}
              />
           </Form.Group>


            {!fullDay && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label><b>Start Time</b></Form.Label>
                  <Form.Control
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><b>End Time</b></Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label><b>Category</b></Form.Label>
              <Form.Select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
              >
                <option value="Fitness">Fitness</option>
                <option value="Study">Study</option>
                <option value="Meal">Meal</option>
                <option value="Relax">Relax</option>
                <option value="Travel">Travel</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><b>Repeat</b></Form.Label>
              <Form.Select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              >
                <option value="None">Do not repeat</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </Form.Select>
            </Form.Group>

            {repeat === "Weekly" && (
              <Form.Group className="mb-3">
                <Form.Label>Select Days</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <Form.Check
                        inline
                        key={day}
                        label={day}
                        type="checkbox"
                        checked={repeatDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setRepeatDays([...repeatDays, day]);
                          else
                            setRepeatDays(
                              repeatDays.filter((d) => d !== day)
                            );
                        }}
                      />
                    )
                  )}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label><b>Description</b></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add details..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Scheduler;



// import React, { useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { Modal, Button, Form } from "react-bootstrap";

// const Scheduler = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eventTitle, setEventTitle] = useState("");
//   const [eventTime, setEventTime] = useState("");
//   const [eventCategory, setEventCategory] = useState("Fitness");
//   const [events, setEvents] = useState([]);

//   // When a date is clicked on the calendar
//   const handleDateClick = (info) => {
//     setSelectedDate(info.dateStr);
//     setShowModal(true);
//   };

//   // Save the event
//   const handleSaveEvent = () => {
//     if (!eventTitle || !eventTime) {
//       alert("Please enter title and time");
//       return;
//     }

//     const newEvent = {
//       title: `${eventTitle} (${eventCategory})`,
//       date: selectedDate + "T" + eventTime,
//     };

//     setEvents([...events, newEvent]);
//     setShowModal(false);

//     // Reset form
//     setEventTitle("");
//     setEventTime("");
//     setEventCategory("Fitness");
//   };

//   return (
//     <div className="container mt-4">
//       <h2>My Scheduler</h2>
//       <p className="text-muted">Click on any date to add an event</p>

//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         dateClick={handleDateClick}
//         events={events}
//         height="auto"
//       />

//       {/* Modal for adding event */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Event</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Event Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="e.g., Morning Walk"
//                 value={eventTitle}
//                 onChange={(e) => setEventTitle(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Time</Form.Label>
//               <Form.Control
//                 type="time"
//                 value={eventTime}
//                 onChange={(e) => setEventTime(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Category</Form.Label>
//               <Form.Select
//                 value={eventCategory}
//                 onChange={(e) => setEventCategory(e.target.value)}
//               >
//                 <option value="Fitness">Fitness</option>
//                 <option value="Study">Study</option>
//                 <option value="Meal">Meal</option>
//                 <option value="Relax">Relax</option>
//                 <option value="Travel">Travel</option>
//               </Form.Select>
//             </Form.Group>
//           </Form>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSaveEvent}>
//             Save Event
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Scheduler;
