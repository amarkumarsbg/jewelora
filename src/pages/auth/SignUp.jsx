import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import MobileBackHeader from "../../components/ui/MobileBackHeader";

const SignUp = () => {
  const { currentUser, updateAuthUser, authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      updateAuthUser({ displayName: fullName });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="flex flex-col pt-0 pb-16 px-4 bg-cream min-h-[60vh]">
      <MobileBackHeader title="Sign Up" to="/" />
      <div className="flex justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white rounded-lg border border-border p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mx-auto">
        <h2 className="text-center font-heading text-2xl font-semibold text-neutral-dark mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-dark mb-2">Full Name</label>
            <input
              type="text"
              className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-dark mb-2">Email address</label>
            <input
              type="email"
              className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-dark mb-2">Password</label>
            <input
              type="password"
              className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-sm bg-error/10 text-error text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-full py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-neutral-mid">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary font-semibold hover:text-primary-dark">
            Sign In
          </Link>
        </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
