import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Footer } from '../../components/Footer';
import Pagination from 'react-bootstrap/Pagination';
import { Navbar } from "../../components/Navbar";
import Button from "react-bootstrap/esm/Button";
import {AddDisableDate} from "./AddDisableDate"
import disableDateService from "../../services/disableDateService";

export const DisableDateList = () => {

  const [disableDates, setDisableDates] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [disableDatesPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
          fetchDisableDates();
        }, []);

        const fetchDisableDates = async () => {
            try {
              const response = await disableDateService.disableDateList();
              setDisableDates(response.data);
            } catch (error) {
              console.error('Error fetching disable dates:', error);
            } finally {
              setLoading(false);
            }
          };

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };

     
  const indexOfLastDisableDate = currentPage * disableDatesPerPage;
  const indexOfFirstDisableDate = indexOfLastDisableDate - disableDatesPerPage;
  const currentDisableDates = disableDates.slice(indexOfFirstDisableDate, indexOfLastDisableDate);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="container pt-30 mb-30">
                    <div className="container-head">
                        <div className="container-left">
                            <h3 className="container-title">Disable Date List</h3>
                        </div>
                        <Button as="a" variant="primary"onClick={handleShow} >
                            Add Disable Date
                        </Button>
                    </div>
                </div>
            </div>
            <Table hover className="table-custom">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Disable Date</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                  <tbody>
              {currentDisableDates && currentDisableDates.map((disableDate, index) => (
                <tr key={disableDate._id}>
                  <td>{index + 1 + indexOfFirstDisableDate}</td>
                  <td>{disableDate.date}</td>
                  {/* <td>{new Date(disableDate.date).toLocaleDateString()}</td> */}
                  <td>{disableDate.reason}</td>
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
          {Array.from({ length: Math.ceil(disableDates.length / disableDatesPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)} >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={indexOfLastDisableDate >= disableDates.length} />
        </Pagination>
      </div>
       <AddDisableDate key={show.toString()} show={show} handleClose={handleClose} onAddDisableDate={AddDisableDate} />
       <Footer />
        </>
    );
};