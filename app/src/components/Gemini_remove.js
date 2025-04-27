"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  
  const ai = new GoogleGenAI({ apiKey: "API_KEY" });

  const prompt = 
  `
  These are the preexisting events a user has in their calendar from Sunday to Saturday of this current week, formatted in JSON.
  There are four keys in each event: 
  "start" and "end" for the start and end timestamp of the event in ISO 8601 format, 
  "title" key for the title of the event, 
  and an optional "allDay" key to denote all-day events.
  START OF EVENTS
  {
    start: "2025-04-26T10:00:00",
    end: "2025-04-26T11:00:00",
    title: "Eat",
    allDay: true,
  }
  {
    start: "2025-04-21T14:00:00",
    end: "2025-04-21T15:30:00",
    title: "NOM NOM",
    allDay: true,
  }
  {
    start: "2025-04-20T14:00:00",
    end: "2025-04-21T15:30:00",
    title: "NOM NOM",
    allDay: true
  }
  {
    start: "2025-04-22T14:00:00",
    end: "2025-04-21T15:30:00",
    title: "NOM NOM",
    allDay: true
  }
  {
    start: "2025-04-23T14:00:00",
    end: "2025-04-21T15:30:00",
    title: "NOM NOM",
    allDay: true
  }
  {
    start: "2025-04-24T14:00:00",
    end: "2025-04-21T15:30:00",
    title: "NOM NOM",
    allDay: true
  }
  END OF EVENTS
  Suggest 3 to 7 new events that this user can do during the week that does not overlap with these preexisting events to help the user combat depression.
  If a preexisting event is marked as all-day, there cannot be any new events suggested on that day.
  Your response should ONLY be a JSON array of events that contain the same keys: "start", "end", "title", and "allDay". If there is no space in the week for new events, return an empty array.
  `;

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-pro-exp-03-25",
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        setResponse(text);
    } catch (error) {
        console.error(error);
        setResponse("Error contacting Gemini");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Ask Gemini</h1>
      <button onClick={handleSubmit} style={{ fontSize: "1.2rem", padding: "0.5rem 1rem" }}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      <div style={{ marginTop: "2rem", maxWidth: "600px", textAlign: "center" }}>
        {response && <p>{response}</p>}
      </div>
    </div>
  );
}
