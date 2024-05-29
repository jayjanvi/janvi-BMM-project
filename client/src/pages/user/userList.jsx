import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import userService from "../../services/userService";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; 

export const UserList = ({ userResponse, handleRefresh }) => {

  const [users, setUsers] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showOthers, setShowOthers] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    if (userResponse) {
      setCurrentPage(1)
      if (showOthers) {
        setUsers(userResponse.data.filter(user => user.isEmployee === false));
      } else {
        setUsers(userResponse.data.filter(user => user.isEmployee === true));
      }
    }
  }, [userResponse, showOthers]);

  const toggleShowOthers = (data) => {
    if (data === "others") {
      setShowOthers(true);
    } else {
      setShowOthers(false);
    }
  };

  // const sortedUsers = users.sort((a, b) => {
  //   if (!sortConfig) {
  //     return 0;
  //   }
  //   const key = sortConfig.key;
  //   const direction = sortConfig.direction === 'asc' ? 1 : -1;
  //   if (a[key] < b[key]) return -1 * direction;
  //   if (a[key] > b[key]) return 1 * direction;
  //   return 0;
  // });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteUsers = (userId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this User?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            userService.deleteUser(userId)
              .then(response => {
                handleRefresh(response);
                toast.success("User deleted successfully!");
              })
              .catch(error => {
                toast.error("Failed to delete user");
              });
          }
        },
        {
          label: "No",
          onClick: () => { }
        }
      ]
    });
  }

  return (
    <>
      <div className="content-tab">
        <a className={`content-tab_link ${showOthers ? "" : "active"}`} onClick={toggleShowOthers} href="#">
          Rishabh Employees
        </a>
        <a className={`content-tab_link ${showOthers ? "active" : ""}`} onClick={() => toggleShowOthers("others")} href="#">
          Others
        </a>
      </div>
      <Table hover className="table-custom">
        <thead>
          <tr>
            <th>No.</th>
            <th>Username</th>
            <th >Email  </th>
            <th >Phone</th>
            {!showOthers && <th> Department </th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              {!showOthers && <td>{user.department}</td>}
              <td><i style={{ cursor: 'pointer', color:'red' }} onClick={() => deleteUsers(user._id)}><MdDelete size={18} /></i></td>
            </tr>
          ))}
          
        </tbody>
      </Table>
      <div className="d-flex justify-content-end">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)} >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={indexOfLastUser >= users.length} />
        </Pagination>
      </div>
    </>
  );
};