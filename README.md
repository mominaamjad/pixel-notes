<p align="center">
  <p align="center">
  <img src="images/pixel-logo.png" alt="Logo" height="100"/>
</p>
</p>

<p align="center">
  Pixel-Perfect Note Management App 
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-3C873A?style=for-the-badge&logo=node.js&logoColor=white"/>
</p>

---

## About

**Pixel Notes** is a full-stack MERN application built to help users manage their notes in a minimal, and pixel-styled environment. It combines modern web development practices with a retro aesthetic to deliver a simple yet powerful note-taking experience. This project is fully modular, tested, and structured using Git best practices, developed as a requirement for the completion of 10pearls Shine Internship. 

## Features

- Create, edit, and delete notes  
- Organize by color and tags  
- Rich-text editing  
- Secure authentication with JWT  
- RESTful API backend  
- Search & filter functionality  
- Download notes in different formats  
- Pixel UI theme with smooth UX  

## Screenshots

- Sign up
<p align="center">
  <img src="/images/signup.png" alt="Signup Page" width="600"/>
</p>

- Login
<p align="center">
  <img src="/images/login.png" alt="Login Page" width="600"/>
</p>

- Home Screen
<p align="center">
  <img src="/images/homescreen.png" alt="Home Screen" width="600"/>
</p>

- Detailed View of Note
<p align="center">
  <img src="images/view-note.png" alt="View Note" width="600"/>
</p>

- User Profile Screen
<p align="center">
  <img src="/images/user-profile.png" alt="User Profile" width="600"/>
</p>

- Create a New Note
<p align="center">
  <img src="images/create-note.png" alt="Create Note" width="600"/>
</p>

- Filter By Color, Tag, Favorites
<p align="center">
  <img src="images/note-filters.png" alt="Note Filters" width="600"/>
</p>

---

## Technology

| Layer       | Tech                  |
|-------------|-----------------------|
| Frontend    | React + Vite          |
| Backend     | Node.js + Express     |
| Database    | MongoDB + Mongoose    |
| Auth        | JWT                   |
| Testing     | Mocha + Chai + Vitest |
| Logging     | Pino Logger           |


## Installation

- Clone the repo
```
git clone https://github.com/mominaamjad/pixel-notes.git
cd pixel-notes
```

- Set up Env Files
```
copy /.example.env.local to .env.local (only required for sonar qube)
copy /backend/.example.env to .env
copy /backend/.example.env.test to .env.test (only required to run backend test cases)
```

- Run Backend
```
cd backend
npm install
npm run dev
```

- Run Frontend
```
cd ../frontend
npm install
npm run dev
```

<p align="center"> © 2025 Momina Amjad. All rights reserved. </p>
