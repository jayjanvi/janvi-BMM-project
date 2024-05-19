import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { AddBooking } from './AddBooking'; // Import the AddBooking component
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
  const [isOpenAddBooking, setIsOpenAddBooking] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [listLoader, setListLoader] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bookingResponse, setBookingResponse] = useState(null);
  const handleClose = () => setIsOpenAddBooking(false);
  const handleShow = () => setIsOpenAddBooking(true);

  useEffect(() => {
    // Fetch bookings list when the component mounts
    fetchBooking();
  }, [showOthers, selectedMonth, selectedYear]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const downloadExcel = () => {
    // Transform data into a format compatible with XLSX
    let formattedData = null;
    if (!showOthers) {
      formattedData = bookingResponse.data.map(item => ({
        "ID": item.id,
        "Employee Code": item.empCode,
        "Employee Name": item.empName,
        "Department": item.department,
        "Meal Type": item.mealType,
        "Start Date": formatDate(item.startDate),
        "End Date": formatDate(item.endDate),
        "Total Meals": item.totalMeals,
        "Meal Dates": item.mealDate.join(', ')
      }));
    } else {
      formattedData = bookingResponse.data.map(item => ({
        "Booking Category": item.bookingCategory,
        "Date": item.date,
        "Counts": item.mealDate.join(', '),
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
    toast.success("Booking Data Downloaded Successfully")
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

  const handleFilter = () => {
    fetchBooking();
  };

  const handleMonthChange = (e) => {
    console.log(Number(e.target.value));
    setSelectedMonth(Number(e.target.value));
    // fetchBooking();
  };

  const handleYearChange = (e) => {
    // setSelectedMonth(e.target.value);
    setSelectedYear(e.target.value)
    // fetchBooking();
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
                <button className="btn btn-primary" onClick={downloadExcel}>
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
          <TiExport size={18} onClick={downloadExcel} />
        </div>
        <div className="left-aligned-content">
          <select value={selectedMonth} onChange={(e) => handleMonthChange(e)}>

            <option value="">Select Month</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">Auguest</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>

          </select>
          <select value={selectedYear} onChange={(e) => handleYearChange}>
            <option value="">Select Year</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>

          </select>
          {/* <button className='btn-primary-filter' onClick={handleFilter}>Filter</button> */}

        </div>
        <ClipLoader margin={5} cssOverride={{ 'marginLeft': '50%', 'marginTop': '2%' }} loading={listLoader} />
        {!showOthers ? <BookingList BookingResponse={bookingResponse} /> : <BookingListOthers BookingResponse={bookingResponse} />}

        <AddBooking isOpen={isOpenAddBooking} handleClose={handleClose} />
        <Footer />
      </div>
    </>
  );
};