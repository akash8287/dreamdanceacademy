# Dream Dance Academy 🩰

A beautiful, modern React website for a dance academy with a complete backend system featuring authentication, admin dashboard, and student portal.

## ✨ Features

### Public Website
- **Dynamic Pages**: Home, About, Classes, Instructors, Schedule, Gallery, Contact, and Enrollment
- **Contact Form**: Submit queries and get in touch
- **Class Filtering**: Filter classes by dance style category
- **Interactive Schedule**: Browse weekly class schedules
- **Gallery with Lightbox**: Beautiful gallery with category filtering
- **Dark Maroon Theme**: Elegant dark theme with maroon and gold accents

### Authentication System
- **Admin Login**: Full administrative access
- **Student Login**: Personal dashboard access
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Role-based access control

### Admin Dashboard
- **Student Management**: Add, edit, delete students
- **Schedule Management**: Assign classes to individual students
- **View Documents**: See uploaded student documents
- **Dashboard Stats**: Overview of students and enrollments

### Student Portal
- **Personal Profile**: View and edit profile information
- **My Schedule**: View assigned class schedule
- **Document Upload**: Upload ID proofs, certificates, photos
- **Profile Image**: Upload custom profile picture

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both servers (recommended):
   ```bash
   npm run dev:all
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - API Server
   npm run server

   # Terminal 2 - Frontend
   npm run dev
   ```

3. Open your browser:
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3001`

### Default Login Credentials

**Admin Account:**
- Email: `admin@dreamdance.com`
- Password: `admin123`

## 🗄️ Database

The app uses **SQLite** (via better-sqlite3) for data storage. The database file is created automatically at `server/dance_academy.db`.

### Database Schema

- **users**: User accounts (admin & students)
- **student_details**: Extended student information
- **student_schedules**: Individual class schedules
- **documents**: Uploaded files metadata
- **dance_classes**: Available dance classes

## 📁 Project Structure

```
dreamdanceacademy/
├── server/                    # Backend API
│   ├── index.js              # Express server entry
│   ├── database.js           # SQLite setup & initialization
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   └── routes/
│       ├── auth.js           # Login/Register endpoints
│       ├── admin.js          # Admin management endpoints
│       └── student.js        # Student profile/documents
├── src/                       # Frontend React app
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state
│   ├── services/
│   │   └── api.js            # API client functions
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Classes.jsx
│   │   ├── Instructors.jsx
│   │   ├── Schedule.jsx
│   │   ├── Gallery.jsx
│   │   ├── Contact.jsx
│   │   ├── Enrollment.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── StudentDashboard.jsx
│   ├── App.jsx
│   └── App.css
├── uploads/                   # Uploaded files storage
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette (Dark Maroon Theme)
- **Primary**: Deep Maroon (#6B1B3D)
- **Secondary**: Gold (#C9A962)
- **Dark**: Rich Black (#0D0A0B)
- **Dark Soft**: Dark Maroon (#1A1216)
- **Cream**: Off White (#F5F0E8)

### Typography
- **Display Font**: Cormorant Garamond (serif)
- **Body Font**: Outfit (sans-serif)

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/password` | Update password |

### Admin (requires admin auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/students` | List all students |
| GET | `/api/admin/students/:id` | Get student details |
| POST | `/api/admin/students` | Add new student |
| PUT | `/api/admin/students/:id` | Update student |
| DELETE | `/api/admin/students/:id` | Delete student |
| POST | `/api/admin/students/:id/schedules` | Add schedule |
| PUT | `/api/admin/schedules/:id` | Update schedule |
| DELETE | `/api/admin/schedules/:id` | Delete schedule |

### Student (requires student auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/profile` | Get profile |
| PUT | `/api/student/profile` | Update profile |
| GET | `/api/student/schedule` | Get my schedule |
| GET | `/api/student/documents` | Get my documents |
| POST | `/api/student/documents` | Upload document |
| DELETE | `/api/student/documents/:id` | Delete document |
| POST | `/api/student/profile-image` | Upload profile image |

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI Library
- **React Router v7** - Client-side routing
- **Framer Motion** - Animations
- **Vite** - Build tool

### Backend
- **Express 5** - Web framework
- **better-sqlite3** - SQLite database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads

## 📝 Scripts

```bash
npm run dev        # Start frontend dev server
npm run server     # Start API server
npm run dev:all    # Start both servers concurrently
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Role-based access control
- File upload validation
- Input sanitization

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 📄 License

This project is open source and available under the MIT License.

---

Made with ❤️ for dance lovers everywhere
