import { UserRole, type User } from '../types/auth';

/**
 * Permission service for role-based access control
 * Provides centralized permission checking for admin functionality
 */
export class PermissionService {
    /**
     * Check if user has admin access
     */
    static hasAdminAccess(user: User | null): boolean {
        return user?.role === UserRole.Admin && user?.isActive === true;
    }

    /**
     * Check if user can access CRUD forms (admin-only functionality)
     */
    static canAccessCRUDForms(user: User | null): boolean {
        return this.hasAdminAccess(user);
    }

    /**
     * Check if user can manage users (create, edit, delete)
     */
    static canManageUsers(user: User | null): boolean {
        return this.hasAdminAccess(user);
    }

    /**
     * Check if user can access admin dashboard
     */
    static canAccessAdminDashboard(user: User | null): boolean {
        return this.hasAdminAccess(user);
    }

    /**
     * Check if user can access admin management pages
     */
    static canAccessAdminManagement(user: User | null): boolean {
        return this.hasAdminAccess(user);
    }

    /**
     * Validate admin permissions with detailed response
     */
    static validateAdminPermissions(user: User | null): {
        hasAccess: boolean;
        reason?: string;
        userRole?: string;
    } {
        if (!user) {
            return {
                hasAccess: false,
                reason: 'User is not authenticated',
                userRole: 'None'
            };
        }

        if (!user.isActive) {
            return {
                hasAccess: false,
                reason: 'User account is inactive',
                userRole: this.getUserRoleDisplayName(user.role)
            };
        }

        if (user.role !== UserRole.Admin) {
            return {
                hasAccess: false,
                reason: 'User does not have admin privileges',
                userRole: this.getUserRoleDisplayName(user.role)
            };
        }

        return {
            hasAccess: true,
            userRole: this.getUserRoleDisplayName(user.role)
        };
    }

    /**
     * Get user-friendly display name for user roles
     */
    static getUserRoleDisplayName(role: UserRole): string {
        switch (role) {
            case UserRole.Admin:
                return 'Administrator';
            case UserRole.Student:
                return 'Student';
            case UserRole.Parent:
                return 'Parent';
            case UserRole.Faculty:
                return 'Faculty';
            default:
                return 'Unknown';
        }
    }

    /**
     * Get appropriate redirect path based on user role
     */
    static getRoleBasedRedirect(role: UserRole): string {
        switch (role) {
            case UserRole.Admin:
                return '/admin';
            case UserRole.Student:
                return '/student';
            case UserRole.Parent:
                return '/parent';
            case UserRole.Faculty:
                return '/faculty';
            default:
                return '/';
        }
    }

    /**
     * Check if current route requires admin access
     */
    static isAdminRoute(pathname: string): boolean {
        const adminRoutes = [
            '/admin',
            '/admin/dashboard',
            '/admin/users',
            '/admin/management'
        ];

        return adminRoutes.some(route =>
            pathname === route || pathname.startsWith(route + '/')
        );
    }

    /**
     * Get all admin-accessible routes
     */
    static getAdminRoutes(): string[] {
        return [
            '/admin',
            '/admin/dashboard',
            '/admin/users'
        ];
    }
}

export default PermissionService;