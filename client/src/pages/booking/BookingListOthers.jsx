import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import bookingService from "../../services/bookingService";
import { toast } from 'react-toastify';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Importing css


export const BookingListOthers = ({ BookingResponse }) => {

    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [BookingsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    useEffect(() => {
        if (BookingResponse) {
            setCurrentPage(1)
            setBookings(BookingResponse.data);
        }
    }, [BookingResponse]);

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
                    toast.success("Booking deleted successfully"); 
                    setTimeout(() => {
                        window.location.reload(); // Reloading the page to reflect changes
                      }, 2000); 
                  })
                  .catch(error => {
                    toast.error("Failed to delete booking");
                  });
              }
            },
            {
              label: "No",
              onClick: () => {}
            }
          ]
        });
      }

    return (
        <>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {BookingResponse && (
                                <>
                                    <th>Booking Category</th>
                                    <th onClick={() => handleSort('date')}>Date{renderSortIcon('date')}</th>
                                    <th onClick={() => handleSort('bookingCount')}>Booking Count{renderSortIcon('bookingCount')}</th>
                                    <th onClick={() => handleSort('notes')}>Notes{renderSortIcon('notes')}</th>
                                    <th>Action</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings.map((booking, index) => (
                            <tr key={booking._id}>
                                <td>{booking.bookingCategory}</td>
                                <td>{booking.startDate}</td>
                                <td>{booking.bookingCount}</td>
                                <td>{booking.notes}</td>
                                <td><i style={{ cursor: 'pointer' }} onClick={() => deleteBooking(booking._id)}><MdDelete size={18} /></i></td>
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
