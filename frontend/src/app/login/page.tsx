"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginWithEmail, loginWithGoogle, signupWithEmail } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/movies");
    }
  }, [user, router]);

  const handleSubmit = () => {
    if (isLogin) {
      dispatch(loginWithEmail({ email, password }));
    } else {
      dispatch(signupWithEmail({ email, password }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Üst Butonlar */}
        <div className="flex mb-6 border-b border-gray-300">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 font-semibold ${
              isLogin ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 font-semibold ${
              !isLogin ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Başlığı */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h1>

        {/* Form */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button
          onClick={() => dispatch(loginWithGoogle())}
          className="w-full mt-3 border border-gray-300 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <Image src="/google-icon.svg" width={20} height={20} alt="Google" /> 
          Continue with Google
        </button>

        {/* Link ile geçiş */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </div>
    </div>
  );
}
