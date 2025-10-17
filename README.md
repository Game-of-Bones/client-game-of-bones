# 🦴 Game of Bones - Client

This is the client-side application for "Game of Bones", a blog dedicated to the latest discoveries in paleontology. This project provides the user interface for readers and authors, built with React.

## Table of Contents

- About The Project
- Getting Started
  - Prerequisites
  - Installation
- Available Scripts
- Environment Variables
- Features
- Project Structure
- Contributing
- License

---

## About The Project

This project serves as the frontend for the "Game of Bones" paleontology blog. It handles user authentication, displaying articles, managing comments, and communicating with the backend server.

**Built With:**

*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
*   [Vite](https://vitejs.dev/) - Next-generation frontend tooling.
*   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript.
*   [Zustand](https://zustand-demo.pmnd.rs/) - A small, fast, and scalable state-management solution.
*   [React Router](https://reactrouter.com/) - Declarative routing for React.
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
*   [Axios](https://axios-http.com/) - Promise-based HTTP client for the browser and node.js.
*   [React Hook Form](https://react-hook-form.com/) - Performant, flexible, and extensible forms with easy-to-use validation.
*   [Three.js](https://threejs.org/) - 3D graphics library.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you will need Node.js and npm installed on your system.

*   **Node.js** (v18.x or higher recommended)
    *   You can download the official installer from [nodejs.org](https://nodejs.org/).
*   **npm**
    *   `npm` is included with the Node.js installation.
    *   To ensure you have the latest version, you can optionally run the following command:
        ```sh
        npm install npm@latest -g
        ```

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/Game-of-Bones/client-game-of-bones.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd client-game-of-bones
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```
4.  Create a `.env` file in the root of the project and add the necessary environment variables as in the env.example file.

---

## Available Scripts

In the project directory, you can run:

*   `npm run dev`
    Runs the app in development mode. Open http://localhost:5173 (or the port specified by Vite) to view it in the browser.
---

## Environment Variables

This project requires the following environment variables to be set in a `.env` file in the root directory. By default, Vite only exposes variables prefixed with `VITE_`.

*   `VITE_API_URL`: The base URL for the backend server API.

Example `.env` file:
```
VITE_API_URL=http://localhost:3000
```

---

## Main Features of the Application

## Post Management

- **Create and Edit Articles:**  
  The existence of an edit route (`/posts/:id/edit`) and the nature of the application indicate that authorized users (authors/admins) can create and modify posts.

- **Read Articles:**  
  Users can view a list of all posts and click to access a detailed page for each one.

- **Delete Articles:**  
  There’s functionality to delete posts, protected by a confirmation modal to prevent accidental deletions.

---

## Detailed Paleontological Data Display

Each post is not just an article, but a technical record that can display:

- **Basic Information:** Title, summary, main content, and featured image.  
- **Discovery Data:** Discovery date, paleontologist’s name, geological period, and location.  
- **Fossil Technical Data:** Type of fossil (bones, shells, amber, etc.) and geographical coordinates (latitude and longitude).

---

## User Management and Authentication

- **Sign Up and Login:**  
  The application includes a system for users to register and log in.

- **Content Association:**  
  Posts are linked to an author, displaying their username.

---

## Content Organization and Navigation

- **Categories and Tags:**  
  The API defines endpoints for `/categories` and `/tags`, which implies users can filter and browse posts using these taxonomies.

---

## User Interactivity

- **Comment System:**  
  The API has an endpoint for `/comments`, indicating that users can read and write comments on posts.

---

## Modern and Responsive User Interface

- **Adaptive Design:**  
  The use of Tailwind CSS suggests that the interface is built to work seamlessly across different screen sizes, from mobile to desktop.

- **Smooth Experience:**  
  As a Single-Page Application (SPA) built with React and React Router, navigation between pages is fast and does not require a full page reload.


---

## Project Structure

A brief overview of the main folders in this project:

```
client-game-of-bones/
├── public/         # Public assets and index.html
├── src/
│   ├── assets/     # Images, fonts, etc.
│   ├── components/ # Reusable UI components
│   ├── features/   # Components and logic for specific features (e.g., auth, posts)
│   ├── hooks/      # Custom React hooks
│   ├── hooks/      # Custom React hooks for shared logic
│   ├── pages/      # Top-level page components
│   ├── services/   # API calls and other external services
│   ├── store/      # Redux store configuration
│   ├── store/      # Global state management (Zustand)
│   ├── App.js      # Main application component
│   └── index.js    # Application entry point
└── package.json
```

*(Adjust this structure to reflect your project's layout.)*

---

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
