import { Link } from 'react-router-dom';

const AuthScreen = ({}) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <p className="text-center mb-4">
          You are not logged in. Please log in or create an account.
        </p>
        <Link
          to='/lform'
          className='order-3 transition-colors hover:text-soa-accent'
        >
        <button
          className="w-full mb-2 py-2 px-4 bg-yellow-300 hover:bg-yellow-400 rounded"
        >
          Log In
        </button>
        </Link>
        <Link
          to='/rform'
          className='order-3 transition-colors hover:text-soa-accent'
        >
        <button
          className="w-full py-2 px-4 bg-green-300 hover:bg-green-400 rounded"
        >
          Register
        </button>
        </Link>
      </div>
    </div>
  );

  export default AuthScreen;