import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./Register_Login.css";
import Logo from "../assets/logo.jpg";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

function Register() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        Username: "",
        Email_ID: "",
        Password: "",
        Confirm_Password: "",

    });
    
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    }

    useEffect(() => {
        if(localStorage.getItem('chat-app-user')) {
          navigate("/");
        }
      },[])

    const handelSubmit = async (event) => {
        event.preventDefault();
        if (handelValidation()) {
            console.log("in validation", registerRoute);
            const {Password, Username, Email_ID} = values;
            const { data } = await axios.post(registerRoute, {
                Username,
                Email_ID,
                Password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate("/");
            }
        }
    };
    
    const handelValidation = () => {
        const {Password,  Confirm_Password, Username, Email_ID} = values;
        if(Password !== Confirm_Password) {
            toast.error("Password and Confirm Password Should Be Same.",
            toastOptions
            );
            return false;
        } 
        else if (Password.length < 8) {
            toast.error("Password should be Greater then or Equal to 8 Characters.", toastOptions);
            return false;
        }
        else if (Username.length < 3) {
            toast.error("Username should be Greater then 3 Characters.", toastOptions);
            return false;
        }
        else if (Email_ID === "") {
            toast.error("Email Required.", toastOptions);
            return false;
        }
        return true;
    };

    const handelChange = (event) => {
        setValues({ ...values,[event.target.name]:event.target.value});
    };
  return (
    <>
    <FromContainer className='FromContainer'>
        <form className="form" onSubmit={(event) => handelSubmit(event)}>;
            <div className="brand">
                <img src={Logo} alt="Logo" />;
                <h1>Hi Buddy</h1>;
            </div>
            <input type="text" placeholder='Username' name="Username" onChange={(e) => handelChange(e)} />
            <input type="email" placeholder='Email Address' name="Email_ID" onChange={(e) => handelChange(e)} />
            <input type="password" placeholder='Enter the Password' name="Password" onChange={(e) => handelChange(e)} />
            <input type="password" placeholder='Re-Enter Password' name="Confirm_Password" onChange={(e) => handelChange(e)} />
            <button type="submit">Create User</button>
            <span>
                 Already Have An Account? <Link to="/">Login</Link>
            </span>
        </form>
    </FromContainer>
    <ToastContainer />
    </>
  )
}

const FromContainer = styled.div``;

export default Register
