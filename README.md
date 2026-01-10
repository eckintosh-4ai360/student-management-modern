# Student Management System - Modern Edition

A comprehensive student management system built with Next.js 14, TypeScript, Prisma, and MySQL.

## Features

- 🔐 **Authentication System** - Role-based access (Admin, Teacher, Student, Parent)
- 👨‍🎓 **Student Management** - Complete CRUD operations for students
- 👨‍🏫 **Teacher Management** - Manage teachers and their subjects
- 📚 **Academic Management** - Classes, Subjects, Lessons, Exams, Assignments
- 📊 **Results & Attendance** - Track student performance and attendance
- 📅 **Events & Announcements** - School-wide communication
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL (Local)
- **ORM:** Prisma 7
- **Authentication:** NextAuth.js
- **UI Components:** Custom components with Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Calendar:** React Big Calendar
- **Forms:** React Hook Form + Zod validation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- MySQL Server (running locally)
- npm or yarn

## Database Setup

### 1. Install MySQL

If you haven't already, install MySQL:
- **Windows:** Download from [MySQL Official Site](https://dev.mysql.com/downloads/mysql/)
- **Mac:** `brew install mysql`
- **Linux:** `sudo apt-get install mysql-server`

### 2. Start MySQL Service

**Windows:**
```bash
# Start MySQL service
net start MySQL80
```

**Mac/Linux:**
```bash
# Start MySQL
mysql.server start
# or
sudo service mysql start
```

### 3. Create Database

Open MySQL command line:
```bash
mysql -u root -p
```

Create the database:
```sql
CREATE DATABASE student_man_sys;
EXIT;
```

### 4. Configure Database Connection

If your MySQL root user has a password, update the `prisma.config.ts` file:

```typescript
datasource: {
  url: "mysql://root:YOUR_PASSWORD@localhost:3306/student_man_sys",
},
```

Or update the `.env` file:
```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/student_man_sys"
```

## Installation

1. **Navigate to the project directory:**
```bash
cd C:\Users\ECKINTOSH\Desktop\student-management-modern
```

2. **Install dependencies:**
```bash
npm install
```

3. **Push database schema:**
```bash
npx prisma db push
```

4. **Generate Prisma Client:**
```bash
npx prisma generate
```

5. **Seed the database with sample data:**
```bash
npm run db:seed
```

## Running the Application

1. **Start the development server:**
```bash
npm run dev
```

2. **Open your browser and navigate to:**
```
http://localhost:3000
```

3. **Login with demo credentials:**

**Admin:**
- Username: `admin`
- Password: `admin123`

**Teacher:**
- Username: `jdoe`
- Password: `teacher123`

**Student:**
- Username: `student1`
- Password: `student123`

**Parent:**
- Username: `parent1`
- Password: `parent123`

## Project Structure

```
student-management-modern/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/      # NextAuth API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── login/         # Login page
│   │   ├── globals.css    # Global styles
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   └── Navbar.tsx     # Top navigation
│   └── lib/
│       ├── actions.ts     # Server actions (CRUD)
│       ├── auth.ts        # Authentication config
│       ├── prisma.ts      # Prisma client
│       ├── utils.ts       # Utility functions
│       └── formValidationSchemas.ts  # Zod schemas
├── .env                   # Environment variables
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data

## Database Schema

The system includes the following models:
- **Admin** - System administrators
- **Teacher** - School teachers
- **Student** - Students
- **Parent** - Parent/Guardian information
- **Class** - Class information
- **Grade** - Grade levels
- **Subject** - Academic subjects
- **Lesson** - Scheduled lessons
- **Exam** - Examinations
- **Assignment** - Homework/assignments
- **Result** - Exam and assignment results
- **Attendance** - Student attendance records
- **Event** - School events
- **Announcement** - School announcements

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to MySQL:

1. **Check if MySQL is running:**
```bash
# Windows
sc query MySQL80

# Mac/Linux
mysql.server status
```

2. **Verify MySQL credentials:**
```bash
mysql -u root -p
```

3. **Check if database exists:**
```sql
SHOW DATABASES;
```

4. **If authentication fails, you may need to update the MySQL root password:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Prisma Issues

If Prisma isn't working:

1. **Regenerate Prisma Client:**
```bash
npx prisma generate
```

2. **Reset database (⚠️ This will delete all data):**
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Port Already in Use

If port 3000 is in use:
```bash
# Kill the process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## Features by Role

### Admin
- Full access to all features
- Manage teachers, students, parents
- Manage classes, subjects, lessons
- View all reports and analytics

### Teacher
- View assigned classes and students
- Create and manage exams and assignments
- Mark attendance
- Enter and view results

### Student
- View personal schedule
- View assignments and exams
- View results and attendance
- Access announcements and events

### Parent
- View child's information
- View child's results and attendance
- Access school events and announcements

## Future Enhancements

- [ ] Email notifications
- [ ] File upload for assignments
- [ ] Real-time chat
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Report card generation (PDF)
- [ ] Bulk operations
- [ ] Data export functionality

## Support

For issues or questions, please:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all prerequisites are installed correctly

## License

This project is for educational purposes.

---

**Note:** Make sure MySQL is running before starting the application. The default configuration assumes MySQL is running on localhost:3306 with root user and no password. Adjust the connection string in `prisma.config.ts` if your setup differs.
