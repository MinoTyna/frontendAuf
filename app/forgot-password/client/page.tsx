"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/client/forgot-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email introuvable");
      toast.success("OTP envoyé à votre email !");
      setStep("otp");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/client/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP invalide");
      toast.success("OTP vérifié !");
      setStep("password");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/client/reset-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, new_password: newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erreur lors de la réinitialisation");
      toast.success("Mot de passe réinitialisé avec succès !");
      router.push("/connexion");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-400/50 to-blue-600/90 p-4">
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
            <img src="/logo.jpeg" alt="Logo" className="w-20 h-20 mb-2" />
            <h1 className="text-2xl lg:text-3xl font-bold">AUF-SARL</h1>
          </div>
        </div>

        {/* Formulaire droite */}
        <div className="w-full md:w-[50%] p-6 lg:p-8">
          <h2 className="lg:text-2xl font-bold text-gray-800 mb-6 text-center">
            MOT DE PASSE OUBLIÉ
          </h2>

          {step === "email" && (
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className="w-full bg-red-400 hover:bg-red-600 text-white p-3 rounded"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-800 text-white p-3 rounded"
                >
                  {isLoading ? "Vérification..." : "Envoyer OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                placeholder="Code OTP"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 p-3 rounded"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded"
                >
                  {isLoading ? "Vérification..." : "Vérifier OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 p-3 rounded"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded"
                >
                  {isLoading ? "Réinitialisation..." : "Réinitialiser"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
