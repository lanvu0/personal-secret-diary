# Personal Secret Diary

A full-stack, private journaling application built with Node.js, Express, TypeScript, and SQLite. This project was developed to practice and demonstrate core backend development concepts, including user authentication, session management, RESTful routing, and database interactions in a server-side rendered application.

![Screenshot of the application dashboard](./dashboard-screenshot.png)

## Project Focus & Learning Objectives

The primary objective of this project was to build a robust and secure backend system from the ground up. The focus was on implementing the following key concepts:

*   **RESTful API Design:** Structuring routes and controllers for logical and scalable CRUD (Create, Read, Update, Delete) operations on diary entries.
*   **User Authentication & Authorisation:** Implementing secure user registration, login, and password hashing using `bcryptjs`.
*   **Persistent Session Management:** Using `express-session` with a `connect-sqlite3` store to maintain user sessions across browser restarts and protect sensitive routes.
*   **Database Interaction:** Performing SQL operations with an SQLite database, including table creation with foreign keys, querying, and data manipulation using the `sqlite` and `sqlite3` packages.
*   **TypeScript for Backend Development:** Leveraging TypeScript to ensure type safety, improve code quality, and enhance developer experience in a Node.js environment.
*   **MVC-like Architecture:** Organising the codebase into distinct logical parts (routes, controllers, database logic, and views) for maintainability and separation of concerns.
*   **Custom Middleware:** Creating custom middleware (`isLoggedIn`) to protect routes and ensure that only authenticated users can access their personal data.
*   **Refactoring to TypeScript:** This project was initially developed in JavaScript and was fully migrated to TypeScript to improve code quality, enforce type safety, and gain practical experience with modern backend development workflows.

To support these backend features, a simple and clean user interface was implemented using EJS for server-side rendering, allowing the backend logic to be tested and demonstrated effectively.

## Key Features

*   **Secure User Authentication:** Users can register for a new account and log in securely. Passwords are never stored in plain text, utilising strong hashing algorithms.
*   **Persistent Sessions:** Users remain logged in across browser sessions until they explicitly log out, thanks to a database-backed session store.
*   **Full CRUD for Entries:** Authenticated users can create new diary entries, view a list of all their past entries, edit them, and delete them.
*   **Data Isolation:** The application ensures that users can only view and manage their own diary entries. API routes and database queries are designed to prevent unauthorised access to other users' data.
*   **Server-Side Rendering:** Dynamic HTML is rendered on the server with EJS, providing a fast initial page load and a classic web application experience.

## Tech Stack

| Category      | Technology / Library                                       |
| ------------- | ---------------------------------------------------------- |
| **Language**  | TypeScript                                                 |
| **Backend**   | Node.js, Express.js                                        |
| **Database**  | SQLite3 with `sqlite` & `sqlite3` packages                 |
| **Views**     | EJS (Embedded JavaScript Templating)                       |
| **Auth**      | `bcryptjs` (Password Hashing), `express-session`           |
| **Session Store** | `connect-sqlite3`                                      |
| **Dev Tools** | `tsx` (TypeScript Execution), `nodemon` (Live Reloading)   |

## Local Setup & Installation

To run this project locally, follow these steps:

1.  **Prerequisites:**
    *   Node.js (v18 or higher recommended) and npm installed on your machine.

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/lanvu0-personal-secret-diary.git
    cd lanvu0-personal-secret-diary
    ```
    *(Replace `your-username` with your actual GitHub username)*

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the application:**
    The project uses `tsx` to run TypeScript files directly.
    ```bash
    npm start
    ```
    This will start the server. You can access the application in your browser at `http://localhost:8000`.

5.  The server will automatically create the `diary.sqlite3` and `sessions.sqlite3` database files in the root directory on the first run.

## Project Structure

The project follows a standard MVC-like structure to keep the codebase organised and maintainable.

```
/
├── public/             # Static assets (CSS)
├── src/
│   ├── controllers/    # Handles request logic and business rules
│   ├── middleware/     # Custom Express middleware (e.g., auth checks)
│   ├── routes/         # Express route definitions
│   └── types/          # TypeScript type definitions (e.g., for session)
├── views/
│   ├── pages/          # Main EJS page templates
│   └── partials/       # Reusable EJS partials (header, footer)
├── database.ts         # Database connection, schema setup, and query functions
├── server.ts           # Main Express server entry point and configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript compiler configuration
```