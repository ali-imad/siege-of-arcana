import {useState} from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../pages/LoginForm'

const UpdateForm = () => {

    const user = localStorage.getItem('user');
    const userJSON = JSON.parse(user);

    const [username, setUsername] = useState(userJSON.username);
    const [email, setEmail] = useState(userJSON.email);
    const [password, setPassword] = useState(userJSON.password);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const updateUser = async (id: string, e: string, u: string, p: string) => {
        const url = `http://localhost:5001/api/user/update/${id}`;
        try {
            const userData = {
                email: e,
                username: u,
                password: p,
            };
      
            const response = await axios.put(url, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
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

          const response = await updateUser(userJSON.playerid, email, username, password);

          if (response) {
              setErrorMessage("Successful registration.");
              
              // Retrieve the updated user information
              const response = await getUser(username, password);
              const updatedUser = response.user
              
              if (updatedUser) {
                  localStorage.setItem('user', JSON.stringify(updatedUser));
              }
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
  <div className="flex items-center justify-center min-h-250 bg-gray-100 p-4">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Player Profile</h2>
      <form onSubmit={startRegister} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmail}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsername}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePassword}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-soa-accent text-white hover:bg-tan-400 rounded text-sm font-medium"
        >
          Update
        </button>
      </form>
      {errorMessage && <div className="mt-4 text-red-500 text-sm text-center">{errorMessage}</div>}
    </div>
  </div>
)};


interface EditProfileModalProps {
  onClose: () => void;
}

function TxHistoryModal(props: EditProfileModalProps) {
  const {onClose} = props;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white'>
        <div className='flex flex-col'>
        <div className='mt-2 max-h-60 overflow-y-auto'>
        </div>

        <UpdateForm></UpdateForm>

        
        <div className='flex justify-end mt-4'>
          <button
            onClick={onClose}
            className='mr-2 px-3 py-2 bg-gray-300 rounded'
          >
            Close
          </button>
        </div>
        </div>
      </div>
    </div>
  );

}

interface EditProfileButtonProps {
  onClick: () => void;
}

function EditProfileButton(props: EditProfileButtonProps) {
  const {onClick} = props;
  return (<div>
    <button
      className={'rounded-3xl bg-emerald-300 text-soa-dark ' +
        'px-2 py-1 mb-4 ' +
        'border-2 border-soa-dark ' +
        'bg-opacity-30 hover:bg-opacity-100 duration-500 hover:transition-all ' +
        'font-xl font-bold'}
      onClick={onClick}
    >
      Edit Profile
    </button>
  </div>);
}

const UpdateInfo = () => {

  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  const handleEditProfileButton = () => {
    setShowEditProfile(!showEditProfile);
  };

  
  return (
    <div className='container mx-auto p-4'>
      <div className={`flex justify-between`}>
        <EditProfileButton onClick={handleEditProfileButton} />
      </div>
      {showEditProfile && (
        <TxHistoryModal
          txHistory={[]}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
};

export default UpdateInfo;
