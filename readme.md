# 📋 Project Camp Backend

A robust and scalable RESTful API for collaborative project management built with **Express.js**, **MongoDB**, and **Node.js**.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)

## 🚀 Overview

Project Camp Backend is a comprehensive project management system that enables teams to collaborate effectively. It provides features for project organization, task management, subtask tracking, notes, and role-based access control with secure JWT authentication.

## ✨ Key Features

### 🔐 Authentication & Authorization

- User registration and login with email verification
- Secure JWT-based authentication
- Password management (change, forgot, reset)
- Role-based access control (Admin, Project Admin, Member)
- Token refresh mechanism

### 📁 Project Management

- Create, read, update, and delete projects
- Project member management
- Role-based team assignments
- Member invitation via email

### 📝 Task Management

- Create and manage tasks with descriptions
- Task status tracking (Todo, In Progress, Done)
- File attachments support
- Task assignment to team members
- Subtask creation and tracking

### 📌 Additional Features

- Project notes (for Admins)
- Subtask completion tracking
- Health check monitoring
- CORS support for cross-origin requests
- Email notifications for invitations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas cloud database)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anandsingh00/Project-Management-Backend.git
cd projmanagement
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/projmanagement

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
```

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

The server will start with **nodemon** for auto-reloading on file changes.

### Production Mode

```bash
npm start
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth/`)

| Method | Endpoint                 | Description            | Auth Required |
| ------ | ------------------------ | ---------------------- | ------------- |
| POST   | `/register`              | User registration      | ✗             |
| POST   | `/login`                 | User login             | ✗             |
| POST   | `/logout`                | User logout            | ✓             |
| GET    | `/current-user`          | Get current user info  | ✓             |
| POST   | `/change-password`       | Change password        | ✓             |
| POST   | `/refresh-token`         | Refresh access token   | ✗             |
| GET    | `/verify-email/:token`   | Verify email           | ✗             |
| POST   | `/forgot-password`       | Request password reset | ✗             |
| POST   | `/reset-password/:token` | Reset password         | ✗             |

### Project Routes (`/api/v1/projects/`)

| Method | Endpoint                      | Description         | Role Required |
| ------ | ----------------------------- | ------------------- | ------------- |
| GET    | `/`                           | List user projects  | All           |
| POST   | `/`                           | Create project      | Admin         |
| GET    | `/:projectId`                 | Get project details | All           |
| PUT    | `/:projectId`                 | Update project      | Admin         |
| DELETE | `/:projectId`                 | Delete project      | Admin         |
| GET    | `/:projectId/members`         | List members        | All           |
| POST   | `/:projectId/members`         | Add member          | Admin         |
| PUT    | `/:projectId/members/:userId` | Update member role  | Admin         |
| DELETE | `/:projectId/members/:userId` | Remove member       | Admin         |

### Task Routes (`/api/v1/tasks/`)

| Method | Endpoint                         | Description      | Role Required        |
| ------ | -------------------------------- | ---------------- | -------------------- |
| GET    | `/:projectId`                    | List tasks       | All                  |
| POST   | `/:projectId`                    | Create task      | Admin, Project Admin |
| GET    | `/:projectId/t/:taskId`          | Get task details | All                  |
| PUT    | `/:projectId/t/:taskId`          | Update task      | Admin, Project Admin |
| DELETE | `/:projectId/t/:taskId`          | Delete task      | Admin, Project Admin |
| POST   | `/:projectId/t/:taskId/subtasks` | Create subtask   | Admin, Project Admin |
| PUT    | `/:projectId/st/:subTaskId`      | Update subtask   | All                  |
| DELETE | `/:projectId/st/:subTaskId`      | Delete subtask   | Admin, Project Admin |

### Notes Routes (`/api/v1/notes/`)

| Method | Endpoint                | Description      | Role Required |
| ------ | ----------------------- | ---------------- | ------------- |
| GET    | `/:projectId`           | List notes       | All           |
| POST   | `/:projectId`           | Create note      | Admin         |
| GET    | `/:projectId/n/:noteId` | Get note details | All           |
| PUT    | `/:projectId/n/:noteId` | Update note      | Admin         |
| DELETE | `/:projectId/n/:noteId` | Delete note      | Admin         |

### Health Check (`/api/v1/healthcheck/`)

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| GET    | `/`      | System health status |

## 🏗️ Project Structure

```
projmanagement/
├── src/
│   ├── controllers/          # Route handlers and business logic
│   │   ├── auth.controllers.js
│   │   ├── project.controllers.js
│   │   ├── task.controllers.js
│   │   └── healthcheck.controllers.js
│   ├── models/               # MongoDB data models
│   │   ├── user.models.js
│   │   ├── project.models.js
│   │   ├── task.models.js
│   │   ├── subtask.models.js
│   │   ├── note.models.js
│   │   └── projectmember.models.js
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.js
│   │   ├── projects.routes.js
│   │   ├── task.routes.js
│   │   └── healthcheck.routes.js
│   ├── middlewares/          # Custom middleware functions
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └── multer.middlewares.js
│   ├── utils/                # Utility functions
│   │   ├── api-response.js
│   │   ├── api-errors.js
│   │   ├── asyncHandler.js
│   │   ├── constants.js
│   │   └── mail.js
│   ├── validators/           # Request validation schemas
│   │   └── index.js
│   ├── db/                   # Database connection
│   │   └── connectDB.js
│   ├── app.js                # Express app configuration
│   └── index.js              # Application entry point
├── public/                   # Static files
├── package.json
├── .env                      # Environment variables
└── README.md
```

## 🔑 Key Technologies

| Technology            | Purpose                         |
| --------------------- | ------------------------------- |
| **Express.js**        | Web framework for building APIs |
| **MongoDB**           | NoSQL database                  |
| **Mongoose**          | ODM for MongoDB                 |
| **JWT**               | Secure authentication tokens    |
| **Bcrypt**            | Password hashing                |
| **Nodemailer**        | Email sending                   |
| **Multer**            | File upload handling            |
| **Express Validator** | Request validation              |
| **Nodemon**           | Development auto-reload         |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **User registers/logs in** → Server issues JWT token
2. **Token is sent** in the `Authorization` header for protected routes
3. **Format:** `Authorization: Bearer <token>`
4. **Token stored** as HTTP-only cookie for security

Protected endpoints require a valid JWT token in the request headers.

## 👥 Role-Based Access Control

| Role              | Permissions                                                                             |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Admin**         | Create/update/delete projects, manage members, create/update/delete tasks, create notes |
| **Project Admin** | Create/update/delete tasks within assigned project, update subtasks                     |
| **Member**        | View project and tasks, mark subtasks as complete                                       |

## 📧 Email Features

- Email verification during registration
- Password reset links
- Project member invitations
- Notifications (when implemented)

## 🐛 Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **nodemailer** - Email service
- **multer** - File uploads
- **express-validator** - Input validation
- **cors** - Cross-Origin Resource Sharing
- **cookie-parser** - Cookie parsing
- **mailgen** - Email template generation
- **dotenv** - Environment variable management

## 👨‍💻 Author

**Anand Raj Singh**

- GitHub: [@Anandsingh00](https://github.com/Anandsingh00)

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Contact: anand.singh@example.com

---

**Made with ❤️ by Anand Raj Singh**
