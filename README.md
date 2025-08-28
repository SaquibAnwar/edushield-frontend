# EduShield Frontend

A modern educational management system frontend built with React, TypeScript, and Material-UI.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI (MUI) for consistent design
- **Routing**: React Router DOM for navigation
- **HTTP Client**: Axios for API communication
- **Form Handling**: React Hook Form with Yup validation
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Development Tools**: Hot reload, path aliases, type checking

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Layout, Navigation, etc.)
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin-specific components
│   ├── student/        # Student-specific components
│   ├── parent/         # Parent-specific components
│   └── faculty/        # Faculty-specific components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and constants
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
VITE_API_BASE_URL=http://localhost:5000/api
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

## 🎯 User Roles

The system supports multiple user roles:

- **Admin**: System administration and management
- **Student**: Access to courses, grades, and academic information
- **Parent**: Monitor child's academic progress
- **Faculty**: Manage courses, grades, and student interactions

## 🔧 Configuration

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { ApiResponse } from '@/types/api';
```

### Code Quality

- **ESLint**: Configured with React, TypeScript, and Prettier rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled for better type safety

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory, ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [EduShield Backend](https://github.com/SaquibAnwar/edushield-backend) - .NET Core API backend

## 📞 Support

For support and questions, please open an issue in the GitHub repository.