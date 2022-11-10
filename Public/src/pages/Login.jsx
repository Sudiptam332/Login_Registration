import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./Register_Login.css";
import Logo from "../assets/logo.jpg";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        Username: "",
        Password: "",
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
            console.log("in validation", loginRoute);
            const {Password, Username} = values;
            const { data } = await axios.post(loginRoute, {
                Username,
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
        const {Password, Username,} = values;
        if(Password === "") {
            toast.error("Username and Password is Required.",
            toastOptions
            );
            return false;
        } 
        else if (Username.length === "" ) {
            toast.error("Username and Password is Required.", 
            toastOptions
            );
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
            <input type="text" placeholder='Username' name="Username" min = "3" onChange={(e) => handelChange(e)} />
            <input type="password" placeholder='Enter the Password' name="Password" onChange={(e) => handelChange(e)} />
            <button type="submit">LOG IN</button>
            <span>
                 Don't Have An Account? <Link to="/register">Register</Link>
            </span>
        </form>
    </FromContainer>
    <ToastContainer />
    </>
  )
}

const FromContainer = styled.div``;

export default Login