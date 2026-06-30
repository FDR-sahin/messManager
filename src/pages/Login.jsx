import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { auth } from "../firebase/config";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Login shofol hoyeche!");
      navigate("/"); // App.jsx er root route role onujayi redirect korbe
    } catch (err) {
      console.error(err);
      setError("Email ba password thik nei. Aro ekbar try korun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate2-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto mb-4"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l9-7 9 7M5 10v9h14v-9M9 19v-5h6v5" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-slate2-900">
            MessManager
          </h1>
          <p className="text-slate2-400 mt-1 text-sm">
            Apnar flat-er bazar, bill ar notice — sob ekhane
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="card space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="apnar@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-red text-sm bg-accent-red/10 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="btn-primary w-full"
          >
            {loading ? "Login hocche..." : "Login Korun"}
          </motion.button>

          <p className="text-center text-xs text-slate2-400">
            Account nei? Admin-er sathe jogajog korun account banar jonno.
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default Login;
