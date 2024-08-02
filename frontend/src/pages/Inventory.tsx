const ItemDiv = ({ name, price, amt }) => {
  return (
    <div className='bg-white border-2 border-soa-peach rounded-lg p-4 shadow-shopListing'>
      <div className='text-xl font-bold'>{name}</div>
      <div className='text-lg mt-2'>Quantity: ${amt}</div>
      <button className='bg-soa-mauve border-2 border-soa-purple text-white rounded-lg px-4 py-2 mt-4'>
        Buy
      </button>
    </div>
  );
};
const Inventory = () => {
  const items = [
    { name: 'Item 1', amt: 10 },
    { name: 'Item 2', amt: 20 },
    { name: 'Item 3', amt: 30 },
  ];

  return (
    <div className='container mx-auto p-4'>
      <div className='text-4xl font-bold'>Inventory</div>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {items.map(item => (
          <ItemDiv key={item.name} name={item.name} amt={item.amt} />
        ))}
      </div>
    </div>
  );
};

export default Inventory;
