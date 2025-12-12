/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignInClient() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Focus sur l'input OTP lorsqu'on passe à cette étape
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email et mot de passe sont requis");
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/connexion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Client_email: email.trim(), password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de connexion");

      toast.success(data.message);
      setStep("otp");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Veuillez entrer le code OTP");
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP invalide");

      // Stocker token + infos client
      localStorage.setItem("token", data.token);
      localStorage.setItem("Client_role", data.user.Client_role);
      localStorage.setItem("clientId", data.user.id.toString());
      localStorage.setItem("Client_nom", data.user.Client_nom);
      localStorage.setItem("Client_prenom", data.user.Client_prenom || "");

      toast.success(data.message);
      router.push("/");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-400/60 to-blue-600/90 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image gauche */}
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

        {/* Formulaire droit */}
        <div className="w-full md:w-[50%] p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">
            CONNEXION
          </h2>
          <h6 className="text-center mb-4 text-gray-600 font-medium">
            Accédez à votre compte
          </h6>

          {step === "login" && (
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <div className="relative">
                <input
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
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form className="space-y-4" onSubmit={handleVerifyOTP}>
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
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? "Vérification..." : "Vérifier OTP"}
              </button>
            </form>
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
              <a href="/registre" className="text-blue-600 hover:underline">
                Créer un compte
              </a>
            </p>
            <p>
              <a
                href="/forgot-password/client"
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
