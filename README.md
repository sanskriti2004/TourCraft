
# Interactive Product Tour Platform

A full-stack product demo platform, this project demonstrates the my ability to design, develop and deploy a modern web application that enables users to create and share interactive product walkthroughs.

---

## Video

[https://drive.google.com/file/d/1AbniAy35AqCChKOoZVaaQsEE0jzfGxF8/view?usp=sharing](https://drive.google.com/file/d/1AbniAy35AqCChKOoZVaaQsEE0jzfGxF8/view?usp=sharing)

---

## Objective

Design and implement a web application where users can:

* Sign up, log in and manage sessions securely
* Create interactive product tours with screenshots and descriptions
* Record workflows with an in-browser screen recorder
* Edit and reorder steps via a visual editor
* Set tours with public/private visibility
* View dashboards with mock analytics

---

## Core Features

### Frontend

* **Landing Page** with call-to-action
* **Authentication** – Sign up / Login with validation
* **Tour Editor**

  * Upload images/screenshots
  * Add/edit/delete steps with description
  * Record screen using browser media APIs
  * Drag-and-drop to reorder steps
* **Preview Mode** to preview the product tour
* **Dashboard** to view and manage all created tours
* **Mock analytics dashboard** (views & clicks)
* **Responsive UI** with modern design and animations (Framer Motion)

### Backend

* RESTful API built with Express.js
* JWT-based authentication
* Full CRUD for tours
* Persistent user/tour data using MongoDB

---

## Tech Stack

### Frontend

* **Framework**: React.js
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **Routing**: React Router

### Backend

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (via Mongoose)
* **Authentication**: JSON Web Tokens (JWT)

---

## Bonus Features

* Shareable public demo links
* Mocked analytics (views, clicks)
* Drag-and-drop reordering of steps
* Dark/light mode toggle

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sanskriti2004/TourCraft.git
cd TourCraft
```

### 2. Install dependencies

```bash
# Install server dependencies
cd backend
npm install

# Install client dependencies
cd frontend
npm install
```

### 3. Start development servers

```bash
# Start backend
cd backend
npm start

# Start frontend
cd frontend
npm start
```

---

## Deployment Links

* **Frontend**: [https://tour-craft-frontend.vercel.app/](https://tour-craft-frontend.vercel.app/)
* **Backend**: [https://tour-craft-backend.vercel.app/](https://tour-craft-backend.vercel.app/)

---
