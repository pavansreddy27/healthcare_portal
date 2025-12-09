# Design Document - Healthcare Patient Portal

## 1. Tech Stack Choices

### Q1. What frontend framework did you use and why?
**Choice:** **React** (via Vite)
**Reasoning:**
*   **Component-Based:** Perfect for building reusable UI elements like the file list and upload form.
*   **Ecosystem:** Vast library support.
*   **Speed:** Vite provides a lightning-fast development environment.
*   **Styling:** Paired with **TailwindCSS** to easily implement the "clean" and "premium" aesthetic requested without writing custom CSS files for everything.

### Q2. What backend framework did you choose and why?
**Choice:** **Python (Flask)**
**Reasoning:**
*   **Simplicity:** Flask is a micro-framework that is easy to set up and ideal for building simple REST APIs.
*   **Flexibility:** It allows full control over the application structure and integrates easily with MySQL.
*   **Explicit:** Python's readability makes the backend logic easy to understand and maintain.

### Q3. What database did you choose and why?
**Choice:** **MySQL**
**Reasoning:**
*   **Requested:** Explicitly requested by the user.
*   **Robustness:** A powerful relational database that scales well.
*   **Structure:** structured schema fits well with the metadata requirements.

### Q4. If you were to support 1,000 users, what changes would you consider?
*   **Database:** Migrate from SQLite to **PostgreSQL** or **MySQL** to handle concurrent writes better and support advanced features like connection pooling.
*   **File Storage:** Move from storing files in a local `uploads/` folder to an Object Storage service like **AWS S3** or **Google Cloud Storage**. Local disk usage would scale poorly and be hard to manage across multiple servers.
*   **Authentication:** Implement robust authentication (e.g., OAuth2, JWT) and authorization to ensure users can only access their own files.
*   **Load Balancing:** Deploy the backend across multiple instances behind a load balancer (e.g., Nginx) to handle increased traffic.
*   **Rate Limiting:** Implement rate limiting to prevent abuse.

## 2. Architecture Overview

**Flow:**
`[Frontend (React)] <--> [HTTP Requests (REST API)] <--> [Backend (Flask)] <--> [Database (MySQL)] & [File System (uploads/)]`

*   **Frontend**: Renders the UI, allows user to select files, and calls APIs.
*   **Backend**: Flask application handling validation, routing, and file logic.
*   **Database**: MySQL table storing `id`, `filename`, `filepath`, `filesize`, `created_at`.
*   **File System**: Physical storage location for the PDF blobs.

## 3. API Specification

### 1. Upload Document
*   **URL:** `/documents/upload`
*   **Method:** `POST`
*   **Description:** Uploads a PDF file.
*   **Request:** `multipart/form-data` with key `file`.
*   **Response:**
    ```json
    {
      "message": "File uploaded successfully",
      "document": {
        "id": 1,
        "filename": "report.pdf",
        "size": 1024,
        "created_at": "2023-10-27T10:00:00Z"
      }
    }
    ```

### 2. List Documents
*   **URL:** `/documents`
*   **Method:** `GET`
*   **Description:** Lists all uploaded documents.
*   **Response:**
    ```json
    [
      {
        "id": 1,
        "filename": "report.pdf",
        "size": 1024,
        "created_at": "2023-10-27T10:00:00Z"
      }
    ]
    ```

### 3. Download Document
*   **URL:** `/documents/:id`
*   **Method:** `GET`
*   **Description:** Downloads a specific file.
*   **Response:** Binary file content (PDF) with `Content-Disposition: attachment`.

### 4. Delete Document
*   **URL:** `/documents/:id`
*   **Method:** `DELETE`
*   **Description:** Deletes a specific file from DB and disk.
*   **Response:**
    ```json
    {
      "message": "File deleted successfully"
    }
    ```

## 4. Data Flow Description

**Q5. Step-by-step process:**

**Upload:**
1.  User selects a PDF in the Frontend.
2.  Frontend sends a `POST /documents/upload` request with the file.
3.  Backend (Flask) receives the file, saves it to the `uploads/` directory with a unique secure filename.
4.  Backend inserts a record into the MySQL database.
5.  Backend returns success to Frontend.
6.  Frontend refreshes the list.

**Download:**
1.  User clicks "Download" on a file in the list.
2.  Frontend sends `GET /documents/:id`.
3.  Backend queries MySQL for the filename using `:id`.
4.  Backend sends the file from `uploads/` using `send_from_directory`.
5.  Browser prompts the user to save the file.

## 5. Assumptions

**Q6. Assumptions made:**
*   **MySQL Running:** A local MySQL instance is running and accessible (defaulting to root user/no pass or prompting user).
*   **Single User:** No authentication is implemented; all documents are visible to anyone with access to the UI.
*   **File Type:** Validation strictly allows only MIME type `application/pdf`.
*   **Concurrency:** Low traffic usage; race conditions on file operations are not heavily optimized against.
*   **Persistence:** The `uploads/` folder must exist. The application will create it if missing.
*   **Security:** Basic input validation is performed, but advanced security (virus scanning, etc.) is out of scope.
