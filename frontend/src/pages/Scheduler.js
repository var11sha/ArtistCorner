import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form, Badge, Alert, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import "../css/scheduler.css";
import Swal from "sweetalert2";
import { createEvent, getUserEvents, updateEvent, deleteEvent } from "../api/eventApi";

const Scheduler = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
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
  const [allEvents, setAllEvents] = useState([]); // Store full event data
  const [editingEvent, setEditingEvent] = useState(null); // Event being edited
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [calendarView, setCalendarView] = useState("dayGridMonth"); // Current calendar view
  const calendarRef = React.useRef(null);
  const [customCategories, setCustomCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#9333ea");

  // Get user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    } else {
      // Redirect to login if no user
      window.location.href = "/login";
    }
    
    // Load custom categories from localStorage
    const savedCategories = localStorage.getItem("customCategories");
    if (savedCategories) {
      setCustomCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Fetch events from backend when component loads
  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchEvents();
    }
  }, [user]);

  // Function to generate recurring events
  const generateRecurringEvents = (event) => {
    const events = [];
    const startDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate events for the next 6 months
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);

    if (event.repeat === "None") {
      // Single event - only add if it's today or in the future
      if (startDate >= today) {
        events.push({
          id: event._id,
          title: event.title,
          date: event.date.split('T')[0],
          backgroundColor: getCategoryColor(event.category),
          borderColor: getCategoryColor(event.category),
          extendedProps: {
            category: event.category,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            fullDay: event.fullDay,
            originalEventId: event._id,
            repeat: event.repeat
          }
        });
      }
    } else if (event.repeat === "Daily") {
      // Daily - add event for each day from start date to end date
      let currentDate = new Date(startDate);
      while (currentDate <= endDate && currentDate >= today) {
        if (currentDate >= today) {
          events.push({
            id: `${event._id}-${currentDate.toISOString().split('T')[0]}`,
            title: event.title,
            date: currentDate.toISOString().split('T')[0],
            backgroundColor: getCategoryColor(event.category),
            borderColor: getCategoryColor(event.category),
            extendedProps: {
              category: event.category,
              startTime: event.startTime,
              endTime: event.endTime,
              description: event.description,
              fullDay: event.fullDay,
              originalEventId: event._id,
              repeat: event.repeat
            }
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (event.repeat === "Weekly") {
      // Weekly - add event on selected days of the week
      const dayMap = {
        "Mon": 1,
        "Tue": 2,
        "Wed": 3,
        "Thu": 4,
        "Fri": 5,
        "Sat": 6,
        "Sun": 0
      };

      if (event.repeatDays && event.repeatDays.length > 0) {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();
          const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayOfWeek);
          
          if (event.repeatDays.includes(dayName) && currentDate >= today) {
            events.push({
              id: `${event._id}-${currentDate.toISOString().split('T')[0]}`,
              title: event.title,
              date: currentDate.toISOString().split('T')[0],
              backgroundColor: getCategoryColor(event.category),
              borderColor: getCategoryColor(event.category),
              extendedProps: {
                category: event.category,
                startTime: event.startTime,
                endTime: event.endTime,
                description: event.description,
                fullDay: event.fullDay,
                originalEventId: event._id,
                repeat: event.repeat,
                repeatDays: event.repeatDays
              }
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // If no specific days selected, repeat on the same day of week as start date
        const startDayOfWeek = startDate.getDay();
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          if (currentDate.getDay() === startDayOfWeek && currentDate >= today) {
            events.push({
              id: `${event._id}-${currentDate.toISOString().split('T')[0]}`,
              title: event.title,
              date: currentDate.toISOString().split('T')[0],
              backgroundColor: getCategoryColor(event.category),
              borderColor: getCategoryColor(event.category),
              extendedProps: {
                category: event.category,
                startTime: event.startTime,
                endTime: event.endTime,
                description: event.description,
                fullDay: event.fullDay,
                originalEventId: event._id,
                repeat: event.repeat
              }
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    } else if (event.repeat === "Monthly") {
      // Monthly - add event on the same date each month
      let currentDate = new Date(startDate);
      while (currentDate <= endDate && currentDate >= today) {
        if (currentDate >= today) {
          events.push({
            id: `${event._id}-${currentDate.toISOString().split('T')[0]}`,
            title: event.title,
            date: currentDate.toISOString().split('T')[0],
            backgroundColor: getCategoryColor(event.category),
            borderColor: getCategoryColor(event.category),
            extendedProps: {
              category: event.category,
              startTime: event.startTime,
              endTime: event.endTime,
              description: event.description,
              fullDay: event.fullDay,
              originalEventId: event._id,
              repeat: event.repeat
            }
          });
        }
        // Move to same date next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return events;
  };

  const fetchEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userId = user._id || user.id;
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      const eventsData = await getUserEvents(userId);
      setAllEvents(eventsData);
      
      // Generate recurring events for calendar display
      let allCalendarEvents = [];
      eventsData.forEach(event => {
        const recurringEvents = generateRecurringEvents(event);
        allCalendarEvents = [...allCalendarEvents, ...recurringEvents];
      });
      
      setEvents(allCalendarEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch events. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get color for category
  const getCategoryColor = (category) => {
    const defaultColors = {
      "Fitness": "#dc3545", // red
      "Study": "#0d6efd",   // blue
      "Meal": "#198754",    // green
      "Relax": "#0dcaf0",   // cyan
      "Travel": "#ffc107"   // yellow
    };
    
    // Check if it's a custom category
    const customCategory = customCategories.find(cat => cat.name === category);
    if (customCategory) {
      return customCategory.color;
    }
    
    return defaultColors[category] || "#9333ea"; // Default purple
  };

  // Add custom category
  const handleAddCustomCategory = () => {
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Category Name Required",
        text: "Please enter a category name.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Check if category already exists
    const defaultCategories = ["Fitness", "Study", "Meal", "Relax", "Travel"];
    if (defaultCategories.includes(newCategoryName.trim()) || 
        customCategories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      Swal.fire({
        icon: "warning",
        title: "Category Exists",
        text: "This category already exists.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    const newCategory = {
      name: newCategoryName.trim(),
      color: newCategoryColor
    };

    const updatedCategories = [...customCategories, newCategory];
    setCustomCategories(updatedCategories);
    localStorage.setItem("customCategories", JSON.stringify(updatedCategories));
    
    Swal.fire({
      icon: "success",
      title: "Category Added!",
      text: `"${newCategoryName.trim()}" has been added to your categories.`,
      confirmButtonColor: "#198754",
    });

    setNewCategoryName("");
    setNewCategoryColor("#9333ea");
    setShowCategoryModal(false);
  };

  // Delete custom category
  const handleDeleteCustomCategory = (categoryName) => {
    Swal.fire({
      icon: "warning",
      title: "Delete Category?",
      text: `Are you sure you want to delete "${categoryName}"? Events using this category will keep it.`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCategories = customCategories.filter(cat => cat.name !== categoryName);
        setCustomCategories(updatedCategories);
        localStorage.setItem("customCategories", JSON.stringify(updatedCategories));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted.",
          confirmButtonColor: "#198754",
        });
      }
    });
  };

  // When a date is clicked
  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    clickedDate.setHours(0, 0, 0, 0);

    // Disable past dates
    if (clickedDate < today) {
      Swal.fire({
        icon: "warning",
        title: "Past Date",
        text: "You cannot add events to past dates.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    setSelectedDate(info.dateStr);
    setEditingEvent(null); // Reset editing state
    resetForm();
    setShowModal(true);
  };

  // When an event is clicked
  const handleEventClick = (info) => {
    const originalEventId = info.event.extendedProps.originalEventId || info.event.id;
    const event = allEvents.find(e => e._id === originalEventId);
    
    if (event) {
      setEditingEvent(event);
      setSelectedDate(event.date.split('T')[0]); // Extract date part
      setEventTitle(event.title);
      setEventTime(event.startTime || "");
      setEndTime(event.endTime || "");
      setEventCategory(event.category);
      setEventDescription(event.description || "");
      setFullDay(event.fullDay || false);
      setRepeat(event.repeat || "None");
      setRepeatDays(event.repeatDays || []);
      setShowModal(true);
    }
  };

  // Save or update event
  const handleSaveEvent = async () => {
    if (!eventTitle || (!eventTime && !fullDay)) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields Missing",
        text: "Please enter a title and set a time or mark as full-day.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User not found. Please login again.",
      });
      return;
    }
    
    const userId = user._id || user.id;
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID not found. Please login again.",
      });
      return;
    }

    const eventData = {
      userId: userId,
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
      if (editingEvent) {
        // Update existing event
        await updateEvent(editingEvent._id, eventData);
        Swal.fire({
          icon: "success",
          title: "Event Updated!",
          text: "Your event has been successfully updated.",
          confirmButtonColor: "#198754",
        });
      } else {
        // Create new event
        await createEvent(eventData);
        Swal.fire({
          icon: "success",
          title: "Event Added!",
          text: "Your event has been successfully saved.",
          confirmButtonColor: "#198754",
        });
      }

      setShowModal(false);
      resetForm();
      fetchEvents(); // Refresh events list
    } catch (error) {
      console.error("Error saving event:", error);
      const errorMessage = error.response?.data?.message || "Failed to save event. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!editingEvent) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Event?",
      text: `Are you sure you want to delete "${editingEvent.title}"? This will delete all recurring instances.`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(editingEvent._id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your event has been deleted.",
          confirmButtonColor: "#198754",
        });
        setShowModal(false);
        resetForm();
        fetchEvents(); // Refresh events list
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete event. Please try again.",
        });
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setEventTitle("");
    setEventTime("");
    setEndTime("");
    setEventCategory("Fitness");
    setEventDescription("");
    setFullDay(false);
    setRepeat("None");
    setRepeatDays([]);
    setEditingEvent(null);
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle calendar view change
  const handleViewChange = (view) => {
    if (view) {
      setCalendarView(view);
      // Change calendar view programmatically
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(view);
      }
    }
  };

  return (
    <div className="container mt-4">
      {/* Navigation Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>📆 My Scheduler</h2>
          <p className="text-muted">Click on a date to add an event. Click on an event to edit or delete it.</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate("/")}
          >
            🏠 Home
          </Button>
          <Button 
            variant="outline-success" 
            onClick={() => navigate("/playlist")}
          >
            🎵 Playlists
          </Button>
          <ThemeToggle />
          <Button 
            variant="primary" 
            onClick={() => {
              setSelectedDate(getTodayDate());
              setEditingEvent(null);
              resetForm();
              setShowModal(true);
            }}
          >
            ➕ Add New Event
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <div className="mb-3">
        <Nav variant="pills" activeKey={calendarView} onSelect={handleViewChange}>
          <Nav.Item>
            <Nav.Link eventKey="dayGridDay">
              📅 Day View
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="timeGridWeek">
              📆 Week View
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="dayGridMonth">
              🗓️ Month View
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {loading && (
        <Alert variant="info" className="mb-3">
          Loading events...
        </Alert>
      )}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarView}
        viewDidMount={(view) => {
          setCalendarView(view.view.type);
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        views={{
          dayGridDay: {
            type: 'dayGrid',
            duration: { days: 1 },
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
          },
          timeGridWeek: {
            type: 'timeGrid',
            duration: { weeks: 1 }
          },
          dayGridMonth: {
            type: 'dayGrid',
            duration: { months: 1 }
          }
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        height="auto"
        validRange={{
          start: getTodayDate() // Disable past dates
        }}
        dayCellClassNames={(arg) => {
          const cellDate = new Date(arg.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          cellDate.setHours(0, 0, 0, 0);
          
          if (cellDate < today) {
            return 'fc-day-past';
          }
          return '';
        }}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={true}
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short'
        }}
      />

      {/* Modal for Adding/Editing Event */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{editingEvent ? "Edit Event" : "Add Event"}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><b>Event Title *</b></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Morning Walk"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><b>Date *</b></Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(e) => {
                  const selected = new Date(e.target.value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  selected.setHours(0, 0, 0, 0);
                  
                  if (selected < today) {
                    Swal.fire({
                      icon: "warning",
                      title: "Past Date",
                      text: "You cannot select a past date.",
                      confirmButtonColor: "#0d6efd",
                    });
                    return;
                  }
                  setSelectedDate(e.target.value);
                }}
                required
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
                  <Form.Label><b>Start Time *</b></Form.Label>
                  <Form.Control
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required={!fullDay}
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0"><b>Category</b></Form.Label>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => setShowCategoryModal(true)}
                >
                  ➕ Add Custom Category
                </Button>
              </div>
              <Form.Select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
              >
                <optgroup label="Default Categories">
                  <option value="Fitness">Fitness</option>
                  <option value="Study">Study</option>
                  <option value="Meal">Meal</option>
                  <option value="Relax">Relax</option>
                  <option value="Travel">Travel</option>
                </optgroup>
                {customCategories.length > 0 && (
                  <optgroup label="Custom Categories">
                    {customCategories.map((cat, idx) => (
                      <option key={idx} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><b>Repeat</b></Form.Label>
              <Form.Select
                value={repeat}
                onChange={(e) => {
                  setRepeat(e.target.value);
                  if (e.target.value !== "Weekly") {
                    setRepeatDays([]);
                  }
                }}
              >
                <option value="None">Do not repeat</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </Form.Select>
              {repeat !== "None" && (
                <Form.Text className="text-muted">
                  {repeat === "Daily" && "This event will repeat every day."}
                  {repeat === "Weekly" && "Select specific days of the week below."}
                  {repeat === "Monthly" && "This event will repeat on the same date each month."}
                </Form.Text>
              )}
            </Form.Group>

            {repeat === "Weekly" && (
              <Form.Group className="mb-3">
                <Form.Label>Select Days *</Form.Label>
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
                {repeatDays.length === 0 && (
                  <Form.Text className="text-danger">
                    Please select at least one day for weekly repeat.
                  </Form.Text>
                )}
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

            {editingEvent && (
              <Alert variant="info" className="mt-3">
                <strong>Event ID:</strong> {editingEvent._id}
                <br />
                <strong>Created:</strong> {new Date(editingEvent.createdAt).toLocaleString()}
                <br />
                <strong>Repeat:</strong> {editingEvent.repeat}
                {editingEvent.repeat === "Weekly" && editingEvent.repeatDays && (
                  <>
                    <br />
                    <strong>Repeat Days:</strong> {editingEvent.repeatDays.join(", ")}
                  </>
                )}
              </Alert>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          {editingEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              🗑️ Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveEvent}
            disabled={repeat === "Weekly" && repeatDays.length === 0 && !editingEvent}
          >
            {editingEvent ? "Update Event" : "Save Event"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><b>Add Custom Category</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><b>Category Name *</b></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Work, Personal, Hobby"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><b>Color</b></Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  style={{ width: '80px', height: '40px' }}
                />
                <Form.Control
                  type="text"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  placeholder="#9333ea"
                  style={{ flex: 1 }}
                />
              </div>
            </Form.Group>
            {customCategories.length > 0 && (
              <div className="mt-4">
                <Form.Label><b>Your Custom Categories</b></Form.Label>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {customCategories.map((cat, idx) => (
                    <Badge
                      key={idx}
                      style={{
                        backgroundColor: cat.color,
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDeleteCustomCategory(cat.name)}
                      title="Click to delete"
                    >
                      {cat.name} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCustomCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Scheduler;
