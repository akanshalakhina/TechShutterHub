# 📸 Tech Shutter Hub

> **Premium Immersive 3D Visual Production & Photography Portfolio Platform**

Tech Shutter Hub is a modern, high-performance web platform designed for photography, videography, and creative media productions. Featuring an interactive 3D camera showcase, high-resolution media gallery, client booking inquiry engine, and a complete administrative CMS.

---

## ✨ Features

- **🌐 Immersive 3D Experience**: Interactive 3D graphics and responsive camera controls powered by Three.js.
- **🎨 Curated Portfolio & Media Gallery**: Dynamic category filtering, search, and full-resolution lightbox viewer.
- **📩 Client Inquiry & Booking Engine**: Seamless quote requests and project booking with backend validation.
- **🛠️ Admin CMS Portal**: Built-in dashboard (`/admin.html`) for creating, updating, and managing projects and inquiries.
- **🌓 Dynamic Theme Support**: High-contrast dark and light themes with sound effects.
- **⚡ Fast RESTful API**: Lightweight Express.js backend handling JSON-backed data storage.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- `npm` (bundled with Node.js)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/akanshalakhina/TechShutterHub.git
cd TechShutterHub
npm install
```

### 3. Running the Server
Start the development server:
```bash
npm start
```
*(or run directly via Node)*
```bash
node server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
TechShutterHub/
├── data/
│   ├── inquiries.json        # Stored client inquiries & quotes
│   └── projects.json         # Portfolio projects database
├── public/
│   ├── assets/
│   │   ├── images/           # Showcase photographs & media assets
│   │   └── logos/            # Brand logos & graphics
│   ├── css/
│   │   ├── gallery.css       # Gallery & grid styles
│   │   ├── style.css         # Main application stylesheet
│   │   └── theme.css         # Light / dark theme styling
│   ├── js/
│   │   ├── app3d.js          # Three.js 3D viewport & interactions
│   │   ├── audio.js          # Sound effects & audio manager
│   │   ├── inquire.js        # Booking & inquiry modal handler
│   │   ├── lightbox.js       # Media modal & fullscreen viewer
│   │   └── theme.js          # Theme persistence & toggling
│   ├── admin.html            # Admin management dashboard
│   ├── gallery.html          # Full portfolio gallery page
│   └── index.html            # Main landing page
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Express server & API routes
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all portfolio projects (supports `?category=` and `?search=`) |
| `GET` | `/api/projects/:id` | Fetch details for a specific project |
| `POST` | `/api/projects` | Add a new project |
| `PUT` | `/api/projects/:id` | Update an existing project |
| `DELETE` | `/api/projects/:id` | Delete a project |
| `POST` | `/api/inquire` | Submit a client inquiry / booking request |
| `GET` | `/api/inquiries` | Retrieve all inquiries (Admin) |
| `GET` | `/api/stats` | Retrieve platform statistics |

---

## 📄 License
ISC © Tech Shutter Hub
