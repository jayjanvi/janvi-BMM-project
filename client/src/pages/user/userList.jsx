import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import UserService from '../../services/userService';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export const UserList = () => {

  const [users, setUsers] = useState([]); // Number of users to display per page  
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showOthers, setShowOthers] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    // Fetch users list when the component mounts
    fetchUsers();
  }, [showOthers]);

  const toggleShowOthers = () => {
    setShowOthers(prevState => !prevState); // Toggles the state between true and false
  };

  const fetchUsers = async () => {
    try {
      const response = await UserService.userList();
      setCurrentPage(1)
      if (showOthers) {
        setUsers(response.data.filter(user => user.isEmployee === false));
      } else {
        setUsers(response.data.filter(user => user.isEmployee === true));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users where department is not null
  // const employees = users.filter(user => user.isEmployee === true);

  // Sort users by username
  // const sortedUsers = filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
  const sortedUsers = users.sort((a, b) => {
    if (!sortConfig) {
      return 0;
    }
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    if (a[key] < b[key]) return -1 * direction;
    if (a[key] > b[key]) return 1 * direction;
    return 0;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    return (
      sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
    );
  };

  return (
    <>
      <div className="content-tab">
        <a className={`content-tab_link ${showOthers ? "" : "active"}`} onClick={toggleShowOthers} href="#">
          Rishabh Employees
        </a>
        <a className={`content-tab_link ${showOthers ? "active" : ""}`} onClick={toggleShowOthers} href="#">
          Others
        </a>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No.</th>
            <th onClick={() => handleSort('username')}>Username{renderSortIcon('username')}</th>
            <th onClick={() => handleSort('email')}>Email {renderSortIcon('email')} </th>
            <th onClick={() => handleSort('phone')}>Phone {renderSortIcon('phone')}</th>
            {!showOthers && <th onClick={() => handleSort('department')}>Department {renderSortIcon('department')}</th>}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            // user.department && (
            <tr key={user._id}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.department}</td>
            </tr>
            // )
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: Math.ceil(sortedUsers.length / usersPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)} >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={indexOfLastUser >= sortedUsers.length} />
        </Pagination>
      </div>
    </>
  );
};