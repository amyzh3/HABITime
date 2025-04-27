import "../styles/dashboard.css";
import { LiaSyncAltSolid } from "react-icons/lia";
import { IoIosJournal } from "react-icons/io";
import MyCalendar from "./MyCalendar";
import minion from "../assets/minion.jpg";
import { BiSolidEdit } from "react-icons/bi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [resyncClicked, setResyncClicked] = useState(false); // for jiggle animation
  const [journalClicked, setJournalClicked] = useState(false); // for jiggle animation
  const [editClicked, setEditClicked] = useState(false); // for jiggle animation
  const [events, setEvents] = useState([]); // for calendar events
  const [concerns, setConcerns] = useState([]); // for user concerns
  const [habits, setHabits] = useState([]); // for user habits
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");

  const navigate = useNavigate();


  const handleResyncClick = async () => {
    setResyncClicked(true);
    setTimeout(() => setResyncClicked(false), 500);
    
    try {
      const uid = localStorage.getItem("uid");
      const response = await axios.post('http://localhost:8080/update-cal', { uid });
      console.log('Calendar data resynced successfully & changes stored in database:', response.data);

    } catch (error) {
      console.error("Error during resync:", error);
    }
  };

  const handleJournalClick = () => {
    setJournalClicked(true);
    setTimeout(() => setJournalClicked(false), 500);
  };

  const handleEditClick = () => {
    setEditClicked(true);
    setTimeout(() => setEditClicked(false), 500);
    navigate("/edit");
  };

  const colorMap = {
    "Depression": "#F7D6E0",
    "Anxiety": "#D6EAF8",
    "Chronic Fatigue": "#E8DAEF",
    "Bad Posture": "#FCF3CF",
    "Back Pain": "#D1F2EB",
    "Constipation": "#F9E79F",
    "Vitamin D Deficiency": "#FADBD8",
    
    "Healthy Eating": "#D5F5E3",
    "Journaling": "#E8DAEF",
    "Regular Exercise": "#D6EAF8",
    "Limited Screen Time": "#FCF3CF",
    "Reading": "#FADBD8",
    "Sleep 8 Hours": "#D1F2EB",
  };

  const userConcerns = ["Depression", "Back Pain", "Anxiety",];

  const userHabits = ["Regular Exercise", "Healthy Eating", "Reading"];

  const userCalendarEvents = [
    {
      start: new Date("2025-04-21T12:30:00"),
      end: new Date("2025-04-21T13:50:00"),
      title: "CSCI 353",
      allDay: false,
    },
    {
      start: new Date("2025-04-21T14:00:00"),
      end: new Date("2025-04-21T15:50:00"),
      title: "ITP 435: Professional C++ (Lecture)",
      allDay: false,
    },
    {
      start: new Date("2025-04-22T09:30:00"),
      end: new Date("2025-04-22T11:30:00"),
      title: "Work (library)",
      allDay: false,
    },
    {
      start: new Date("2025-04-22T12:30:00"),
      end: new Date("2025-04-22T13:50:00"),
      title: "WRIT 340: Advanced Writing",
      allDay: false,
    },
    {
      start: new Date("2025-04-22T14:00:00"),
      end: new Date("2025-04-22T15:30:00"),
      title: "OH (Office Hours)",
      allDay: false,
    },
    {
      start: new Date("2025-04-23T09:30:00"),
      end: new Date("2025-04-23T12:00:00"),
      title: "Work (library)",
      allDay: false,
    },
    {
      start: new Date("2025-04-23T12:30:00"),
      end: new Date("2025-04-23T13:50:00"),
      title: "CSCI 353",
      allDay: false,
    },
    {
      start: new Date("2025-04-23T14:00:00"),
      end: new Date("2025-04-23T15:50:00"),
      title: "ITP 435: Professional C++ (Lecture)",
      allDay: false,
    },
    {
      start: new Date("2025-04-23T16:00:00"),
      end: new Date("2025-04-23T17:00:00"),
      title: "OH (Office Hours)",
      allDay: false,
    },
    {
      start: new Date("2025-04-24T11:30:00"),
      end: new Date("2025-04-24T12:30:00"),
      title: "OH (Office Hours)",
      allDay: false,
    },
    {
      start: new Date("2025-04-24T12:30:00"),
      end: new Date("2025-04-24T13:50:00"),
      title: "WRIT 340: Advanced Writing",
      allDay: false,
    },
    {
      start: new Date("2025-04-24T14:00:00"),
      end: new Date("2025-04-24T15:30:00"),
      title: "OH (Office Hours)",
      allDay: false,
    },
    {
      start: new Date("2025-04-24T16:00:00"),
      end: new Date("2025-04-24T17:00:00"),
      title: "OH (Office Hours)",
      allDay: false,
    },
    {
      start: new Date("2025-04-25T09:00:00"),
      end: new Date("2025-04-25T10:50:00"),
      title: "PHED 148A: Archery (Lecture)",
      allDay: false,
    },
    {
      start: new Date("2025-04-25T12:30:00"),
      end: new Date("2025-04-25T13:50:00"),
      title: "CSCI 353: Introduction",
      allDay: false,
    },
    {
      start: new Date("2025-04-25T15:00:00"),
      end: new Date("2025-04-25T16:00:00"),
      title: "CSCI 467: Introduction",
      allDay: false,
    }
  ];

  const wellnessEvents = [
    {
      start: new Date("2025-04-21T07:30:00"),
      end: new Date("2025-04-21T08:00:00"),
      title: "Morning Stretch",
      concern: "Back Pain",
      allDay: false,
    },
    {
      start: new Date("2025-04-21T18:30:00"),
      end: new Date("2025-04-21T19:00:00"),
      title: "Evening Walk",
      concern: "Regular Exercise",
      allDay: false,
    },
    {
      start: new Date("2025-04-22T07:30:00"),
      end: new Date("2025-04-22T08:00:00"),
      title: "Meditation",
      concern: "Anxiety",
      allDay: false,
    },
    {
      start: new Date("2025-04-22T18:30:00"),
      end: new Date("2025-04-22T19:30:00"),
      title: "Healthy Dinner & Unplug",
      habit: "Healthy Eating",
      allDay: false,
    },
    {
      start: new Date("2025-04-23T07:00:00"),
      end: new Date("2025-04-23T07:30:00"),
      title: "Gratitude Journal",
      concern: "Depression",
      allDay: false,
    },
    {
      start: new Date("2025-04-23T19:00:00"),
      end: new Date("2025-04-23T20:00:00"),
      title: "Read 30 Minutes",
      habit: "Reading",
      allDay: false,
    },
    {
      start: new Date("2025-04-25T19:30:00"),
      end: new Date("2025-04-25T20:00:00"),
      title: "Prepare for Sleep (No Screens)",
      concern: "Anxiety",
      allDay: false,
    },
  ];
  
  const fetchData = async () => {
    try {
      setConcerns(userConcerns.map(concern => ({concern, color: colorMap[concern]})));
      setHabits(userHabits.map(habit => ({habit, color: colorMap[habit]})));
      setEvents([...userCalendarEvents, ...wellnessEvents].map(event => ({
        ...event,
        color: event.concern ? colorMap[event.concern] : event.habit ? colorMap[event.habit] : "#A7A7A7"
      })));
      const currentDate = new Date();
      const monthString = currentDate.toLocaleString('default', { month: 'long' });
      const year = currentDate.getFullYear();
      setMonth(`${monthString} ${year}`);
      console.log("concerns", concerns)
      console.log("habits", habits)
      console.log("events",events)
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

    }

  }
  
  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="month-header">{month}</h1>
          <button className="resync-button" onClick={handleResyncClick}>
            <LiaSyncAltSolid size={24} color="#53413E" className={resyncClicked ? "icon-clicked" : ""}/> {/* resync button */}
          </button>
        </div>
        <div className="header-right">
          <button className="journal-button" onClick={handleJournalClick}>
            <IoIosJournal size={24} color="#53413E" className={journalClicked ? "icon-clicked" : ""}/>
          </button>
          <img
            className="pfp-img"
            src={localStorage.getItem("profile-imgURL") || minion}
            alt="profile picture"
          />
        </div>
      </div>
      <div className="dashboard-body">
        <div className="sidebar">
          <p className="concerns-header">My concerns:</p>
          <div className="concerns-container">
            {concerns.map((concern, index) => (
              <div key={index} className="concern-item" style={{ backgroundColor: concern.color }}>
                {concern.concern}
              </div>
            ))}
          </div>
          <p className="habits-header">My habits:</p>
          <div className="habits-container">
            {habits.map((habit, index) => (
              <div key={index} className="habit-item" style={{ backgroundColor: habit.color }}>
                {habit.habit}
              </div>
            ))}
          </div>
          <button className={`edit-button`} onClick={handleEditClick}>
            <BiSolidEdit size={14} style={{marginRight: "7px"}} className={editClicked ? "icon-clicked" : ""}/>
            Edit
          </button>
        </div>
        <div className="cal-container">
          {
            loading ? (<div>Loading...</div>) 
            : (
              <MyCalendar events={events}/>
            )
          }
        </div>
      </div>
    </div>
  )
}