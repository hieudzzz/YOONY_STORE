import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
const CheckPermission = () => {
  const {user} =useAuth()
  if (user) {
    return <Navigate to={'/'} /> 
  }else{
    return <Outlet />
  }
}

export default CheckPermission