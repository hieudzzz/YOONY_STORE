import { Outlet } from "react-router-dom";
import RoleProvider from "../../providers/RoleProvider";
import ModelProvider from "../../providers/ModelProvider";
import RoleHasModelProvider from "../../providers/RoleHasModelProvider";
const LayoutUsersAdmin = () => {
  return (
    <RoleProvider>
      <ModelProvider>
        <RoleHasModelProvider>
          <div>
            <Outlet />
          </div>
        </RoleHasModelProvider>
      </ModelProvider>
    </RoleProvider>
  );
};

export default LayoutUsersAdmin;
