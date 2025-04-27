import "../styles/dashboard.css";
import { LiaSyncAltSolid } from "react-icons/lia";
import { IoIosJournal } from "react-icons/io";
import MyCalendar from "./MyCalendar";
import minion from "../assets/minion.jpg";
import { BiSolidEdit } from "react-icons/bi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbCircleDotted } from "react-icons/tb";
import { TbMoodHappy, TbMoodSmile, TbMoodNeutral, TbMoodSad, TbMoodCry } from "react-icons/tb";

export default function Dashboard() {
  const [resyncClicked, setResyncClicked] = useState(false); // for jiggle animation
  const [journalClicked, setJournalClicked] = useState(false); // for jiggle animation
  const [editClicked, setEditClicked] = useState(false); // for jiggle animation
  const [events, setEvents] = useState([]); // for calendar events
  const [concerns, setConcerns] = useState([]); // for user concerns
  const [habits, setHabits] = useState([]); // for user habits
  const [month, setMonth] = useState("");
  const [moodData, setMoodData] = useState(null); // user's mood data to render
  const [todayMoodIndex, setTodayMoodIndex] = useState(0); // what mood we feel today
  const [profileImgUrl, setprofileImgUrl] = useState(localStorage.getItem('profile-imgURL'));

  const [dataReady, setDataReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();

  const moodIconMap = {
    "1": <TbMoodHappy size={38} />,   // very happy
    "2": <TbMoodSmile size={38} />,   // happy
    "3": <TbMoodNeutral size={38} />, // neutral
    "4": <TbMoodSad size={38} />,     // sad
    "5": <TbMoodCry size={38} />,     // very sad
    "": <TbCircleDotted size={38} />  // blank (no entry)
  };

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
    setShowOverlay(true);
  };

  // const userMoodData = [
  //   {
  //     "4/6-4/12": ["1", "2", "1", "4", "5", "1", "3"]
  //   },
  //   {
  //     "4/13-4/19" : ["2", "1", "4", "2", "4", "3", "1"]
  //   },
  //   {
  //     "4/20-4/26" : ["5", "5", "5", "5", "5", "1", "4"]
  //   },
  //   {
  //     "4/27-5/3" : ["", "", "", "", "", "", ""]
  //   }
  // ]

  const cycleMoods = ["", "1", "2", "3", "4", "5"];

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
        console.log("User data fetched successfully:", userData);

        const formattedEvents = [...userData.calEvents, ...userData.recommendations].map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          color: event.concern ? colorMap[event.concern] : event.habit ? colorMap[event.habit] : "#A7A7A7",
          allDay: event.allDay || false,
          title: event.title || "Untitled Event"
        }));

        // Fetch mood data
        const sortedMoodData = Object.fromEntries(
          Object.entries(userData.moodData)
            .sort(([a], [b]) => {
              const getStartDate = (range) => {
                const [start] = range.split("-");
                const [month, day] = start.split("/").map(Number);
                return new Date(2024, month - 1, day); // adjust year if needed
              };
              return getStartDate(a) - getStartDate(b);
            })
        );
        setMoodData(sortedMoodData);
        console.log("Mood data fetched successfully:", userData.moodData);
        if (userData.moodData) {
          const today = new Date();
          const month = today.getMonth() + 1; // JS months are 0-based
          const day = today.getDate();
        
          for (const [weekRange, moods] of Object.entries(userData.moodData)) {
            const [startStr, endStr] = weekRange.split("-");
            const [startMonth, startDay] = startStr.split("/").map(Number);
            const startDate = new Date(today.getFullYear(), startMonth - 1, startDay);
            const endDate = new Date(today.getFullYear(), startMonth - 1, startDay + 6); // 7 days
        
            if (today >= startDate && today <= endDate) {
              const dayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)); // how many days since start
              const moodToday = moods[dayIndex];
        
              const moodIdx = cycleMoods.indexOf(moodToday || ""); // find in ["", "1", "2", "3", "4", "5"]
              if (moodIdx !== -1) {
                setTodayMoodIndex(moodIdx);
              }
              break;
            }
          }
        }

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
      {showOverlay && (
        <div className="overlay-background" onClick={() => setShowOverlay(false)}>
        <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
          <h2 style={{color: "#53413E"}}>At a glance...</h2>      
          <div className="week-summary">
            {moodData ? (
              Object.entries(moodData).map(([week, emojis], index) => {
                console.log(moodData);
                if (!Array.isArray(emojis)) {
                  console.log('emojis: ', emojis);
                  emojis = [];
                }
                const today = new Date();
                const thisMonth = today.getMonth(); // 0=January, 3=April, etc
                if(emojis.length < 7){
                  emojis = [...emojis, ...Array(7 - emojis.length).fill("")];
                }

                const [startStr, endStr] = week.split("-");
                const [startMonth, startDay] = startStr.split("/").map(Number);
                const startDate = new Date(today.getFullYear(), startMonth - 1, startDay);
                const endDate = new Date(today.getFullYear(), startMonth - 1, startDay + 6); // 7 days later
              
                const isThisWeek = today >= startDate && today <= endDate;
                const isThisMonth = startDate.getMonth() === thisMonth;
                const todayIndex = (isThisWeek && isThisMonth) ? Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) : -1;
              
                return (
                  <div key={index}>
                    <p style={{color: "#53413E"}}>{week}</p>
                    <div className="emoji-row">
                      {emojis.map((emoji, idx) => (
                        <span
                          key={idx}
                          className={idx === todayIndex ? "today-emoji" : ""}
                          style={{
                            color: idx === todayIndex ? "#83935C" : "#53413E",
                            cursor: idx === todayIndex ? "pointer" : "default",
                          }}
                          onClick={async() => {
                            if (idx === todayIndex) {
                              setTodayMoodIndex((prev) => (prev + 1) % cycleMoods.length);

                              const uid = localStorage.getItem('uid');
                              console.log('uid', uid);

                              let newMood;
                              if(todayMoodIndex === "0"){
                                newMood = "";
                              }else{
                                newMood = String(todayMoodIndex + 1);
                              }

                              console.log('newMood', newMood);
                          
                              try {
                                const response = await axios.post('http://localhost:8080/log-mood', {
                                  uid: uid,
                                  mood: newMood,
                                },  
                              );
                                if(response.status == 200) {
                                  console.log('Mood logged successfully: ', newMood);
                                } else {
                                  console.log('Error logging mood: ', newMood);
                                }
                              } catch (error) {
                                console.error('Error logging mood:', error);
                              }
                            }
                          }}
                        >
                          {idx === todayIndex
                            ? (moodIconMap[cycleMoods[todayMoodIndex]] || <TbCircleDotted size={38} />)
                            : (moodIconMap[emoji] || <TbCircleDotted size={38} />)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>Loading moods...</div>
            )}
          </div>  
        </div>
        </div>    
      )}
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
            src={(console.log('ProfileImgUrl:', profileImgUrl), profileImgUrl || minion)}
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