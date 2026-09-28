import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AnalyzeRoom from "./pages/AnalyzeRoom";
import History from "./pages/History";
import WalletPage from "./pages/Wallet";

type Page =
  | "dashboard"
  | "analysis"
  | "history"
  | "wallet";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [page, setPage] = useState<Page>("dashboard");

  const [hotelName, setHotelName] = useState("Loading...");
  const [credits, setCredits] = useState(0);

  const [history, setHistory] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  async function loadHotel(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    const { data: analyses } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data: ledger } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (profile) setHotelName(profile.hotel_name);
    if (wallet) setCredits(wallet.balance);
    if (analyses) setHistory(analyses);
    if (ledger) setTransactions(ledger);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session) {
        loadHotel(data.session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session) {
          loadHotel(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  const totalOpportunity = history.reduce(
    (sum, item) => sum + Number(item.opportunity || 0),
    0
  );

  return (
    <>
      {page === "dashboard" && (
        <Dashboard
          hotelName={hotelName}
          credits={credits}
          analyses={history.length}
          opportunity={totalOpportunity}
          onAnalyze={() => setPage("analysis")}
          onHistory={() => setPage("history")}
          onWallet={() => setPage("wallet")}
          onLogout={() => supabase.auth.signOut()}
        />
      )}

      {page === "analysis" && (
        <AnalyzeRoom
          credits={credits}
          onBack={() => {
            setPage("dashboard");
            loadHotel(session.user.id);
          }}
        />
      )}

      {page === "history" && (
        <History
          history={history}
          onBack={() => setPage("dashboard")}
        />
      )}

      {page === "wallet" && (
        <WalletPage
          credits={credits}
          transactions={transactions}
          onBack={() => setPage("dashboard")}
        />
      )}
    </>
  );
}