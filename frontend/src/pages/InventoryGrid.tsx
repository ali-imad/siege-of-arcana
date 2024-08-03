import {useState} from "react";
import {ItemType} from "../interfaces/ItemType.tsx";

enum InventoryName {
  Main = 'Main',
  GiftBox = 'Gift Box'
}

const ItemActions: Record<ItemType, string> = {
  'Consumable': 'Use',
  'Equipment': 'Equip'
}

interface InventoryItem {
  name: string;
  amt: number;
  type: ItemType;
  inventory: InventoryName;
}

const ItemDiv = (props: InventoryItem) => {
  const {name, amt, type, inventory} = props;
  return (
    <div className='bg-white border-2 border-soa-peach rounded-lg p-4 shadow-shopListing'>
      <div className='text-xl font-bold'>{name}</div>
      <div className='text-lg mt-2'><p className={'font-bold inline'}>Quantity:</p> ${amt}</div>
      <div className='text-sm mt-2'><p className={'font-bold inline'}>Inventory:</p> {inventory}</div>
      <button className='bg-soa-mauve border-2 border-soa-purple text-white rounded-lg px-4 py-2 mt-4'>
        {ItemActions[type]}
      </button>
    </div>
  );
};

interface InventoryFilterProps {
  filter: InventoryName | null;
  handleFilterInventory: (inventory: InventoryName | null) => Promise<void>
}

const InventoryFilter = (props: InventoryFilterProps) => {
  // eslint-disable-next-line no-unused-vars
  const {filter, handleFilterInventory} = props;
  const filters = [InventoryName.Main, InventoryName.GiftBox];
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
        ${colours[idx][0]}
        ${colours[idx][1]}
        rounded-full 
        px-4 
        py-1`} onClick={() => handleFilterInventory(f)}>{f}</button>
      })}
    </div>
  );
}

const baseItems: InventoryItem[] = [
  {name: 'Consumable of Experience Gain', amt: 10, inventory: InventoryName.Main, type: 'Consumable'},
  {name: 'Consumable of Experience Gain', amt: 4, inventory: InventoryName.GiftBox, type: 'Consumable'},
  {name: 'Bow', amt: 2, inventory: InventoryName.Main, type: 'Equipment'},
  {name: 'Filet-o-Fish', amt: 1, inventory: InventoryName.Main, type: 'Consumable'},
];

const InventoryGrid = () => {
  const [filter, setFilter] = useState<InventoryName | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(baseItems);

  const handleFilterInventory = async (inv: InventoryName): Promise<void> => {
    if (!inv || inv === filter) {
      setItems(baseItems);
      setFilter(null);
    } else {
      setItems(baseItems.filter(item => item.inventory === inv));
      setFilter(inv);
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='text-4xl font-bold'>Inventory</div>
      <InventoryFilter filter={filter} handleFilterInventory={handleFilterInventory}/>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {items.map(item => (
          <ItemDiv key={item.name + item.inventory} {...item} />
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;
