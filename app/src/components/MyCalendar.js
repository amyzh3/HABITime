import moment from "moment";
import Calendar from "./Calendar";
import '../styles/calendar.css';

const events = [
  {
    start: moment("2025-04-26T10:00:00").toDate(),
    end: moment("2025-04-26T11:00:00").toDate(),
    title: "Eat",
    allDay: true,
  },
  {
    start: moment("2025-04-21T14:00:00").toDate(),
    end: moment("2025-04-21T15:30:00").toDate(),
    title: "NOM NOM",
  },
];

export default function MyCalendar() {
  return (
      <Calendar 
        style={{margin: "auto"}}
        events={events} 
        defaultView={"week"}
        views={["week"]}
        toolbar={false} /* "next day" "back" toolbar -- disabled */
      />
    )
}