/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Focus OTP input when step changes
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleLogin = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/responsable/connexion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Erreur inconnue", type: "error" });
        return;
      }

      setMessage({
        text: data.message || "Code envoyé à votre email",
        type: "success",
      });
      setStep("otp");
    } catch (err) {
      setMessage({ text: "Erreur de connexion au serveur", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/responsable/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Code OTP invalide", type: "error" });
        return;
      }

      localStorage.setItem("token", data.token);
      setMessage({ text: "Connexion réussie !", type: "success" });
      window.location.href = "/";
    } catch (err) {
      setMessage({ text: "Erreur de vérification OTP", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-400/60 to-blue-600/90 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image à gauche */}
        <div className="relative w-full md:w-[50%] h-64 md:h-auto flex items-center justify-center overflow-hidden">
          <img
            src="/images.jpeg"
            alt="fond"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/70 to-blue-600/70" />
          <div className="relative z-10 flex flex-col items-center justify-center text-white px-4 text-center">
            <img src="/logo.jpeg" alt="Logo" className="w-30 h-30 mb-2" />
            <h1 className="text-4xl lg:text-5xl font-bold">AUF-SARL</h1>
          </div>
        </div>

        {/* Formulaire à droite */}
        <div className="w-full md:w-[50%] p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">
            CONNEXION
          </h2>
          <h6 className="text-center mb-4 text-gray-600 font-medium">
            Accédez à votre compte
          </h6>

          {step === "login" && (
            <div className="space-y-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                  disabled={isLoading}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </span>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <p className="text-center text-gray-700">
                Un code a été envoyé à votre email
              </p>
              <input
                ref={otpInputRef}
                type="text"
                placeholder="Code OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-center tracking-widest"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? "Vérification..." : "Vérifier OTP"}
              </button>
            </div>
          )}

          {message && (
            <p
              className={`mt-4 text-center ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="mb-2">
              Vous n’avez pas de compte ?{" "}
              <a href="/sign-up" className="text-blue-600 hover:underline">
                Créer un compte
              </a>
            </p>
            <p>
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
