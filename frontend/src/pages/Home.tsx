import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className='container mx-auto'>
      <h1 className='text-3xl font-bold text-center mt-10'>
        Welcome to Siege of Arcana!
      </h1>
      <p className='text-center mt-5'>
        Siege of Arcana is a free-to-play, turn-based strategy game. You can
        play it on your browser or download the app on your phone.
      </p>
      <div className='flex justify-center mt-10'>
        <Link
          to='/login'
          className='order-3 transition-colors hover:text-soa-accent'
        >
          <button className='bg-soa-accent text-white p-2 px-4 rounded-lg'>
            {' '}
            Play Now{' '}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
