# How to Share and Setup the SportShield Platform

This document outlines the two easiest methods for sharing this project with your hackathon teammates, alongside the specific setup steps required to run the platform locally on their personal laptops.

---

## 🚀 Two Methods to Share the Project

### Method 1: GitHub Private Repository (Recommended)
This is the best way to share the project if your team wants to collaborate and push changes simultaneously.
1. **Initialize Git**: If you haven't already, open a terminal inside the `hackathon-ui` folder and run `git init`.
2. **Commit the Code**: Run `git add .` followed by `git commit -m "Initial commit"`. Ensure you have a `.gitignore` file that ignores the `node_modules` folders.
3. **Create the Repo**: Go to [GitHub](https://github.com/), create a New Repository, and ensure it is set to **Private**.
4. **Push your Code**: Follow the GitHub instructions to push the code (e.g., `git remote add origin <URL>` and `git push -u origin main`).
5. **Invite the Team**: Go to your repository **Settings** > **Collaborators** and invite your teammates using their GitHub usernames.

### Method 2: Share via ZIP File (WhatsApp / Google Drive)
This is the fastest method if you just want to quickly send them the current codebase.
1. **Clean the unnecessary files**: In your file explorer, delete the `node_modules` folders inside both the `/frontend` and `/backend` directories. This drastically reduces the file size from hundreds of MBs to just a few MBs.
2. **Zip the Folder**: Right-click the entire `hackathon-ui` folder and select **Compress** or **Create ZIP file**.
3. **Share the ZIP**: Send the resulting `hackathon-ui.zip` file directly to your team via **WhatsApp Web**, **Google Drive**, or Email.
4. **Extract**: Your teammates just need to download it and extract the folder on their desktop.

---

## 🛠️ How to Setup and Run the Project Locally

Once your teammate has downloaded the project either via GitHub or ZIP, they must follow these exact steps to run the backend and frontend simultaneously.

### 1. Prerequisites
Your teammates **must** have the following installed on their laptops:
*   [Node.js](https://nodejs.org/en) (v18+ recommended)
*   [MariaDB server](https://mariadb.org/download/) or MySQL Workbench

### 2. Initialize the Database
1. Open the MariaDB/MySQL command line or a GUI tool like MySQL Workbench.
2. Login with credentials. (Current backend expects `root` as the user and `password@123` as the password. Update `backend/js/server.js` if they use a different password!).
3. Import the `database.sql` file provided inside the `/backend` folder to instantly create the database tables:
   ```bash
   mysql -u root -p < backend/database.sql
   ```

### 3. Start the Backend API (NodeJS)
1. Open a terminal and navigate into the backend directory:
   ```bash
   cd hackathon-ui/backend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Start the server (runs on Port 5000):
   ```bash
   node js/server.js
   ```

### 4. Start the Frontend UI (React + Vite)
1. Open a **second** terminal window and navigate into the frontend directory:
   ```bash
   cd hackathon-ui/frontend
   ```
2. Install all frontend dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite development proxy (runs on Port 6969):
   ```bash
   npm run dev
   ```

### 5. Access the Platform
Your teammates can now open their web browser and visit:
`http://localhost:6969`

They can login to the Admin Dashboard (http://localhost:6969/admin) using `admin` / `admin`.
