import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  TriangleAlert,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Props = {
  credits: number;
  onBack: () => void;
};

export default function AnalyzeRoom({
  credits,
  onBack,
}: Props) {
  const [roomType, setRoomType] = useState("Deluxe King");
  const [stayDate, setStayDate] = useState("2026-09-25");

  const [rooms, setRooms] = useState(10);
  const [bookings, setBookings] = useState(3);
  const [rate, setRate] = useState(95000);
  const [rackRate, setRackRate] = useState(120000);
  const [cost, setCost] = useState(28000);

  const [compA, setCompA] = useState(110000);
  const [compB, setCompB] = useState(105000);
  const [compC, setCompC] = useState(125000);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  const competitorAvg = useMemo(
    () => Math.round((compA + compB + compC) / 3),
    [compA, compB, compC]
  );

  async function analyze() {
    if (credits <= 0) {
      alert("No credits remaining.");
      return;
    }

    setLoading(true);

    const occupancy =
      rooms > 0 ? (bookings / rooms) * 100 : 0;

    const revPAR = rate * occupancy / 100;

    const currentRevenue = bookings * rate;

    const opportunity = Math.max(
      0,
      competitorAvg * rooms - currentRevenue
    );

    const variance =
      ((rate - competitorAvg) / competitorAvg) * 100;

    let severity = "Low";
    let recommendation = "";
    let suggestedRate = rate;

    if (rate < competitorAvg && occupancy < 40) {
      severity = "High";
      suggestedRate = Math.round(
        (rate + competitorAvg) / 2
      );

      recommendation =
        "Room appears underpriced while occupancy is weak. Test a gradual increase.";
    } else if (
      rate > competitorAvg &&
      occupancy < 40
    ) {
      severity = "High";
      suggestedRate = competitorAvg;

      recommendation =
        "Price is above market with weak demand. Consider reducing the rate.";
    } else if (occupancy >= 80) {
      severity = "Medium";
      suggestedRate = Math.round(rate * 1.08);

      recommendation =
        "Demand is strong. Increase price gradually.";
    } else {
      recommendation =
        "Pricing is currently competitive.";
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Deduct one credit
    const newBalance = credits - 1;

    const { error: walletError } = await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id);

    if (walletError) {
      alert(walletError.message);
      setLoading(false);
      return;
    }

    // Record transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "analysis",
      amount: -1,
      description: "Room pricing analysis",
    });

    // Save report
    await supabase.from("analyses").insert({
      user_id: user.id,
      room_type: roomType,
      stay_date: stayDate,
      occupancy,
      competitor_avg: competitorAvg,
      revpar: revPAR,
      opportunity,
      recommended_rate: suggestedRate,
      severity,
    });

    setResult({
      occupancy,
      revPAR,
      opportunity,
      variance,
      suggestedRate,
      severity,
      recommendation,
      remainingCredits: newBalance,
    });

    setLoading(false);
  }

  return (
    <div className="analysis-page">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="analysis-title">
        <div>
          <p className="eyebrow">
            HOTEL REVENUE INTELLIGENCE
          </p>

          <h1>Room Analysis Engine</h1>

          <p>
            Detect pricing leakage using competitor
            benchmarking.
          </p>
        </div>

        <div className="analysis-credit">
          {credits} Credits
        </div>
      </div>

      <div className="analysis-grid">
        <div className="form-card">
          <h2>Room Information</h2>

          <label>Room Type</label>

          <input
            value={roomType}
            onChange={(e) =>
              setRoomType(e.target.value)
            }
          />

          <label>Stay Date</label>

          <input
            type="date"
            value={stayDate}
            onChange={(e) =>
              setStayDate(e.target.value)
            }
          />

          <label>Total Rooms</label>

          <input
            type="number"
            value={rooms}
            onChange={(e) =>
              setRooms(Number(e.target.value))
            }
          />

          <label>Bookings</label>

          <input
            type="number"
            value={bookings}
            onChange={(e) =>
              setBookings(Number(e.target.value))
            }
          />

          <label>Current Selling Rate</label>

          <input
            type="number"
            value={rate}
            onChange={(e) =>
              setRate(Number(e.target.value))
            }
          />

          <label>Rack Rate</label>

          <input
            type="number"
            value={rackRate}
            onChange={(e) =>
              setRackRate(Number(e.target.value))
            }
          />

          <label>Operating Cost</label>

          <input
            type="number"
            value={cost}
            onChange={(e) =>
              setCost(Number(e.target.value))
            }
          />

          <h3 className="section-label">
            Competitors
          </h3>

          <input
            type="number"
            value={compA}
            onChange={(e) =>
              setCompA(Number(e.target.value))
            }
          />

          <input
            type="number"
            value={compB}
            onChange={(e) =>
              setCompB(Number(e.target.value))
            }
          />

          <input
            type="number"
            value={compC}
            onChange={(e) =>
              setCompC(Number(e.target.value))
            }
          />

          <div className="market-average">
            <span>Market Average</span>

            <strong>
              ₦{competitorAvg.toLocaleString()}
            </strong>
          </div>

          <button
            className="calculate-btn"
            onClick={analyze}
            disabled={loading}
          >
            <Calculator size={18} />

            {loading
              ? "Analyzing..."
              : "Analyze (1 Credit)"}
          </button>
        </div>

        <div className="report-card">
          <h2>Revenue Report</h2>

          {!result ? (
            <div className="empty-report">
              <Calculator size={40} />

              <h3>Awaiting Analysis</h3>

              <p>
                Enter room data and click Analyze.
              </p>
            </div>
          ) : (
            <>
              <div className="success-message">
                <CheckCircle size={18} />

                Analysis saved to the cloud.
              </div>

              <div className="metric-row">
                <span>Occupancy</span>

                <strong>
                  {result.occupancy.toFixed(1)}%
                </strong>
              </div>

              <div className="metric-row">
                <span>Competitor Average</span>

                <strong>
                  ₦{competitorAvg.toLocaleString()}
                </strong>
              </div>

              <div className="metric-row">
                <span>RevPAR</span>

                <strong>
                  ₦
                  {Math.round(
                    result.revPAR
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="metric-row">
                <span>Rate Variance</span>

                <strong>
                  {result.variance.toFixed(1)}%
                </strong>
              </div>

              <div className="leakage-box">
                <TriangleAlert size={28} />

                <div>
                  <small>
                    Revenue Opportunity
                  </small>

                  <h2>
                    ₦
                    {Math.round(
                      result.opportunity
                    ).toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="recommend-box">
                <small>Recommended Rate</small>

                <h2>
                  ₦
                  {result.suggestedRate.toLocaleString()}
                </h2>

                <div className="severity-line">
                  <small>Severity</small>

                  <span
                    className={`severity ${result.severity.toLowerCase()}`}
                  >
                    {result.severity}
                  </span>
                </div>

                <p>{result.recommendation}</p>

                <hr />

                <small>
                  Remaining Credits
                </small>

                <h3>
                  {result.remainingCredits}
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}