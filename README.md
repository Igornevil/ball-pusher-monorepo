# Ball Pusher Monorepo

**Ball Pusher** — a multiplayer game implemented in a **monorepo** structure.  

The project consists of two main parts:

- `frontend` — the client-side built with **React** and **Vite**.  
- `backend` — the server-side built with **Node.js** and **Express**.

---

## System Requirements

Make sure the correct Node.js version is installed on your system:

```bash
node -v
# expected version:
# v22.19.0
```

---

## How to Run

> All commands should be executed from the root directory of the monorepo.

### Development Mode

To run both frontend and backend simultaneously in development mode:

```bash
npm run dev
```

This command will launch both parts of the project and let you see changes in real time.

### Production Mode

#### Step 1 — Build the Frontend

```bash
npm run build
```

This command builds the `frontend` in production mode.

#### Step 2 — Start the Backend

```bash
cd packages/backend
npm run start
```

The backend will serve both the API and the built static frontend files.

---

## Game Description and Features

**Ball Pusher** is a multiplayer game where players sort balls by color.

Main features:
- **Multiplayer**: supports up to **4 players** simultaneously.  
- **Dynamic settings**: the number of items and their colors can be adjusted before starting a game.  
- **Unique rooms**: when creating a new game, a unique link is generated that can be shared with other players.  

---

## Notes

- Run all commands from the repository root to ensure monorepo scripts work correctly.  
- If you encounter issues with Node.js versioning — use `nvm` or another version manager to switch to `v22.19.0`.  
- Backend and frontend logs will help you debug issues during development.

---

## Support

If you have any questions or suggestions, please open an issue in the repository or contact the project author.

---
