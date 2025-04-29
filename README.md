# HABITime - LA Hacks 2025
Yoonseo Choi, Andy Kim, Ellie Xing, Amy Zhang

[Demo Video](https://youtu.be/8WiwDtg693s)

## 💡 Inspiration
What time is it? **HABITime**! (whoo)

It turns out wanting to be a healthy, well-rested, anxiety-free human doesn’t magically clear space in your calendar. Let’s be real – we’ve all had times when we wanted to eat healthier, exercise more, or manage anxiety better – but with busy schedules, it always feels like there just isn’t enough time or structure to make real changes. We realized that the problem wasn’t motivation, it was integration. We created **HABITime** to help people like us weave healthy habits and self-care directly into their everyday lives, making wellness feel natural, achievable, and sustainable.

## 📅 What it does 
**HABITime** analyzes your weekly schedule and suggests personalized recommendations for activities throughout the week to target specific concerns and encourage healthy habits. 

**What does that mean?**  
🧙🏻‍♀️ Unique recommendations based on your personal needs and goals  
👀 View your week at a glance  
📈 Track historic trends in mood  

These activities are specifically catered to your schedule so as to not interfere with your pre-existing plans. Our hope is that this encourages you to commit to these suggestions!

## 🛠️ How we built it 
The app starts with a seamless login + authentication process, after which the user is asked some introductory questions along with information regarding potential lifestyle concerns as well as habits they would like to maintain.
On completion of this process, the user’s Google Calendar is automatically parsed and used to generate appropriate activity recommendations.

We built **HABITime** with a **full-stack JavaScript approach**, including:
- Front-end: *React-js* for a dynamic and responsive calendar interface
- Back-end: *Node.js* and *Express.js* to process various API requests (Gemini, Google Calendar) and user authentication
- Database: *Firebase* as a NoSQL solution for storing user schedules as well as event recommendations
- Design & Prototyping: *Figma* for wireframing and devising an intuitive, simple user interface

## 🚧 Challenges we ran into 
Our biggest challenge was navigating the world of authentication and permissions, especially with Firebase and OAuth 2.0. As calendar information is handled as sensitive user data, Google required extra precautions when it comes to API access, which came with a learning curve. Ultimately, this meant that we had to implement an extra layer of authentication to gain permissions for the data we needed.

However, we realized that this was actually an asset; by being granular with the access permissions that we requested, we were able to ensure that user data could be stored securely and safely, independent of other user information.

## 🌟 Accomplishments!
We built a working MVP that pulls from real calendars and gives personalized wellness recommendations. We made it super easy for users to pick what habits they want to build and what concerns they want to tackle. **HABITime** can handle messy, busy schedules without falling apart, and the app feels simple, clean, and actually doable — no 5AM marathons required. Most of all, we proved that even the busiest people can fit a little more self-care into their week.  
We also love our mascot, Habi the Bear <3 🐻🍎

## 📝 What we learned 
👩🏻‍🔧 The ins and outs of Firebase – Amy  
🕵🏻‍♀️ Integrating external front-end libraries in React – Yoonseo  
👩🏻‍💻 Improving integration between front- and back-end – Ellie  
🧙🏼‍♂️ Hackathoning! – Andy

## 🤠 What's next for HABITime?
- **More Calendars**  
We hope to improve compatibility with iCal, Outlook Calendar, and other popular calendar services, as well as auto-syncing event suggestions across platforms
- **More Friends!**  
The service can be more fun for users by adding friends and allowing for shared activities, a leaderboard, and a system for mutual accountability.
- **Maps!**  
Our suggestions can be even smarter by considering the location of existing events. This will require integration with Google Maps.


