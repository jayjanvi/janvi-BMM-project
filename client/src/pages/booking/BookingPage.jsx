import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { AddBooking } from './AddBooking';
import { Footer } from '../../components/Footer';
import { BookingList } from './BookingList';
import { BookingListOthers } from './BookingListOthers';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { TiExport } from "react-icons/ti";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const BookingPage = () => {
  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenAddBooking, setIsOpenAddBooking] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [listLoader, setListLoader] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bookingResponse, setBookingResponse] = useState(null);
  const handleClose = () => setIsOpenAddBooking(false);
  const showAddBooking = () => setIsOpenAddBooking(true);
  const [handleRefresh, setHandleRefresh] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [showOthers, selectedMonth, selectedYear, isOpenAddBooking, handleRefresh]);

  const downloadExcel = () => {
    setListLoader(true);
    let formattedData = null;
    if (!showOthers) {
      formattedData = bookingResponse.data.map(item => ({
        "ID": item.id,
        "Employee Code": item.empCode,
        "Employee Name": item.empName,
        "Department": item.department,
        "Meal Type": item.mealType,
        "Total Meals": item.totalMeals,
        "Meal Dates": item.mealDate.join(', ')
      }));
    } else {
      formattedData = bookingResponse.data.map(item => ({
        "Booking Category": item.bookingCategory,
        "Date": item.days.join(', '),
        "Counts": item.days.length,
        "Notes": item.notes,
      }));
    }

    // Create a worksheet from the formatted data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert the workbook to a blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Save the blob as an Excel file
    saveAs(blob, 'Bookings.xlsx');
    toast.success("Booking Data Downloaded Successfully");
    setListLoader(false);

  };

  const fetchBooking = async () => {
    try {
      setListLoader(true);
      const response = await bookingService.bookingList({ isEmployee: !showOthers, date: `${selectedMonth}-${selectedYear}` })// month: selectedMonth, year: selectedYear })//date:'May-2024' });
      setBookingResponse(response);
      setListLoader(false);
    } catch (error) {
      setListLoader(false);
      toast.error("Failed to load booking");
    }
  };

  const toggleShowOthers = (data) => {
    if (data === "others") {
      setShowOthers(true);
    } else {
      setShowOthers(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const getFilteredBookings = () => {
    if (!bookingResponse || !bookingResponse.data) return [];

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    return bookingResponse.data.filter(booking =>
      (booking.empName && booking.empName.toLowerCase().includes(lowerCaseSearchQuery)) ||
      (booking.department && booking.department.toLowerCase().includes(lowerCaseSearchQuery)) ||
      (booking.mealType && booking.mealType.toLowerCase().includes(lowerCaseSearchQuery)) ||
      (booking.bookingCategory && booking.bookingCategory.toLowerCase().includes(lowerCaseSearchQuery)) ||
      (booking.notes && booking.notes.toLowerCase().includes(lowerCaseSearchQuery))
    );
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="container-fluid">
          <div className="container pt-30 mb-30">
            <div className="container-head">
              <div className="container-left">
                <h3 className="container-title">Booking List</h3>
              </div>
              <div className="container-right">
                <button className="btn btn-primary" onClick={showAddBooking}>
                  Add Booking</button>
              </div>
            </div>
          </div>
        </div>

        <div className="content-tab">
          <a className={`content-tab_link ${showOthers ? "" : "active"}`} onClick={toggleShowOthers} href="#">
            Rishabh Employees
          </a>
          <a className={`content-tab_link ${showOthers ? "active" : ""}`} onClick={() => toggleShowOthers("others")} href="#">
            Others
          </a>
        </div>
        <div className="left-aligned-content">
          <input
            className="search-booking"
            type="text"
            placeholder="Search Booking"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />

          <div className="tooltip-container">
            <TiExport size={28} onClick={downloadExcel} />
            <span className="tooltip-text">
              Click to download the booking data as an Excel file
            </span>
          </div>

          <select value={selectedMonth} onChange={(e) => handleMonthChange(e)}>
            <option value="">Select Month</option>
            <option value="All">All</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => handleYearChange(e)}>
            <option value="">Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <ClipLoader margin={5} cssOverride={{ 'marginLeft': '50%', 'marginTop': '2%' }} loading={listLoader} />
        {!showOthers ? <BookingList BookingResponse={{ data: getFilteredBookings() }} handleRefresh={setHandleRefresh} /> :
          <BookingListOthers BookingResponse={{ data: getFilteredBookings() }} handleRefresh={setHandleRefresh} />}

        <AddBooking isOpen={isOpenAddBooking} handleClose={handleClose} />
        <Footer />
      </div>
    </>
  );
};