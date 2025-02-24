import React, {useEffect, useState} from "react";
import {ItemType} from "../interfaces/ItemType.tsx";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

const BE_URL = import.meta.env.VITE_BE_ROUTE;

const ItemActions: Record<ItemType, string> = {
  'Consumable': 'Use',
  'Equipment': ''
}

interface InventoryItem {
  name: string;
  invid: number;
  itemid: number;
  quantity: number;
  type: ItemType;
  inventory: string;
}

const ItemDiv = (props: { consumeItem } & InventoryItem) => {
  const {consumeItem, name, quantity, type, inventory} = props;
  const action = ItemActions[type]
  const [qty, setQty] = useState(1)
  return (
    <div
      className='flex space-x-6 bg-white border-2 border-soa-peach rounded-lg p-4 shadow-shopListing justify-between'>
      <div className='flex flex-col'>
        <div className='text-xl font-bold'>{name}</div>
        <div className='text-lg mt-2'><p className={'font-bold inline'}>Quantity:</p> {quantity}</div>
        <div className='text-sm mt-2'><p className={'font-bold inline'}>Inventory:</p> {inventory}</div>
      </div>
      {action && <form className='flex items-center space-x-5 mx-2'
                       onSubmit={(e) => {
                         e.preventDefault();
                         consumeItem(qty);
                       }}>
        <input type='number' min={1} max={99} defaultValue={1}
               onChange={(e) => setQty(parseInt(e.target.value))}
               className={`border-2 border-soa-dark text-center p-2`}/>
        <button className='bg-soa-mauve border-2 border-soa-purple text-white rounded-lg px-16 py-4'>
          {action}
        </button>
      </form>
      }
    </div>
  );
};

interface InventoryFilterProps {
  filter: string | null;
  filters: string[];
  handleFilterInventory: (inventory: string | null) => void
}

const InventoryFilter = (props: InventoryFilterProps) => {
  // eslint-disable-next-line no-unused-vars
  const {filter, filters, handleFilterInventory} = props;
  const colours = [['bg-soa-peach', 'text-soa-dark'], ['bg-soa-accent', 'text-soa-white']]
  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-black rounded-full p-2 shadow-lg flex space-x-2">
      <button className={`text-sm 
       ${filter === null ? 'font-bold' : ''}
       bg-soa-dark 
       text-soa-white 
       rounded-full 
       px-4 
       py-1`}
              onClick={() => handleFilterInventory(null)}>All Items
      </button>
      {filters.map((f, idx) => {
        return <button className={`text-sm 
       ${f === filter ? 'font-bold' : ''}
        ${colours[idx % 2][0]}
        ${colours[idx % 2][1]}
        rounded-full 
        px-4 
        py-1`} onClick={() => handleFilterInventory(f)}>{f}</button>
      })}
    </div>
  );
}

const InventoryGrid: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [refresh, setRefresh] = useState(true);
  const [inventories, setInventories] = useState([])
  const pid = JSON.parse(localStorage.getItem('user')).playerid

  // get user inventories
  useEffect(() => {
    try {
      axios.get(`${BE_URL}/api/inventory/names/${pid}`).then((resp) => {
        if (!resp.data.names) {
          setInventories([])
        } else {
          setInventories(resp.data.names)
        }
      })} catch (e) {
      toast.error('Error fetching user inventories')
      console.error('Error fetching user inventories:', e)
    }
  }, []);

  const handleFilterInventory = (inv: string) => {
    if (!inv || inv === filter) {
      setFilter(null);
      setRefresh(true);
    } else {
      setFilter(inv);
      setRefresh(true);
    }
  }

  const handleUseItem = async (invid: number, itemid: number, quantity: number) => {
    try {
      const req = {
        itemID: itemid,
        quantity: quantity
      }
      console.log(`Using item in inventory ${invid} with item id ${itemid} and quantity ${quantity}`)
      await axios.post(`${BE_URL}/api/inventory/${invid}/remove`, req).then((res) => {
        if (res.data.success) toast.success("Item consumed successfully!");
        else toast.error("Error consuming item");
      }).catch(() => {
        toast.error("Error consuming item")
      })
      setRefresh(true);
    } catch (error) {
      console.error('Error using item:', error)
    }
  }

  // fetch inventory items on filter change
  useEffect(() => {
    if (!refresh) return;
    const fetchItems = async () => {
      try {
        let resp;
        if (!filter) {
          resp = await axios.get(`${BE_URL}/api/inventory/${pid}`)//.then(res => res.data.items.map((item) => {
        } else {
          resp = await axios.get(`${BE_URL}/api/inventory/get/${filter}/${pid}`)//.then(res => res.data.items.map((item) => {
        }
        const mappedItems = resp.data.items.map((item) => {
          console.log(item)
          return item
        });
        setItems(mappedItems);
        setRefresh(false);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        setItems([])
      }
    }
    fetchItems();
  }, [pid, filter, refresh]);

  return (
    <div className='container mx-auto p-4'>
      <div className='text-4xl font-bold'>Inventory</div>
      <InventoryFilter filter={filter} filters={inventories} handleFilterInventory={handleFilterInventory}/>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {items.map(item => (
          <ItemDiv key={item.name + item.inventory}
                   consumeItem={(qty) => handleUseItem(item.invid, item.itemid, qty)} {...item} />
        ))}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default InventoryGrid;
