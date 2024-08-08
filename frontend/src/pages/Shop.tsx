import {ItemType} from "../interfaces/ItemType.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import BalanceWidget, {Balance} from "../components/BalanceWidget.tsx";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ModularRelationTable from "../components/ModularHistory.tsx";

const BE_URL = import.meta.env.VITE_BE_ROUTE;

enum Currency {
  Gold = 'Gold',
  Silver = 'Silver',
  Essence = 'Essence',
  Artifact = 'Artifact',
  Platinum = 'Platinum',
}

interface ShopItem {
  name: string;
  itemid: number;
  price: number;
  currency: Currency;
  type: ItemType;
  shop: IShop;
}

interface IShop {
  name: string;
  shopid: number;
}

interface ShopFilterProps {
  filter: number | null;
  filters: IShop[] | null;
  handleFilterShop: (sid: number | null) => Promise<void>
}

const ShopFilter = (props: ShopFilterProps) => {
  // eslint-disable-next-line no-unused-vars
  const {filter, filters, handleFilterShop} = props;
  const colours = [['bg-soa-peach', 'text-soa-dark'],
    ['bg-soa-accent', 'text-soa-white'],
    ['bg-soa-peach', 'text-soa-dark'],
    ['bg-soa-accent', 'text-soa-white'],
    ['bg-soa-peach', 'text-soa-dark'],
    ['bg-soa-accent', 'text-soa-white']]

  const barHover = 'fixed bottom-4 right-4'
  return (
    <div className={barHover +
      "  flex justify-between mb-2 bg-white border-2 border-black rounded-full p-2 shadow-lg space-x-2"}>
      <button className={`text-sm 
       ${filter === null ? 'font-bold' : ''}
       bg-soa-dark 
       text-soa-white 
       rounded-full 
       px-4 
       py-1`}
              onClick={() => handleFilterShop(null)}>All Items
      </button>
      {filters ? filters.map((f, idx) => {
        return <button className={`text-sm 
       ${f.shopid === filter ? 'font-bold' : ''}
        ${colours[idx][0]}
        ${colours[idx][1]}
        rounded-full 
        px-4 
        py-1`} onClick={() => handleFilterShop(f.shopid)}>{f.name}</button>
      }) : null}
    </div>
  );
}

const ShopItemDiv = (props: ShopItem) => {
  const [qty, setQty] = useState(0);
  const {name, itemid, price, currency, shop, onSubmit} = props;
  // console.log(`ShopItemDiv: ${name} ${itemid} ${price} ${currency} ${shop.name} ${shop.shopid}`)
  const handleSpinnerChange = (val) => setQty(val);
  return (
    <div className='flex justify-between bg-white border-2 border-soa-peach rounded-lg p-8 shadow-shopListing'>
      <div className={'flex flex-col space-y-1'}>
        <div className='text-xs mt-2'><p className={'font-bold inline'}>Shop:</p> {shop.name}</div>
        <div className='text-lg font-bold'>{name}</div>
        <div className='text-sm mt-2'><p className={'font-bold inline'}>Price:</p> {price} {currency}</div>
      </div>
      <form className={'flex items-center space-x-5 mx-2'}
            onSubmit={(e) => onSubmit(shop.shopid, itemid, qty, e)}>
        <input type='number' onChange={(e) => handleSpinnerChange(e.target.value)} min={1} max={99} defaultValue={1}
               className={`border-2 border-soa-dark translate-y-2 text-center p-2`}/>
        <button
          className='bg-soa-accent border-2 border-soa-purple hover:font-bold hover:transition-all text-soa-white rounded-lg px-8 py-2 mt-4'>
          Purchase
        </button>
      </form>
    </div>
  );
};

interface TxHistoryRow {
  txID: number;
  itemName: string;
  cost: number;
  currency: Currency;
  quantity: number;
}

interface TxHistoryModalProps {
  txHistory: TxHistoryRow[];
  onClose: () => void;
}

function TxHistoryModal(props: TxHistoryModalProps) {
  const {txHistory, onClose} = props;
  const TxRowSection = (props: { title: string, value: string | number, span?: string }) => {
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
            {txHistory.map(tx => (
                <div className='grid grid-cols-12'>
                  <TxRowSection title={'Name'} value={tx.itemName} span={'xl'}/>
                  <TxRowSection title={'Currency'} value={tx.currency} span={'big'}/>
                  <TxRowSection title={'Amount'} value={tx.quantity}/>
                  <TxRowSection title={'Cost'} value={tx.cost}/>
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

function RawHistoryButton(props: TxHistoryButtonProps) {
  const {onClick} = props;
  return (<div>
    <button
      className={'rounded-3xl bg-soa-peach text-soa-dark ' +
        'px-6 py-4 mb-4 ' +
        'border-2 border-soa-dark ' +
        'bg-opacity-30 hover:bg-opacity-100 duration-500 hover:transition-all ' +
        'font-xl font-bold'}
      onClick={onClick}
    >
      Raw Tables View
    </button>
  </div>);
}

const Shop = () => {
  const [filters, setFilters] = useState<IShop[] | null>([]);
  const [filter, setFilter] = useState<number | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [txHistory, setTxHistory] = useState<TxHistoryRow[]>([]);
  const [showTxHistory, setShowTxHistory] = useState<boolean>(false);
  const [showRawHistory, setShowRawHistory] = useState<boolean>(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [refresh, setRefresh] = useState<boolean>(true);
  const pid = JSON.parse(localStorage.getItem('user')).playerid

  const handleTxHistoryButton = () => {
    setShowTxHistory(!showTxHistory);
  };

  const handleRawHistoryButton = () => {
    setShowRawHistory(!showRawHistory);
  };

  // get user balances
  useEffect(() => {
    if (!refresh) return;
    try {
      axios.get(`${BE_URL}/api/wallet/${pid}`).then((resp) => {
        if (!resp.data.wallets) {
          setBalances([])
        } else {
          const unmappedBalances = resp.data.wallets
          const mappedBalances = unmappedBalances.map((item) => {
            // console.log(item)
            return {
              currency: item.curr,
              amount: item.bal,
            }
          })
          setBalances(mappedBalances);
          setRefresh(false);
        }
      })
    } catch (error: any) {
      console.error('Error fetching user balances:', error.message);
      setBalances([])
    }
  }, [pid, refresh])

  // get all filters
  useEffect(() => {
    try {
      const fetchFilters = async () => {
        const resp = await axios.get(`${BE_URL}/api/shop/shops`);
        const mappedFilters = resp.data.shops.map((item) => {
          // console.log(`Shop: ${item.name} ID: ${item.shopid}`)
          return {
            name: item.name,
            shopid: item.shopid
          }
        })
        setFilters(mappedFilters);
      }
      fetchFilters();
    } catch (error) {
      console.error('Error fetching shop filters:', error);
      setFilters([])
    }
  }, [])

  const setShopItems = (resp) => {
    if (!resp.data.shopItems || typeof resp.data.shopItems === 'undefined' || resp.data.shopItems.length === 0) {
      setItems([])
    }
    // console.log(`Retrieved ${resp.data.shopItems.length} items`);
    const unmappedItems: object[] = resp.data.shopItems
    const mappedItems = unmappedItems.map((item) => {
      return {
        name: item.name,
        price: item.price,
        itemid: item.itemid,
        currency: item.currname,
        type: item.type,
        shop: item.shop
      }
    });
    setItems(mappedItems);
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!filter) {
          axios.get(`${BE_URL}/api/shop`).then(setShopItems)
        } else {
          axios.get(`${BE_URL}/api/shop/${filter}`).then(setShopItems)
        }
      } catch (error) {
        console.error('Error fetching shop items:', error);
        setItems([])
      }
    }
    fetchItems()
  }, [filter]);

  // handle update on search change
  useEffect(() => {
    if (filter !== null) return;
    const fetchItems = async () => {
      try {
        if (!search) {
          axios.get(`${BE_URL}/api/shop`).then(setShopItems)
        } else {
          axios.get(`${BE_URL}/api/shop/search/${search}`).then(setShopItems)
        }
      } catch (error) {
        console.error('Error fetching shop items:', error);
        setItems([])
      }
    }
    fetchItems()
  }, [filter, search])

  useEffect(() => {
    if (!showTxHistory) return;
    const fetchTxHistory = async () => {
      try {
        const resp = await axios.get(`${BE_URL}/api/transaction/history/${pid}`);
        const mappedTxHistory = resp.data.transactions.map((item) => {
          return {
            txID: item.txid,
            itemName: item.itemname,
            cost: item.cost,
            currency: item.currency,
            quantity: item.quantity
          }
        })
        setTxHistory(mappedTxHistory);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setTxHistory([])
      }
    }
    fetchTxHistory()
  }, [pid, showTxHistory])

  const handleFilterShop = async (sid: number | null): Promise<void> => {
    if (!sid) {
      setFilter(null);
    } else {
      setFilter(sid);
    }
  }

  function handleSearchChange(e) {
    const search = e.target.value;
    setSearch(search);
  }

  const purchaseItem = (sid, iid, qty, e) => {
    e.preventDefault();
    // get value from spinner
    const purchaseReq = {
      playerID: pid,
      shopID: sid,
      itemID: iid,
      quantity: qty
    }
    axios.post(`${BE_URL}/api/shop/buy`, purchaseReq).then((resp) => {
      setRefresh(true);
      if (resp.data.success === 1)
        toast.success('Purchase successful!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      else
        toast.error('Error purchasing item', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        })
    }).catch((err) => {
      toast.error('Error purchasing item', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      })
      // TODO: add toast error
      console.error(err)
    })
  }

  return (
    <div className='container mx-auto p-4'>
      <BalanceWidget balances={balances}/>
      <ShopFilter filter={filter} filters={filters} handleFilterShop={handleFilterShop}/>
      <div className={`flex justify-between`}>
        <div className='text-4xl font-bold'>Shop</div>
        {filter === null ? <div className='translate-y-2 text-2xl space-x-4 flex justify-between items-center'>
          <p className='inline font-bold'>Search:</p>
          <input type='text' onChange={handleSearchChange} className='px-3 py-2 border-2 border-soa-dark text-lg'/>
        </div> : null}
        <div>
          <TxHistoryButton onClick={handleTxHistoryButton}/>
        </div>
        <div>
          <RawHistoryButton onClick={handleRawHistoryButton}/>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {items.map(item => (
          <ShopItemDiv key={item.name + item.shop.shopid} onSubmit={purchaseItem} {...item} />
        ))}
      </div>
      {showTxHistory && (
        <TxHistoryModal
          txHistory={txHistory}
          onClose={() => setShowTxHistory(false)}
        />
      )}
      {showRawHistory && (
        <ModularRelationTable pid={pid} onClose={() => setShowRawHistory(false)}/>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Shop;
