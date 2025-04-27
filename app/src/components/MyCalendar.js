import Calendar from "./Calendar";
import '../styles/calendar.css';


export default function MyCalendar({events}) {
  return (
      <Calendar 
        events={events} 
        defaultView={"week"}
        views={["week"]}
        className="calendar"
        toolbar={false} /* "next day" "back" toolbar -- disabled */
        eventPropGetter={(event) => {
          const backgroundColor = event.color;
          return {
            style: {
              backgroundColor,
              borderRadius: "5px",
              opacity: 0.8,
              border: "0px",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#3B2E2C"
            },
          };
        }}
      />
    )
}