# EduShield Frontend

A modern educational management system frontend built with React, TypeScript, and Material-UI. This application provides comprehensive management tools for students, faculty, parents, and administrators in an educational environment.

## 🚀 Features

### Core Features
- **Modern Tech Stack**: React 19, TypeScript, Vite
- **UI Framework**: Material-UI (MUI) v7 for consistent design
- **Routing**: React Router DOM v7 with protected routes
- **HTTP Client**: Axios with interceptors and error handling
- **Form Handling**: React Hook Form with Yup validation
- **Authentication**: Google OAuth integration with JWT tokens
- **State Management**: React Context API with custom hooks
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### Management Features
- **Student Management**: Create, update, and manage student records with faculty assignments
- **Faculty Management**: Manage faculty profiles with department and subject assignments
- **Parent Management**: Handle parent information with emergency contacts and permissions
- **Admin Dashboard**: Comprehensive administrative controls and system settings
- **Role-Based Access Control**: Secure access based on user roles (Admin, Student, Parent, Faculty)
- **Form Validation**: Real-time validation with backend-aligned schemas
- **Error Handling**: Comprehensive error handling with user-friendly feedback
- **Date Management**: Proper DateTime handling for backend integration

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components (GoogleLogin, AdminRouteGuard)
│   ├── common/         # Shared components (ErrorPages, etc.)
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── ui/             # UI components
│       ├── Forms/      # Form components (StudentForm, FacultyForm, ParentForm)
│       ├── DataTable/  # Data table component
│       ├── Modal/      # Modal components
│       ├── Toast/      # Toast notification system
│       └── ...         # Other UI components
├── contexts/           # React contexts
│   ├── AuthContext.tsx        # Authentication state management
│   ├── ToastContext.tsx       # Toast notifications
│   └── SystemSettingsContext.tsx # System settings
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Admin/          # Admin dashboard and management pages
│   ├── Student/        # Student dashboard
│   ├── Parent/         # Parent dashboard
│   ├── Faculty/        # Faculty dashboard
│   ├── Home/           # Landing page
│   └── TestForms.tsx   # Form testing page
├── services/           # API service functions
│   ├── api.ts          # Main API service with backend integration
│   ├── auth.ts         # Authentication service
│   └── googleAuth.ts   # Google OAuth service
├── types/              # TypeScript type definitions
│   ├── api.ts          # API request/response types
│   ├── auth.ts         # Authentication types
│   ├── user.ts         # User and entity types
│   ├── forms.ts        # Form data types
│   └── components.ts   # Component prop types
├── utils/              # Utility functions
│   ├── dateUtils.ts    # Date conversion utilities
│   ├── errorHandler.ts # Error handling utilities
│   ├── validationSchemas.ts # Form validation schemas
│   └── routeGuards.ts  # Route protection utilities
└── routes/             # Application routing configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaquibAnwar/edushield-frontend.git
cd edushield-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_NODE_ENV=development
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## 🎯 User Roles & Access Control

The system implements comprehensive role-based access control:

- **Admin**: Full system administration, user management, and system settings
- **Student**: Access to personal academic information, grades, and course materials
- **Parent**: Monitor child's academic progress, fees, and communication with faculty
- **Faculty**: Manage assigned students, grades, and academic records

### Protected Routes
- Admin routes are protected by `AdminRouteGuard` component
- Authentication required for all user-specific areas
- Automatic redirects based on user roles
- Session management with token refresh

## 🔧 Configuration

### Backend Integration
The frontend is configured to work with the EduShield .NET Core backend:
- **API Base URL**: `http://localhost:8080/api/v1`
- **Authentication**: JWT tokens with automatic refresh
- **Date Handling**: Automatic conversion between frontend dates and backend DateTime
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Form Management
- **Student Forms**: Faculty assignment, enrollment management
- **Faculty Forms**: Department and subject assignment
- **Parent Forms**: Emergency contacts and pickup authorization
- **Validation**: Real-time validation aligned with backend requirements
- **Data Conversion**: Automatic date and enum conversion for backend compatibility

### Code Quality
- **ESLint**: Configured with React, TypeScript, and Prettier rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled for better type safety
- **Type Checking**: `npm run type-check` for compilation verification

## 🧪 Testing

### Form Testing
Visit `http://localhost:3000/test-forms` to test all form implementations:
- **Student Form**: Test faculty assignments and data validation
- **Faculty Form**: Test department/subject assignments
- **Parent Form**: Test emergency contacts and permissions

### Manual Testing
1. Run the development server: `npm run dev`
2. Navigate to test forms page: `http://localhost:3000/test-forms`
3. Test each form tab for proper validation and submission
4. Check browser console for proper data structure
5. Verify admin access control at protected routes

## 🚀 Deployment

### Production Build
1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory, ready for deployment.

### Environment Configuration
Ensure production environment variables are set:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
VITE_NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Backend Integration

This frontend is designed to work with the EduShield .NET Core backend:
- **API Compatibility**: All forms and data structures match backend DTOs
- **Authentication**: Integrated with backend JWT authentication
- **Error Handling**: Handles backend validation errors and API responses
- **Date Management**: Proper DateTime conversion for backend compatibility

### Key Integration Features
- Student management with auto-generated roll numbers
- Faculty management with auto-generated employee IDs
- Parent management with optional address fields
- Comprehensive error handling and user feedback
- Admin-only access control for management features

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 🎉 Recent Updates

### Forms Alignment (Latest)
- ✅ Updated all forms to match backend DTO requirements
- ✅ Implemented proper date conversion utilities
- ✅ Added comprehensive error handling and user feedback
- ✅ Configured API service for backend integration (port 8080)
- ✅ Added admin-only access control with route guards
- ✅ Fixed all TypeScript compilation issues
- ✅ Added form testing page for development and QA