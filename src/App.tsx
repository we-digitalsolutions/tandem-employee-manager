
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
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
            <Route path="/reports" element={<ProtectedRoute><Layout activePage="reports"><Reports /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout activePage="settings"><Settings /></Layout></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute><Layout activePage="user-management"><UserManagement /></Layout></ProtectedRoute>} />
            <Route path="/employee-portal" element={<ProtectedRoute><EmployeePortal /></ProtectedRoute>} />
            
            {/* Employee Management Routes */}
            <Route path="/employees" element={<ProtectedRoute><EmployeeDirectory /></ProtectedRoute>} />
            <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><Index activePage="departments" /></ProtectedRoute>} />
            <Route path="/leave-requests" element={<ProtectedRoute><Index activePage="leave-requests" /></ProtectedRoute>} />
            <Route path="/remote-requests" element={<ProtectedRoute><Index activePage="remote-requests" /></ProtectedRoute>} />
            
            {/* New Routes - Fixed 404 issues */}
            <Route path="/holidays" element={<ProtectedRoute><Index activePage="holidays" /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Index activePage="templates" /></ProtectedRoute>} />
            <Route path="/document-requests" element={<ProtectedRoute><Index activePage="document-requests" /></ProtectedRoute>} />
            <Route path="/feature-verification" element={<ProtectedRoute><Index activePage="feature-verification" /></ProtectedRoute>} />
            
            {/* Catch-all route - redirect to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
