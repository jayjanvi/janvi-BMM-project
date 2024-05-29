import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { MdDelete } from "react-icons/md";
import bookingService from "../../services/bookingService";
  import { toast } from 'react-toastify';
  import { confirmAlert } from "react-confirm-alert";
  import "react-confirm-alert/src/react-confirm-alert.css"; 

export const BookingList = ({ BookingResponse, handleRefresh}) => {

  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [BookingsPerPage] = useState(10);

  useEffect(() => {
    if (BookingResponse) {
      setCurrentPage(1)
      setBookings(BookingResponse.data);
    }
  }, [BookingResponse]);

  // const sortedBookings = bookings.sort((a, b) => {
  //   if (!sortConfig) {
  //     return 0;
  //   }
  //   const key = sortConfig.key;
  //   const direction = sortConfig.direction === 'asc' ? 1 : -1;
  //   if (a[key] < b[key]) return -1 * direction;
  //   if (a[key] > b[key]) return 1 * direction;
  //   return 0;
  // });

  const indexOfLastUser = currentPage * BookingsPerPage;
  const indexOfFirstUser = indexOfLastUser - BookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstUser, indexOfLastUser);

  // const renderSortIcon = (key) => {
  //   if (!sortConfig || sortConfig.key !== key) { return <FaSort />; }
  //   return (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />);
  // };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const handleSort = (key) => {
  //   let direction = 'asc';
  //   if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
  //   setSortConfig({ key, direction });
  // };

  const deleteBooking = (bookingId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this booking?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            bookingService.deleteBooking(bookingId)
              .then(response => {
                handleRefresh(response);
                toast.success("Booking deleted successfully");
              })
              .catch(error => {
                toast.error("Failed to delete booking");
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
      <div>
        <Table   hover className="table-custom" >
          <thead>
            <tr>
              {BookingResponse && (
                <>
                  <th>Employee Code</th>
                  <th>Employee Name</th>
                  <th>Department </th>
                  <th>Meal Type</th>
                  <th>Total Meals Booked </th>
                  <th>Meal Dates</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.empCode}</td>
                <td>{booking.empName}</td>
                <td>{booking.department}</td>
                <td>{booking.mealType}</td>
                <td>{booking.mealDate && booking.mealDate.length}</td>
                <td>{booking.mealDate && booking.mealDate.join(', ')}</td>
                <td><i style={{ cursor: 'pointer', color:'red' }} onClick={() => deleteBooking(booking.id)}><MdDelete size={18} /></i></td>
              </tr>
            ))}
          </tbody>
        </Table>
        {currentBookings.length === 0 ? 
            <h5>No booking found!</h5> : ""}
        <div className="d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: Math.ceil(bookings.length / BookingsPerPage) }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)} >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastUser >= bookings.length} />
          </Pagination>
        </div>
      </div>
    </>
  );
};
