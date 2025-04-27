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
  const [month, setMonth] = useState("");

  const [dataReady, setDataReady] = useState(false);

  const navigate = useNavigate();

  const handleResyncClick = async () => {
    setResyncClicked(true);
    setTimeout(() => setResyncClicked(false), 500);
    
    try {
      console.log('resyncing calendar!');
      setDataReady(false);
      const uid = localStorage.getItem("uid");
      const response = await axios.post('http://localhost:8080/update-cal', { uid });
      console.log('Calendar data resynced successfully & changes stored in database:', response.data);
      if(response.status == 200){
        await fetchData(uid);
        console.log('called fetch data');
      }
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
    navigate("/edit", {
      state: {
        concerns: concerns.map(c => c.concern), // Pass just the strings
        habits: habits.map(h => h.habit)        // Pass just the strings
      }
    });
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

  const fetchData = async (uid) => {
    try {
      setDataReady(false);
      // Fetch user data from backend
      const response = await axios.get('http://localhost:8080/getuserinfo', {
        params: { uid }, // Pass the UID as a query parameter
      });

      if (response.data && response.data.data) {
        const userData = response.data.data;

        const formattedEvents = [...userData.calEvents, ...userData.recommendations].map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          color: event.concern ? colorMap[event.concern] : event.habit ? colorMap[event.habit] : "#A7A7A7",
          allDay: event.allDay || false,
          title: event.title || "Untitled Event"
        }));

        console.log(formattedEvents);
        setEvents(formattedEvents);

        setConcerns(userData.concerns.map(concern => ({ concern, color: colorMap[concern] })));
        setHabits(userData.habits.map(habit => ({ habit, color: colorMap[habit] })));

        const currentDate = new Date();
        const monthString = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        setMonth(`${monthString} ${year}`);
        setDataReady(true);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    const uid = localStorage.getItem('uid'); // Get UID from localStorage
    if (uid) {
      fetchData(uid); // Fetch user data if UID is found
      console.log('fetch data done', events);
    } else {
      console.error("UID not found in localStorage");
      // You might want to redirect to login if UID is missing
    }
  }, []);

  useEffect(() => {
    console.log("events updated:", events);
  }, [events]);

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
            !dataReady ? (<div>Loading...</div>)
            : (
              <MyCalendar events={events}/>
            )
          }
        </div>
      </div>
    </div>
  )
}