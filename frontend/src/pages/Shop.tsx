import {ItemType} from "../interfaces/ItemType.tsx";
import {useState} from "react";

enum Currency {
  Gold = 'Gold',
  Silver = 'Silver',
  Essence = 'Essence',
  Artifact = 'Artifact',
  Platinum = 'Platinum',
}

enum ShopName {
  General = 'Standard Shop',
  Premium = 'Premium Shop',    // for gold
  Loyalty = 'Loyalists of Arcana',    // for platinum
  Researcher = 'Researchers Corner', // for artifacts
  Enchanter = 'Enchanters Guild',  // for essences
}

interface ShopItem {
  name: string;
  price: number;
  currency: Currency;
  type: ItemType;
  shop: ShopName;
}

interface ShopFilterProps {
  filter: ShopName | null;
  handleFilterShop: (shopName: ShopName | null) => Promise<void>
}

const ShopFilter = (props: ShopFilterProps) => {
  // eslint-disable-next-line no-unused-vars
  const {filter, handleFilterShop} = props;
  const filters = [ShopName.General, ShopName.Premium, ShopName.Loyalty, ShopName.Researcher, ShopName.Enchanter];
  const colours = [['bg-soa-peach', 'text-soa-dark'],
    ['bg-soa-accent', 'text-soa-white'],
    ['bg-soa-peach', 'text-soa-dark'],
    ['bg-soa-accent', 'text-soa-white'],
    ['bg-soa-peach', 'text-soa-dark'],
    ['bg-soa-accent', 'text-soa-white']]

  const barHover = 'fixed bottom-4 right-4'
  return (
    <div className={barHover +
      "  flex justify-between mb-2 bg-white border-2 border-black rounded-full p-2 shadow-lg flex space-x-2"}>
      <button className={`text-sm 
       ${filter === null ? 'font-bold' : ''}
       bg-soa-dark 
       text-soa-white 
       rounded-full 
       px-4 
       py-1`}
              onClick={() => handleFilterShop(null)}>All Items
      </button>
      {filters.map((f, idx) => {
        return <button className={`text-sm 
       ${f === filter ? 'font-bold' : ''}
        ${colours[idx][0]}
        ${colours[idx][1]}
        rounded-full 
        px-4 
        py-1`} onClick={() => handleFilterShop(f)}>{f}</button>
      })}
    </div>
  );
}

const ShopItemDiv = (props: ShopItem) => {
  const {name, price, currency, shop} = props;
  return (
    <div className='flex justify-between bg-white border-2 border-soa-peach rounded-lg p-8 shadow-shopListing'>
      <div className={'flex flex-col space-y-1'}>
        <div className='text-xs mt-2'><p className={'font-bold inline'}>Shop:</p> {shop}</div>
        <div className='text-lg font-bold'>{name}</div>
        <div className='text-sm mt-2'><p className={'font-bold inline'}>Price:</p> {price} {currency}</div>
      </div>
      <button className='bg-soa-accent border-2 border-soa-purple hover:font-bold hover:transition-all text-soa-white rounded-lg px-8 py-2 mt-4'>
        Purchase
      </button>
    </div>
  );
};

interface Transaction {
  txID: number;
  playerID: number;
  itemID: number;
  balanceID: number;
  cost: number;
}

interface TxHistoryRow {
  txID: number;
  itemName: string;
  cost: number;
  currency: Currency;
  quantity: number;
}

interface TxHistoryModalProps {
  txHistory: string[];
  onClose: () => void;
}

function TxHistoryModal(props: TxHistoryModalProps) {
  const {onClose} = props;
  const mockTxHistory: TxHistoryRow[] = [
    {txID: 1, itemName: 'Health Potion', cost: 10, currency: Currency.Silver, quantity: 1},
    {txID: 4, itemName: 'Health Potion', cost: 40, currency: Currency.Silver, quantity: 4},
    {txID: 12, itemName: 'Potion of Experience Gain', cost: 10, currency: Currency.Platinum, quantity: 5},
    ]
  const TxRowSection = (props: {title: string, value: string|number, span?: string}) => {
    const {title, value, span} = props;
    const spanStr = span === 'xl' ? 'col-span-4' : span === 'big' ? 'col-span-3' : span === 'small' ? 'col-span-1' : 'col-span-2';
    return (<div className={`text-xs text-soa-dark ${spanStr}`}>
      <p className={'inline font-bold '}>{title}: </p><p className={'inline'}>{value}</p>
    </div>)
  };


  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white'>
        <div className='flex flex-col'>
        <div className='mt-2 max-h-60 overflow-y-auto'>
          <h4 className='font-xl font-bold mb-4'>Transaction History</h4>
        </div>
        <div className='mx-auto w-5/6 mt-4 max-h-60 overflow-y-auto'>
          {mockTxHistory.map(tx => (
              <div className='grid grid-cols-12'>
                <TxRowSection title={'Name'} value={tx.itemName} span={'xl'} />
                <TxRowSection title={'Currency'} value={tx.currency} span={'big'}/>
                <TxRowSection title={'Amount'} value={tx.quantity} />
                <TxRowSection title={'Cost'} value={tx.cost} />
                <TxRowSection title={'Tx ID'} value={tx.txID} span={'small'}/>
              </div>
            )
          )}
        </div>
        <div className='flex justify-end mt-4'>
          <button
            onClick={onClose}
            className='mr-2 px-4 py-2 bg-gray-300 rounded'
          >
            Close
          </button>
        </div>
        </div>
      </div>
    </div>
  );

}

interface TxHistoryButtonProps {
  onClick: () => void;
}

function TxHistoryButton(props: TxHistoryButtonProps) {
  const {onClick} = props;
  return (<div>
    <button
      className={'rounded-3xl bg-emerald-300 text-soa-dark ' +
        'px-6 py-4 mb-4 ' +
        'border-2 border-soa-dark ' +
        'bg-opacity-30 hover:bg-opacity-100 duration-500 hover:transition-all ' +
        'font-xl font-bold'}
      onClick={onClick}
    >
      Transaction History
    </button>
  </div>);
}

const Shop = () => {
  const baseItems: ShopItem[] = [
    {name: 'Health Potion', price: 10, currency: Currency.Silver, type: 'Potion', shop: ShopName.General},
    {name: 'Strength Potion', price: 20, currency: Currency.Silver, type: 'Potion', shop: ShopName.General},
    {name: 'Bow', price: 500, currency: Currency.Silver, type: 'Equipment', shop: ShopName.General},
    {name: 'Bow', price: 50, currency: Currency.Gold, type: 'Equipment', shop: ShopName.Premium},
    {name: 'Magic Wand', price: 20, currency: Currency.Artifact, type: 'Equipment', shop: ShopName.Researcher},
    {name: 'Magic Wand', price: 75, currency: Currency.Gold, type: 'Equipment', shop: ShopName.Premium},
    {name: 'Magic Wand', price: 35, currency: Currency.Essence, type: 'Equipment', shop: ShopName.Enchanter},
    {name: 'Potion of Experience Gain', price: 10, currency: Currency.Silver, type: 'Potion', shop: ShopName.General},
    {name: 'Potion of Experience Gain', price: 2, currency: Currency.Platinum, type: 'Potion', shop: ShopName.Loyalty},
    {name: 'Potion of Experience Gain', price: 15, currency: Currency.Gold, type: 'Potion', shop: ShopName.Premium},
    {name: 'Potion of Experience Gain', price: 5, currency: Currency.Artifact, type: 'Potion', shop: ShopName.Researcher},
    {
      name: 'Potion of Experience Gain',
      price: 10,
      currency: Currency.Essence,
      type: 'Potion',
      shop: ShopName.Enchanter
    },
  ]

  const [filter, setFilter] = useState<ShopName | null>(null);
  const [items, setItems] = useState<ShopItem[]>(baseItems);
  const [showTxHistory, setShowTxHistory] = useState<boolean>(false);

  const handleTxHistoryButton = () => {
    setShowTxHistory(!showTxHistory);
  };

  const handleFilterShop = async (shopName: ShopName): Promise<void> => {
    if (!shopName || shopName === filter) {
      setItems(baseItems);
      setFilter(null);
    } else {
      setItems(baseItems.filter(item => item.shop === shopName));
      setFilter(shopName);
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <ShopFilter filter={filter} handleFilterShop={handleFilterShop}/>
      <div className={`flex justify-between`}>
        <div className='text-4xl font-bold'>Shop</div>
        <TxHistoryButton onClick={handleTxHistoryButton} />
      </div>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {items.map(item => (
          <ShopItemDiv key={item.name + item.shop} {...item} />
        ))}
      </div>
      {showTxHistory && (
        <TxHistoryModal
          txHistory={[]}
          onClose={() => setShowTxHistory(false)}
        />
      )}
    </div>
  );
};

export default Shop;
