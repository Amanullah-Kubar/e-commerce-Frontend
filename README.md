# E-Commerce Frontend (React + TypeScript + Vite)

This repository contains a minimal frontend scaffold for an e-commerce application built with React, TypeScript, and Vite. It demonstrates a basic single-page application structure with API integration using Axios.

> ⚠️ Note: The live demo deployment is currently broken, so the application cannot be inspected online.

---

## Features

- **Product listing**: Fetches product data from a backend API using Axios.
- **API integration layer**: Simple Axios-based requests to interact with backend endpoints.
- **SPA architecture**: Built as a single-page application using React and Vite.
- **Typed frontend**: TypeScript is used for type safety and better editor support.
- **Scaffold for expansion**: Designed to be extended with more features such as cart, checkout, or authentication.

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **API calls**: Axios
- **Styling**: CSS / any included framework
- **Build & Development**: Node.js, npm

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Amanullah-Kubar/e-commerce-Frontend.git
```
Navigate into the project directory:

```bash
cd e-commerce-Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```


Open the URL shown in the terminal (usually http://localhost:5173) to view the application.

```bash
Project Structure
/public         # Static assets
/src            # Main application code
  /components   # Reusable React components
  /pages        # Pages / routes
  /services     # Axios API calls
  App.tsx       # Root component
  main.tsx      # Entry point
```
## What I Learned

Setting up a modern React + TypeScript project with Vite.

Implementing basic API calls using Axios.

Structuring a frontend project with components, pages, and services.

Understanding SPA routing and state handling.

Type safety and editor integration using TypeScript.

## Future Improvements

Fix live deployment on Vercel.

Add product details, cart, and checkout pages.

Implement authentication and user sessions.

Enhance UI/UX with responsive design and better styling.

Integrate error handling for API calls and loading states.
