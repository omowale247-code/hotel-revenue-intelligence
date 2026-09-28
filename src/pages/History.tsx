import { ArrowLeft, Calendar, TriangleAlert } from "lucide-react";

type Analysis = {
  id: string;
  room_type: string;
  stay_date: string;
  occupancy: number;
  competitor_avg: number;
  opportunity: number;
  recommended_rate: number;
  severity: string;
  created_at: string;
};

type Props = {
  history: Analysis[];
  onBack: () => void;
};

export default function History({ history, onBack }: Props) {
  return (
    <div className="dashboard">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18}/>
        Back to Dashboard
      </button>

      <h1>Analysis History</h1>
      <p className="subtext">
        Every completed room analysis is stored permanently.
      </p>

      {history.length === 0 ? (
        <div className="empty-card">
          <Calendar size={42}/>
          <h3>No reports yet</h3>
          <p>Run your first room analysis.</p>
        </div>
      ) : (
        history.map((item) => (
          <div key={item.id} className="history-card">

            <div className="history-top">

              <div>
                <h3>{item.room_type}</h3>
                <small>{item.stay_date}</small>
              </div>

              <span className={`severity ${item.severity.toLowerCase()}`}>
                {item.severity}
              </span>

            </div>

            <div className="history-grid">

              <div>
                <small>Occupancy</small>
                <strong>{Number(item.occupancy).toFixed(1)}%</strong>
              </div>

              <div>
                <small>Competitor Avg</small>
                <strong>₦{Number(item.competitor_avg).toLocaleString()}</strong>
              </div>

              <div>
                <small>Recommended</small>
                <strong>₦{Number(item.recommended_rate).toLocaleString()}</strong>
              </div>

              <div>
                <small>Opportunity</small>
                <strong className="green">
                  ₦{Number(item.opportunity).toLocaleString()}
                </strong>
              </div>

            </div>

            <div className="alert-line">
              <TriangleAlert size={16}/>
              Generated {new Date(item.created_at).toLocaleString()}
            </div>

          </div>
        ))
      )}
    </div>
  );
}