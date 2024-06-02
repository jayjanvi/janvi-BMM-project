import { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import { ClipLoader } from 'react-spinners';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import disableDateService from "../../services/disableDateService";

export const AddDisableDate = ({ show, handleClose }) => {

    const initialFormData = {
        startDate: '',
        endDate: '',
        reason: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [disableDates, setDisableDates] = useState(null)

    useEffect(() => {
        fetchDisableDate();
    }, []);

    const fetchDisableDate = async () => {
        const response = await disableDateService.disableDateList();
        console.log('res', response);
        setDisableDates(response.data);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        if (!formData.reason) {
            newErrors.reason = 'Reason is required';
        }
        if (!startDate || !endDate) {
            newErrors.date = 'Both start and end dates are required';
        } else if (startDate > endDate) {
            newErrors.date = 'Start date cannot be after end date';
        }
        setErrors(newErrors);

        // If there are no errors, create the user
        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                const response = await disableDateService.addDisableDate(formData);
                if (response.status === 200) {
                    setTimeout(() => {
                        handleModalClose();
                        setFormData(initialFormData);
                        window.location.reload();
                        setLoading(false);
                    }, 2000)
                    toast.success("Disable date added successfully");
                } else {
                    toast.error("Sorry! disable date not created");
                    setLoading(false);
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                    setLoading(false);
                }
            }
            setErrors(newErrors);
            console.log(formData);
        };
    }
    const handleModalClose = () => {
        handleClose();
        setFormData(initialFormData);
        setStartDate(new Date());
        setEndDate(new Date());
        setLoading(false);
        setErrors({});
    };

    const isWeekdayWithHolidays = (date) => {
        console.log('disableDates', disableDates);
        const day = date.getDay();
        // Check if the date falls on a weekend (Saturday or Sunday)
        if (day === 0 || day === 6) {
            return false; // Disable weekends
        }
        return isHoliday(date);
    };

    const isHoliday = date => {
        for (const holiday of disableDates) {
            const [start, end] = holiday.date.split('-');
            const [startDay, startMonth, startYear] = start.split('/');
            const [endDay, endMonth, endYear] = end.split('/');
            if (
                date.getMonth() === parseInt(startMonth, 10) - 1 &&
                date.getFullYear() === parseInt(startYear, 10) &&
                date.getDate() >= parseInt(startDay, 10) &&
                date.getDate() <= parseInt(endDay, 10)
            ) {
                return false;
            }
        }
        return true;
    };

    return (
        <Modal show={show} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Disable Dates</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Date (s)</label>
                        <div className="input-group date-picker-input">
                            <DatePicker
                                startDate={startDate}
                                id={"datepicker-input"}
                                endDate={endDate}
                                onChange={(dates) => {
                                    const [start, end] = dates;
                                    setStartDate(start);
                                    setEndDate(end);
                                    setFormData(prevState => ({
                                        ...prevState,
                                        startDate: start,
                                        endDate: end,
                                    }));
                                }}
                                selectsRange
                                dateFormat="dd-MM-yyyy"
                                minDate={new Date()}
                                filterDate={isWeekdayWithHolidays}
                                placeholderText="Select Date Range"
                                className="form-control border-right-0 datepicker-icn" />
                            <div className="input-group-append bg-transparent">
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Reason</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Reason of Disable Date"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange} />
                        {errors.reason && <div className="text-danger">{errors.reason}</div>}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ClipLoader color={'#ffffff'} loading={loading} size={25} />
                    ) : (
                        "Add"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};