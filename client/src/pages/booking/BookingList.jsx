import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export const BookingList = ({ BookingResponse }) => {

  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [BookingsPerPage] = useState(10);
  const [showOthers, setShowOthers] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    console.log('list', BookingResponse);
    if (BookingResponse) {
      setCurrentPage(1)
      // setBookings(BookingResponse.data);
      // if (showOthers) {
        setBookings(BookingResponse.data);
      // }
      //  else {
      //   setBookings(BookingResponse.data.filter(bookings => bookings.category === "employees" || bookings.category === "non_employees"));
       
      // }
    }
  }, [BookingResponse, showOthers]);

  const toggleShowOthers = (data) => {
    if (data === "others") {
      setShowOthers(true);
    } else {
      setShowOthers(false);
    }
  };

  const sortedBookings = bookings.sort((a, b) => {
    if (!sortConfig) {
      return 0;
    }
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    if (a[key] < b[key]) return -1 * direction;
    if (a[key] > b[key]) return 1 * direction;
    return 0;
  });

  const indexOfLastUser = currentPage * BookingsPerPage;
  const indexOfFirstUser = indexOfLastUser - BookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstUser, indexOfLastUser);

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) { return <FaSort />; }
    return (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />);
  };

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
      <div>

      <Table striped bordered hover>
          <thead>
            <tr>
            {BookingResponse && (
                <>
              <th onClick={() => handleSort('code')}>Employee Code{renderSortIcon('code')}</th>
              <th onClick={() => handleSort('name')}>Employee Name {renderSortIcon('name')} </th>
              <th onClick={() => handleSort('department')}>Department{renderSortIcon('department')} </th>
              <th>Meal Type</th>
              <th onClick={() => handleSort('mealsBooked')}>Total Meals Booked{renderSortIcon('mealsBooked')} </th>
              <th className="mealDates" onClick={() => handleSort('mealDates')}>Meal Dates{renderSortIcon('mealDates')}</th>
              <th>Actions</th>
             </>
            )}
              {showOthers && (
                <>
                  <th onClick={() => handleSort('bookingCount')}>Booking Count{renderSortIcon('bookingCount')}</th>
                  <th onClick={() => handleSort('notes')}>Notes{renderSortIcon('notes')}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{booking.empCode}</td>
                <td>{booking.empName}</td>
                <td>{booking.department}</td>
                <td>{booking.mealType}</td>
                <td>{booking.totalMeals}</td>
                <td>{booking.mealDate.join(', ')}</td>
                <td><i className="icon-bin"></i>delete</td>
                {showOthers && (
                  <>
                    <td>{booking.bookingCount}</td>
                    <td>{booking.notes}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        {/* <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('code')}>Employee Code{renderSortIcon('code')}</th>
              <th onClick={() => handleSort('name')}>Employee Name {renderSortIcon('name')} </th>
              <th onClick={() => handleSort('bookingCategory')}>Booking_Category {renderSortIcon('bookingCategory')}</th>
              <th onClick={() => handleSort('mealType')}>Meal Type{renderSortIcon('mealType')}</th>
             
              {showOthers && (
                <>
                  <th onClick={() => handleSort('Booking_Category')}>Booking Category{renderSortIcon('Booking_Category')}</th>
                  <th onClick={() => handleSort('bookingCount')}>Booking Count{renderSortIcon('bookingCount')}</th>
                  <th onClick={() => handleSort('notes')}>Notes{renderSortIcon('notes')}</th>
                </>
              )}

            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{booking.code}</td>
                <td>{booking.name}</td>
                <td>{booking.category}</td>
                <td>{booking.mealType}</td>
                <td>{booking.bookingCount}</td>
                <td>{booking.Meal_Date}</td>
                <td>{booking.Meal_Date}</td>
                {showOthers && (
                  <>
                    <td>{booking.Booking_Category}</td>
                    <td>{booking.bookingCount}</td>
                    <td>{booking.notes}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table> */}
        <div className="d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: Math.ceil(sortedBookings.length / BookingsPerPage) }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)} >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastUser >= sortedBookings.length} />
          </Pagination>
        </div>
      </div>
    </>

  );
};


