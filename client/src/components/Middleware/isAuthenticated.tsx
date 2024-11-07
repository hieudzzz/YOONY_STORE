import Cookies from 'js-cookie';

const isAuthenticated = () => {
  const token = Cookies.get('authToken');
  const user = localStorage.getItem('userInfor');
  if (token && user) {
    return true;
  }
  return false;
};

export default isAuthenticated;
