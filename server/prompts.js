const prompt_head = 
`
These are the preexisting events a user has in their calendar from Sunday to Saturday of this current week, formatted in JSON. There are four keys in each event: 
"start" and "end" for the start and end timestamp of the event in ISO 8601 format, "title" key for the summary of the event, and an optional "allDay" key to denote all-day events.
START OF EVENTS\n
`;

const prompt_tail =
`
\nEND OF EVENTS
Suggest 3 to 7 new events that this user can do during the week that does not overlap with these preexisting events to help the user combat depression.
If a preexisting event is marked as all-day, there cannot be any new events suggested on that day.
Your response should ONLY be a JSON array of events that contain the same keys: "start", "end", "title", and "allDay". If there is no space in the week for new events, return an empty array.
Return in plain text without \`\`\`json \`\`\`
`;

module.exports = {
    prompt_head,
    prompt_tail,
};