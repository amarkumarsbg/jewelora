import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <section className="flex justify-center items-center py-16 bg-cream min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-lg border border-border p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
    </section>
  );
};

export default SignIn;
