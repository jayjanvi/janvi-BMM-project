import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import { Navbar } from "../../components/Navbar";
import { UserList } from "./userList";
import { Footer } from "../../components/Footer";
import { AddUser } from "./AddUser";
import userService from "../../services/userService";
import { ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export const UserFile = () => {
    useEffect(() => {
        // Fetch users list when the component mounts
        fetchUsers();
    }, []);
    const [show, setShow] = useState(false);
    const [userResponse, setUserResponse] = useState(null);
    const [listLoader, setListLoader] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };

    // fetch user list
    const fetchUsers = async () => {
        try {
            setListLoader(true);
            const response = await userService.userList();
            setUserResponse(response);
            setListLoader(false);
        } catch (error) {
            setListLoader(false);
            console.error("Error fetching users:", error);
        }
    };


    // Add User
    const addUser = async (formData) => {
        try {
            console.log(formData);
            const response = await userService.addUser(formData);
            if (response.status === 200) {
                fetchUsers();
                toast.success("User added successfully!");
            } else {
                toast.error("Sorry! User not created");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="container pt-30 mb-30">
                    <div className="container-head">
                        <div className="container-left">
                            <h3 className="container-title">User List</h3>
                        </div>
                        <Button as="a" variant="primary" onClick={handleShow}>
                            Add User
                        </Button>
                    </div>
                </div>
            </div>
            <ClipLoader margin={5} cssOverride={{'marginLeft':'50%','marginTop':'2%' }} loading={listLoader} />
      
            {userResponse && <UserList userResponse={userResponse} />}
            <AddUser key={show.toString()} show={show} handleClose={handleClose} onAddUser={addUser} />
            <Footer />
            <ToastContainer />
        </>
    );
}