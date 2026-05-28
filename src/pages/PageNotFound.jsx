import { useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext'; // Using your internal AuthContext

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    const { user, isAuthenticated } = useAuth(); // Native auth check
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            {/* ... rest of your UI remains the same ... */}
            
            {/* Admin Note: Now checking native user role */}
            {isAuthenticated && user?.role === 'admin' && (
                <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600">
                        Admin Note: The AI hasn't implemented this route yet. Ask it to implement it in the chat.
                    </p>
                </div>
            )}
            {/* ... action button ... */}
        </div>
    )
}
