### **Inspiration**  
The idea behind **Snake Fight** was to take the classic **retro snake game** and transform it into an **online multiplayer experience** where players could compete against each other in real-time. I wanted to challenge myself by integrating **real-time data synchronization** while also improving my skills in **backend development and game networking**. Since I was already familiar with JavaScript for front-end development, I decided to use **Firebase** for backend services, enabling **smooth multiplayer interactions** without the need for a dedicated game server.  

### **What it does**  
**Snake Fight** is a **multiplayer online snake game** where players control their own snakes while competing against an opponent. Apples spawn randomly across the game board, and every time a snake consumes one, it grows in size. The game continues until a snake **collides with itself or the opponent**, at which point the other player wins. Real-time **synchronization ensures** that both players see the same game state, making for a fair and competitive experience.  

### **How I built it**  
The game was built using **pure HTML, CSS, and JavaScript** for the front-end, creating an interactive and visually engaging interface. For the backend, I used **Firebase**, which handled:  
- **Real-time database synchronization**, ensuring smooth player movement updates.  
- **User authentication**, allowing players to join and challenge their friends.  

I structured the game loop around **event-driven updates**, meaning the game state updates dynamically based on player actions. The **Scrum methodology** was used throughout development, with **sprints** that helped break the project into manageable tasks, ensuring iterative improvements and timely milestone completion.  

### **Challenges I ran into**  
One of the biggest challenges was ensuring **real-time synchronization** between two players while maintaining a **smooth and responsive experience**. Network latency had to be carefully managed so that movement updates were received **without noticeable delay**. Another challenge was **collision detection**, as it had to be handled server-side to prevent cheating. Additionally, implementing **Firebase authentication** required careful security considerations to prevent unauthorized access to game rooms.  

### **Accomplishments that I'm proud of**  
I’m proud that I successfully **implemented real-time multiplayer functionality** without relying on external game engines. This was my first **fully online multiplayer game**, making it a significant achievement in my programming journey. Additionally, the use of **Scrum for task management** helped streamline the development process, allowing me to **meet all project milestones on time**. Seeing the game run **smoothly with real-time interactions** was incredibly rewarding.  

### **What I Learned**  
This project deepened my understanding of **real-time databases**, **asynchronous programming**, and **game networking**. I learned how to manage **server-client interactions** effectively and gained hands-on experience in **Firebase authentication and security rules**. Additionally, working within a **Scrum framework** taught me how to **plan sprints, manage tasks efficiently, and iterate based on testing and feedback**.  

### **What’s Next for Snake Fight**  
There are several features I would like to add in the future:  
- **More game modes**, such as team-based battles or power-ups that change gameplay.  
- **Improved matchmaking**, allowing players to **find opponents automatically** instead of manually inviting friends.  
- **Leaderboard system**, where players can track their rankings and compete for high scores.  
- **Mobile optimization**, ensuring a seamless experience for players on touchscreen devices.  

Expanding **Snake Fight** into a more competitive multiplayer game with additional features would be an exciting challenge, and I look forward to further refining it in the future!
<br>
![MultiplayerSnakeVideo](https://github.com/user-attachments/assets/a698b938-e2ca-4050-999d-41147909c16b)
