# Healthcare Patient Portal

A simple full-stack application for managing patient documents. Built with **React** (Frontend) and **Python/Flask** (Backend) with **MySQL** database.

## Features
- **Upload**: Upload PDF documents securely.
- **View**: List all uploaded documents with metadata.
- **Download**: Retrieve your files.
- **Delete**: Remove unneeded documents.

## Prerequisites
- **Node.js** (v16+)
- **Python** (v3.8+)
- **MySQL Server** (Running locally, default user `root`, no password).

## Setup Instructions

### 1. Database Setup
Ensure your MySQL server is running. The application will attempt to create the `healthcare_portal` database and `documents` table automatically.

If you have a password for root or need to change credentials, edit `backend/.env`.

### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the server:

```bash
python app.py
```
The backend runs on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```
The frontend runs on `http://localhost:5173`.

## Usage
1. Open `http://localhost:5173` in your browser.
2. Use the "Upload Document" form to select a PDF file.
3. View the list of uploaded files.
4. Download or Delete files as needed.
