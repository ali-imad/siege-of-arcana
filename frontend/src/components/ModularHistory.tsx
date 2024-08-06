import {useEffect, useState} from "react";
import axios from "axios";
import {Checkbox, FormControlLabel} from "@mui/material";

const BE_URL = import.meta.env.VITE_BE_ROUTE;

const RowSection = (props: { title: string, value: string | number, span?: string }) => {
  const {title, value, span} = props;
  const spanStr = span === 'xl' ? 'col-span-4' : span === 'big' ? 'col-span-3' : span === 'small' ? 'col-span-1' : 'col-span-2';
  return (<div className={`text-xs text-soa-dark ${spanStr}`}>
    <p className={'inline font-bold '}>{title}: </p><p className={'inline'}>{value}</p>
  </div>)
};

interface ModularViewProps {
  pid: number;
  onClose: () => void;
}

interface ColState {
  name: string;
  visible: boolean;
}

function HistoryTable(props: { history: [] }) {
  const {history} = props;
  // create an array of row sections based on key as title and value as value
  const rows = history.map((row: any) => {
    return Object.keys(row).map((key: string) => {
      return <RowSection title={key} value={row[key]}/>
    })
  })
  // console.log(rows)
  return (
    <div className='flex flex-col items-begin'>
      {rows.map((row) => {
        return <div className='flex justify-between space-x-4'>{row}</div>
      })}
    </div>
  )
}

function ModularTableView(props: ModularViewProps) {
  const {pid, onClose} = props;
  const [history, setHistory] = useState<[]>([]); // [true, true, true, true, true
  const [filters, setFilters] = useState<ColState[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [table, setTable] = useState<string>('')

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const resp = await axios.get(`${BE_URL}/api/tables`);
        setTables(resp.data.tables);
        setTable(resp.data.tables[0]);
      } catch (error) {
        console.error('Error fetching tables:', error);
        setTables([]);
      }
    }
    fetchTables()
  }, []);

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const resp = await axios.get(`${BE_URL}/api/tables/${table}`);
        // console.log(resp)
        const mappedRows = resp.data.filters.map((item) => {
          return {
            name: item,
            visible: true
          }
        })
        setFilters(mappedRows);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setFilters([])
      }
    }
    fetchRows();
  }, [table]);

  useEffect(() => {
    if (!filters) return;
    if (!table) return;
    const colNames = filters.filter((filter) => filter.visible).map((filter) => filter.name)
    if (colNames.length === 0) return;
    const fetchHistory = async () => {
      try {
        const historyReq = {
          table: table,
          filters: colNames
        }
        // console.log(historyReq)
        const resp = await axios.post(`${BE_URL}/api/query`, historyReq)

        setHistory(resp.data.results);
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistory([])
      }
    }
    fetchHistory();
  }, [filters, table])

  const toggleFilter = (idx: number) => {
    const newFilters = [...filters];
    newFilters[idx].visible = !newFilters[idx].visible;
    setFilters(newFilters);
  }


  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white'>
        <div className='flex flex-col'>
          <div className='mt-2 max-h-60 overflow-y-auto'>
            <h4 className='font-xl font-bold mb-4'>All tables view</h4>
          </div>
          <div>
            <h4 className='font-l font-bold mb-4'>Tables:</h4>
            <select onChange={(e) => {
              setFilters([])
              setTable(e.target.value)
            }} className='border border-gray-300 rounded'>
              {tables.map((tbl) => {
                return (<option value={tbl}>{tbl}</option>)
              })}
            </select>
          </div>
          <div className='flex justify-between'>
            {filters.map((filter, idx) => (
              <div className='text-xs text-soa-dark'>
                <FormControlLabel
                  control={<Checkbox checked={filter.visible} onChange={() => toggleFilter(idx)}/>}
                  label={filter.name}
                />
              </div>
            ))}
          </div>
          <div className={'flex flex-col flex-wrap text-xs'}>
            <HistoryTable history={history}/>
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

export default ModularTableView;