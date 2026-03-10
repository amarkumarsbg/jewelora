import React from "react";
import { Link, Navigate } from "react-router-dom";
import MobileBackHeader from "../../components/ui/MobileBackHeader";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const { currentUser, authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <section className="flex justify-center items-center py-16 px-4 bg-cream min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }
  if (currentUser) return <Navigate to="/" replace />;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="flex flex-col pt-0 pb-16 px-4 bg-cream min-h-[60vh]">
      <MobileBackHeader title="Sign In" to="/" />
      <div className="flex justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white rounded-lg border border-border p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mx-auto">
        <h2 className="text-center font-heading text-2xl font-semibold text-neutral-dark mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Email address
            </label>
            <input
              type="email"
              className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-sm bg-error/10 text-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-full py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-neutral-mid">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-dark">
            Sign Up
          </Link>
        </p>
      </div>
      </div>
    </section>
  );
};

export default SignIn;
