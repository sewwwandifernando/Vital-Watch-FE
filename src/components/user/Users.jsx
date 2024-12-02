import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/scss/components/PatientList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "react-loader-spinner";
import { Modal, Button } from "rsuite";
import Swal from "sweetalert2";
import {
  faMagnifyingGlass,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetUserMatricesQuery,
} from "../../store/api/userListApi";
import { useDispatch } from "react-redux";

const Users = () => {
  const { data: users, isLoading, isError , refetch: refetchUsers} = useGetAllUsersQuery();
  const [deleteUserMutation] = useDeleteUserMutation();
  const dispatch = useDispatch();
  const { data: usermatrices , refetch : refetchMatricess} = useGetUserMatricesQuery();
  const [userList, setUserList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !isError) {
      setUserList(users.payload || []);
    }
  }, [isLoading, isError, users]);


  const handleDeleteUser = (userId) => {
    Swal.fire({
      icon: "warning",
      title: 'Do you want to delete this user?',
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, perform the deletion
        deleteConfirmedUser(userId);
      } else if (result.isDenied) {
        // User canceled the deletion
        Swal.fire('Deletion canceled', '', 'info');
      }
    });
  };
  
  const deleteConfirmedUser = async (userId) => {
    try {
      await deleteUserMutation(userId);
      refetchUsers();
      refetchMatricess();
      Swal.fire('User deleted', '', 'success');
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire('Error deleting user', '', 'error');
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Create a filtered user list based on the search query
  const filteredUserList = userList.filter((user) =>
    `${user.role} ${user.id} ${user.firstName} ${user.lastName} ${user.email} ${user.contactNo}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Update the userList state based on the search query
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="ptntlist-con">
      <div className="ptntlist-top">
        <div className="ptntlist-head">USERS</div>
        <div className="ptntlist-top-search">
          <input
            type="text"
            placeholder="Search by Role, Reg. No, Name, Email, or Contact No"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="ptntlist-top-search-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <Link to="/signIn" style={{ textDecoration: "none" }}>
          <button className="btn btn-dark ptntlist-top-add">Add User</button>
        </Link>
      </div>
      <div className="ptntlist-mid">
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Admins</p>
          <p className="ptntlist-mid-count">
            {usermatrices &&
              usermatrices.payload &&
              usermatrices.payload.admins}
          </p>
        </div>
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Doctors</p>
          <p className="ptntlist-mid-count">
            {usermatrices &&
              usermatrices.payload &&
              usermatrices.payload.doctors}
          </p>
        </div>
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Nurses</p>
          <p className="ptntlist-mid-count">
            {usermatrices &&
              usermatrices.payload &&
              usermatrices.payload.nurses}
          </p>
        </div>
      </div>
      <div className="ptntlist-btm">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>#</th>
              <th onClick={() => requestSort("role")} style={{ width: "12%" }}>
                ROLE
              </th>
              <th onClick={() => requestSort("regNo")} style={{ width: "10%" }}>
                REG NO.
              </th>
              <th
                onClick={() => requestSort("name")}
                style={{ width: "22%", textAlign: "left", paddingLeft: "4%" }}
              >
                NAME
              </th>
              <th
                onClick={() => requestSort("email")}
                style={{ width: "21%", textAlign: "left" }}
              >
                E-MAIL
              </th>
              <th
                onClick={() => requestSort("contact")}
                style={{ width: "12%" }}
              >
                CONTACT NO.
              </th>
              <th style={{ width: "15%" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7">
                  <ProgressBar
                    height="80"
                    width="80"
                    barColor="#766EAC"
                    borderColor="#000000"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="7">Failed to load...</td>
              </tr>
            ) : filteredUserList.length > 0 ? (
              filteredUserList.map((user, index) => (
                <tr className="hover-row" key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.role}</td>
                  <td>{user.id}</td>
                  <td style={{ textAlign: "left", paddingLeft: "4%" }}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={{ textAlign: "left" }}>{user.email}</td>
                  <td>{user.contactNo}</td>
                  <td>
                    <Link to={`/edit/${user.id}`}>
                      <button className="btn btn-outline-primary">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </Link>
                    <button
                      style={{ marginRight: "0px" }}
                      className="btn btn-outline-danger ptntlist-table-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
