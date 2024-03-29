import { FunctionComponent, useContext, useEffect, useState } from "react";
import User from "../interfaces/User";
import { getAllUsers, getUserById } from "../services/usersService";
import { SiteTheme } from "../App";
import { Link } from "react-router-dom";
import UserProfileModal from "./UserProfileModal";
import DeleteUserModal from "./DeleteUserModal";
import LockUserModal from "./LockUserModal";
import ChangeRoleModal from "./ChangeRoleModal";

interface UsersManagementProps {
  darkMode: any; render: Function; userInfo: any; userProfile: any; setUserProfile: Function; passwordShown: boolean; togglePassword: Function; dataUpdated: boolean;
}
const UsersManagement: FunctionComponent<UsersManagementProps> = ({ darkMode, render, userInfo, userProfile, setUserProfile, passwordShown, togglePassword, dataUpdated }) => {
  let theme = useContext(SiteTheme)
  let [users, setUsers] = useState<User[]>([])
  let [userProfileModal, setOpenUserProfileModal] = useState<boolean>(false);
  let [openDeleteUserModal, setOpenDeleteUserModal] = useState<boolean>(false);
  let [openLockUserModal, setOpenLockUserModal] = useState<boolean>(false);
  let [openChangeRoleModal, setOpenChangeRoleModal] = useState<boolean>(false);
  let updateUserProfile = (userId: string) => getUserById(userId).then((res) => { setUserProfile(res.data); }).catch((err) => console.log(err))

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data)).catch((err) => console.log((err)))
  }, [dataUpdated]);

  return <>
    <div className={`container mt-3 bCard ${theme}`}>
      <h5 className="display-4 mb-5">Manage site users</h5>
      <div className="mt-3">
        <table className={`table table-hover rounded ${darkMode ? "table-dark" : "table-secondary"}`} >
          <thead>
            <tr>
              <th scope="col">user_id</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Edit</th>
              <th scope="col">Blocked</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users ? (users.map((user: User) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name.firstName}</td>
                <td>{user.name.lastName}</td>
                <td>{user.email}</td>
                <td>
                  {user.email === "admin1@test.com" ? (user.role) : (<Link to="" onClick={() => {
                    updateUserProfile(user._id as string);
                    setOpenChangeRoleModal(true);
                  }}><i className="fa-solid fa-pen-to-square "
                  ></i> {user.role}</Link>)}
                </td>
                <td>
                  <Link to="" className=""><i className="fa-solid fa-pen-to-square "
                    onClick={() => {
                      updateUserProfile(user._id as string);
                      setOpenUserProfileModal(true);
                    }}
                  ></i> </Link>
                </td>
                <td>
                  {(user.email === "admin1@test.com" || user.email === userInfo.email) ? (<small>Can't lock this user!</small>) : (
                    user.isActive ? (<i className="fa-solid fa-lock-open text-success"
                      onClick={() => {
                        updateUserProfile(user._id as string);
                        setOpenLockUserModal(true)
                      }}
                    ></i>) : (<i className="fa-solid fa-lock text-danger" onClick={() => {
                      updateUserProfile(user._id as string);
                      setOpenLockUserModal(true);
                    }}></i>)
                  )}
                </td>
                <td>
                  {(user.email === "admin1@test.com" || user.email === userInfo.email) ? (<small>Do not delete!</small>) : (<Link to=""><i
                    className="fa-solid fa-trash text-secondary"
                    onClick={() => {
                      updateUserProfile(user._id as string);
                      setOpenDeleteUserModal(true);
                    }}
                  ></i></Link>)}
                </td>
              </tr>
            ))) : (
              <tr><td colSpan={4}>No users to show</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    <UserProfileModal
      show={userProfileModal}
      onHide={() => setOpenUserProfileModal(false)}
      render={render}
      userInfo={userInfo}
      userProfile={userProfile}
      setUserProfile={setUserProfile}
    />
    <DeleteUserModal
      show={openDeleteUserModal}
      onHide={() => setOpenDeleteUserModal(false)}
      render={render}
      userProfile={userProfile}
    />
    <LockUserModal
      show={openLockUserModal}
      onHide={() => setOpenLockUserModal(false)}
      render={render}
      userProfile={userProfile}
      isActive={userProfile.isActive}
    />
    <ChangeRoleModal
      show={openChangeRoleModal}
      onHide={() => setOpenChangeRoleModal(false)}
      render={render}
      userProfile={userProfile}
    />
  </>;
};

export default UsersManagement;
