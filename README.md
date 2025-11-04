# ExoSite

**ExoSite** is a full-stack web application currently featuring a React-based frontend and a planned Express.js backend. The goal of this project is to serve as an interactive platform for managing and monitoring exoskeleton systems, with real-time data visualization and control capabilities.

🌐 Hosted at: https://exoskeletonsite.netlify.app/

---

## 📁 Project Structure

```
ExoSite/
│
├── Frontend/              # React.js frontend
│   ├── public/             # Static files
│   ├── src/                # Main React source code
│   ├── package.json        # Frontend dependencies
│   └── .gitignore          # Frontend gitignore rules
│
├── Backend/               # Placeholder for Express.js backend
│
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v16+ recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## 🧩 Frontend Setup (React)

1. Navigate to the frontend directory:

   ```bash
   cd Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and go to:

   ```
   http://localhost:3000
   ```

---

## ⚙️ Backend Setup (Planned)

The backend will be built using **Express.js**.
To get started in the future:

1. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

2. Initialize a Node.js project:

   ```bash
   npm init -y
   npm install express cors dotenv
   ```

3. Create a `server.js` file:

   ```js
   const express = require('express');
   const app = express();
   const PORT = process.env.PORT || 5000;

   app.get('/', (req, res) => res.send('Backend running!'));

   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

4. Run the backend:

   ```bash
   node server.js
   ```

---

## 🧠 Future Features

* Integration with real-time hardware telemetry
* Authentication & user dashboard
* Interactive data visualization and control panel
* Communication bridge between backend and Arduino device

---

## 🧹 Development Notes

* Use separate `.env` files for frontend and backend environments.
* Always commit using clear messages.
* Run `npm run build` before deployment.

---

## 📜 License

This project is currently in development and not yet licensed.
