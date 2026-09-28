import {
  Wallet,
  BarChart3,
  History,
  Search,
  LogOut,
} from "lucide-react";

type Props = {
  hotelName: string;
  credits: number;
  analyses: number;
  opportunity: number;
  onAnalyze: () => void;
  onHistory: () => void;
  onWallet: () => void;
  onLogout: () => void;
};

export default function Dashboard({
  hotelName,
  credits,
  analyses,
  opportunity,
  onAnalyze,
  onHistory,
  onWallet,
  onLogout,
}: Props) {
  return (
    <div className="dashboard">

      <header className="topbar">

        <div>
          <p className="eyebrow">
            HOTEL REVENUE INTELLIGENCE
          </p>

          <h1>{hotelName}</h1>

          <span>
            Pricing Leakage Detection System
          </span>
        </div>

        <div className="wallet-box">
          <Wallet size={22} />

          <div>
            <small>Available Credits</small>
            <h2>{credits.toLocaleString()}</h2>
          </div>
        </div>

      </header>

      <section className="stats-grid">

        <div className="stat-card">
          <BarChart3 size={22} />

          <small>Analyses Completed</small>

          <h3>{analyses}</h3>
        </div>

        <div className="stat-card">
          <Search size={22} />

          <small>Revenue Opportunity</small>

          <h3>₦{opportunity.toLocaleString()}</h3>
        </div>

        <div className="stat-card">
          <Wallet size={22} />

          <small>Credits Remaining</small>

          <h3>{credits}</h3>
        </div>

        <div className="stat-card">
          <History size={22} />

          <small>Reports Generated</small>

          <h3>{analyses}</h3>
        </div>

      </section>

      <section className="action-panel">

        <h2>Revenue Analysis</h2>

        <p>
          Analyze room pricing against occupancy,
          booking pace and competitor rates to
          identify pricing leakage.
        </p>

        <button
          className="primary-btn"
          onClick={onAnalyze}
        >
          Analyze Room (1 Credit)
        </button>

      </section>

      <section className="quick-actions">

        <button
          className="secondary-btn"
          onClick={onHistory}
        >
          <History size={18} />
          Analysis History
        </button>

        <button
          className="secondary-btn"
          onClick={onWallet}
        >
          <Wallet size={18} />
          Credit Wallet
        </button>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Sign Out
        </button>

      </section>

    </div>
  );
}