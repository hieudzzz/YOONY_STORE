import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../interfaces/IUser";
import Cookies from "js-cookie";
import { message } from "antd";

interface AuthContextType {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_COOKIE_NAME = "authToken"; 
const USER_INFO_KEY = "userInfor";
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    checkAuthStatus();
    const intervalId = setInterval(checkAuthStatus, 500);
    return () => clearInterval(intervalId);
  }, []);

  const checkAuthStatus = () => {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const userInfo = localStorage.getItem(USER_INFO_KEY);

    if (!authCookie) {
      localStorage.removeItem(USER_INFO_KEY);
      setUser(null);
    } else if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    
    if(authCookie && !userInfo){
        Cookies.remove(AUTH_COOKIE_NAME);
        localStorage.removeItem(USER_INFO_KEY);
        setUser(null);
    }else if(!authCookie && userInfo){
        Cookies.remove(AUTH_COOKIE_NAME);
        localStorage.removeItem(USER_INFO_KEY);
        setUser(null);
    }
  };

  const login = (userData: IUser) => {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    localStorage.removeItem(USER_INFO_KEY);
    setUser(null);
    message.success("Đăng xuất thành công !");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
