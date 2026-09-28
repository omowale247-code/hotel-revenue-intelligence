import { ArrowLeft, Wallet, Plus } from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  created_at: string;
};

type Props = {
  credits: number;
  transactions: Transaction[];
  onBack: () => void;
};

export default function WalletPage({
  credits,
  transactions,
  onBack,
}: Props) {
  return (
    <div className="dashboard">

      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18}/>
        Back
      </button>

      <h1>Credit Wallet</h1>

      <div className="wallet-hero">

        <Wallet size={34}/>

        <div>
          <small>AVAILABLE CREDITS</small>
          <h2>{credits.toLocaleString()}</h2>
        </div>

      </div>

      <h3 style={{marginBottom:16}}>
        Purchase Packages (Demo)
      </h3>

      <div className="packages">

        {[100,500,1000].map((item)=>(
          <div className="package" key={item}>
            <Plus size={20}/>
            <h2>{item}</h2>
            <p>Credits</p>

            <button>Coming Soon</button>
          </div>
        ))}

      </div>

      <div className="ledger">

        <h3>Transaction Ledger</h3>

        {transactions.length===0 ? (
          <p>No transactions yet.</p>
        ):(
          transactions.map((t)=>(
            <div className="transaction" key={t.id}>

              <div>
                <strong>{t.description}</strong>
                <small>
                  {new Date(t.created_at).toLocaleString()}
                </small>
              </div>

              <span className={t.amount>0?"credit":"debit"}>
                {t.amount>0?"+":""}{t.amount}
              </span>

            </div>
          ))
        )}

      </div>

    </div>
  );
}