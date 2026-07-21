import { Navigate, Route, Routes } from 'react-router-dom';
import UserRoutes from '../../user/routes/UserRoutes';
import AdminRoutes from '../../admin/routes/AdminRoutes';
import LoginForm from '../pages/Login/LoginForm';
import RegisterForm from '../pages/Register/Register';
import OTP from '../pages/OTP/OTP';
import RequireAuth from '../components/RequireAuth';
import PersistLogin from '../components/PersistsLogin';

export default function AppRoutes() {
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path='/verify-otp' element={<OTP />} />
      
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={["user"]} />}>
          <Route path="/user/*" element={<UserRoutes />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>
      </Route>
    </Routes>
  )
}