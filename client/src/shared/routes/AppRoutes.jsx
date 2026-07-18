import { Route, Routes } from 'react-router-dom';
import UserRoutes from '../../user/routes/UserRoutes';
import AdminRoutes from '../../admin/routes/AdminRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />

      <Route path="/login" element={<h1>Login</h1>} />
      
      <Route path="/user/*" element={<UserRoutes />} />
      
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}