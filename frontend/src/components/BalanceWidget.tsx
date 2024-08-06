export interface Balance {
  currency: string;
  amount: number;
}

interface BalanceWidgetProps {
  balances: Balance[];
}

const BalanceWidget = (props: BalanceWidgetProps) => {
  const {balances} = props;
  const barHover = 'fixed bottom-4 left-4'
  return (
    <div className={barHover + ' bg-white border-2 border-soa-peach rounded-lg p-4 shadow-shopListing'}>
      <div className='text-xl font-bold'>Balances</div>
      {balances.map((b, idx) => {
        return (
          <div key={idx} className='text-lg mt-2'>
            <p className={'font-bold inline'}>{b.currency}:</p> {b.amount}
          </div>
        );
      })}
    </div>)
}

export default BalanceWidget;