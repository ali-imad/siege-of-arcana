import {useState} from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const registerUser = async (e: string, u: string, p: string) => {
        const url = `http://localhost:5151/api/user/create`;
        try {
          const userData = {
            email: e,
            name: u,
            password: p,
          };
      
          const response = await axios.post(url, userData);
          return response.data;
        } catch (error) {
          console.error('Error registering user:', error);
          throw error;
        }
      };


    const startRegister = async (event) => {
      event.preventDefault();

      const isValidEmail = (email:string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
      };

      const isValidUsername = (username:string) => {
          const usernameRegex = /^[a-zA-Z0-9]+$/;
          return usernameRegex.test(username);
      };

      const isValidPassword = (password:string) => {
          return password.length >= 8;
      };

      try {
          console.log("Starting registration process...");

          if (!isValidEmail(email)) {
              setErrorMessage("Invalid email format.");
              return;
          }

          if (!isValidUsername(username)) {
              setErrorMessage("Username must be alphanumeric.");
              return;
          }

          if (!isValidPassword(password)) {
              setErrorMessage("Password must be at least 8 characters long.");
              return;
          }

          const response = await registerUser(email, username, password);

          if (response) {
              setErrorMessage("Successful registration.");
              navigate('login');
          }

      } catch (error) {
          console.error('Error', error);
          setErrorMessage('An error occurred during the registration process. Please try again later.');
      }
  };


    const handleUsername = (event) => {
        setUsername(event.target.value);
      };

    const handleEmail = (event) => {
        setEmail(event.target.value);
      };

    const handlePassword = (event) => {
        setPassword(event.target.value);
      };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <form onSubmit={startRegister} className="bg-white p-8 rounded-lg shadow-md w-80">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">Email</label>
              <input
                type="text"
                id="username"
                value={email}
                onChange={handleEmail}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsername}
                className="w-full px-3 py-2 border rounded"
                required
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
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-soa-accent text-white hover:bg-tan-400 rounded"
            >
              Register
            </button>
          </form>
          <br></br>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <br></br>
          <Link
          to='/auth'
          className='order-3 transition-colors hover:text-soa-accent'
        >
          <button className='bg-soa-accent text-white p-2 px-4 rounded-lg'>
            {' '}
            Go Back{' '}
          </button>
        </Link>
        </div>
      );
}

export default RegisterForm;