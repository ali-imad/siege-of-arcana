import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            if (error.response.status === 401) {
                toast.error('Unauthorized: Invalid credentials', {
                    toastId: 'invalid_cred'
                });
            } else {
                toast.error(`Error: ${error.response.status} - ${error.response.data}`);
            }
        } else if (error.request) {
            toast.error('No response received from server. Please try again.');
        } else {
            toast.error(`Error: ${error.message}`);
        }
    } else {
        toast.error('An unexpected error occurred');
    }
    console.error('Error:', error);
};

export const getUser = async (username, password) => {
    const url = `http://localhost:5151/api/user/login`;
    if (!username || !password) {
        toast.error('Username and password are required', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: 'missing_cred'
        });
        return;
    }
    try {
        const response = await axios.post(url, { username, password });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const getEmail = async (email, password) => {
    const url = `http://localhost:5151/api/user/register`;
    if (!email || !password) {
        toast.error('Username and password are required', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: 'missing_cred'
        });
        return;
    }
    try {
        const response = await axios.post(url, { email, password });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

const LoginForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const startLogin = async (event) => {
        event.preventDefault();

        try {
            console.log('Starting login process...');

            let user;
            try {
                const response = await getUser(username, password);
                user = response.user;
                console.log('User retrieved by username:', user);
            } catch (error) {
                console.log('Username not found, checking by email...');
                const emailResponse = await getEmail(username, password);
                user = emailResponse.user;
                console.log('User retrieved by email:', user);
            }

            if (user) {
                const { username: uname, email: uemail, password: upass } = user;
                if ((uname === username || uemail === username) && upass === password) {
                    console.log('Login successful');
                    
                    toast.success('Successful Login!', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });

                    localStorage.setItem('user', JSON.stringify(user));
                    props.onLogin();
                    // go to sleep
                    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => { navigate('/profile'); })
                } else if (username === uname || username === uemail) {
                    console.log('Incorrect password');
                    toast.error('Incorrect Password. Please try again.', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                }
            } else {
                console.log('Username or email not found. Please try again.');
                toast.error('Username or email not found. Please try again.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={startLogin} className="bg-white p-8 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Log In</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1">Username or Email</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsername}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePassword}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-soa-accent text-white hover:bg-tan-400 rounded"
                >
                    Log In
                </button>
            </form>
            <br />
            <br />
            <Link
                to="/auth"
                className="order-3 transition-colors hover:text-soa-accent"
            >
                <button className="bg-soa-accent text-white p-2 px-4 rounded-lg">
                    {' '}
                    Go Back{' '}
                </button>
            </Link>
            <ToastContainer/>
        </div>
    );
};

export default LoginForm;
