
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import EmployeePortal from "./components/EmployeePortal";
import UserManagement from "./components/UserManagement";
import EmployeeProfile from "./components/EmployeeProfile";
import EmployeeDirectory from "./components/EmployeeDirectory";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/employee-portal" element={<ProtectedRoute><EmployeePortal /></ProtectedRoute>} />
            
            {/* Employee Management Routes */}
            <Route path="/employees" element={<ProtectedRoute><EmployeeDirectory /></ProtectedRoute>} />
            <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><Index activePage="departments" /></ProtectedRoute>} />
            <Route path="/leave-requests" element={<ProtectedRoute><Index activePage="leave-requests" /></ProtectedRoute>} />
            <Route path="/remote-requests" element={<ProtectedRoute><Index activePage="remote-requests" /></ProtectedRoute>} />
            
            {/* Catch-all route - redirect to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
