import UserPovider from "../../contexts/UserContext";
import UserAdmin from "../../pages/admin/users/UserAdmin";

const LayoutUsersAdmin = () => {
  return (
    <UserPovider>
      <UserAdmin />
    </UserPovider>
  );
};

export default LayoutUsersAdmin;
