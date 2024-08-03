import {useState} from "react";
import axios from 'axios';

const BE_URL = import.meta.env.VITE_BE_ROUTE;

const AuthScreen = ({ onLogin, onRegister }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <p className="text-center mb-4">
          You are not logged in. Please log in or create an account.
        </p>
        <button
          onClick={onLogin}
          className="w-full mb-2 py-2 px-4 bg-yellow-300 hover:bg-yellow-400 rounded"
        >
          Log In
        </button>
        <button
          onClick={onRegister}
          className="w-full py-2 px-4 bg-green-300 hover:bg-green-400 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );


    const getUser = async (u: string) => {
        const url = `${BE_URL}/api/user/name/${u}`;
      console.log(url)
        try {
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        console.error('Error getting user:', error);
        }
    };

    const getEmail = async (e: string) => {
      const url = `${BE_URL}/api/user/email/${e}`;
      console.log(url)
      try {
      const response = await axios.get(url);
      return response.data;
      } catch (error) {
      console.error('Error getting email:', error);
      }
  };


const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const startLogin = async (event) => {
      event.preventDefault();

      try {
          console.log("Starting login process...");

          const response = await getUser(username);
          const user = response.user; // Access the nested user object
          console.log("User retrieved by username:", user);

          if (user) {
              const { username: uname, password: upass } = user;
              if (uname === username) {
                  if (upass === password) {
                      console.log("Login successful with username");
                      setErrorMessage("Successful login.")
                      // Perform successful login actions here
                      return;
                  } else {
                      console.log("Incorrect password");
                      setErrorMessage("Incorrect Password. Please try again.")
                      return;
                  }
              }
          }

          console.log("Username not found, checking by email...");

          const emailResponse = await getEmail(username);
          const emailUser = emailResponse.user; // Access the nested user object
          console.log("User retrieved by email:", emailUser);

          if (emailUser) {
              const { email: uemail, password: upass } = emailUser;
              if (uemail === username) {
                  if (upass === password) {
                      console.log("Login successful with email");
                      // Perform successful login actions here
                      return;
                  } else {
                      console.log("Incorrect password");
                      setErrorMessage("Incorrect Password. Please try again.")

                      return;
                  }
              }
          }

          console.log("Username or email not found. Please try again.");
          setErrorMessage("Username or email not found. Please try again.")
          // Notify the user to try again

      } catch (error) {
          console.error('Error', error);
          // Handle any errors that occurred during the process
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
              Log In
            </button>
          </form>
          <br></br>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      );
}


const registerUser = async (e: string, u: string, p: string) => {
  const url = `http://localhost:5001/api/user/create`;
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

const RegisterForm = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


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
        </div>
      );
}

const Login = () => {

    const [currentScreen, setCurrentScreen] = useState('auth');

    return (
        <div className="min-h-screen bg-gray-100">
          {currentScreen === 'auth' && (
            <AuthScreen
              onLogin={() => setCurrentScreen('login')}
              onRegister={() => setCurrentScreen('register')}
            />
          )}
          {currentScreen === 'login' && <LoginForm  />}
          {currentScreen === 'register' && <RegisterForm />}
        </div>

      );
};



export default Login