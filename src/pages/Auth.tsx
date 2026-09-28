import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [hotel, setHotel] = useState("");
  const [manager, setManager] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function register() {
    if (!hotel || !manager || !email || !password) {
      alert("Please complete all fields.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("Registration failed.");
      setLoading(false);
      return;
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        id: user.id,
        hotel_name: hotel,
        manager_name: manager,
      });
    }

    // Check if wallet already exists
    const { data: existingWallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingWallet) {
      await supabase.from("wallets").insert({
        user_id: user.id,
        balance: 100,
      });

      // Opening bonus transaction
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "bonus",
        amount: 100,
        description: "Welcome bonus credits",
      });
    }

    alert("Hotel account created successfully!");

    setLoading(false);
  }

  async function login() {
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Hotel Revenue Intelligence</h1>

        <p>
          {isLogin
            ? "Manager Login"
            : "Create Hotel Account"}
        </p>

        {!isLogin && (
          <>
            <label>Hotel Name</label>

            <input
              value={hotel}
              onChange={(e) => setHotel(e.target.value)}
              placeholder="De Brit Hotel"
            />

            <label>Manager Name</label>

            <input
              value={manager}
              onChange={(e) =>
                setManager(e.target.value)
              }
              placeholder="Wale Adejuwon"
            />
          </>
        )}

        <label>Email Address</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hotel@email.com"
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="********"
        />

        <button
          onClick={isLogin ? login : register}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Create Account"}
        </button>

        <button
          className="switch"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Create a new hotel account"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}