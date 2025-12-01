import Link from "next/link";
import { Button } from "../components/ui/button";

export function Hero() {
  return (
    <section
      id="accueil"
      className="bg-gradient-to-br from-red-400/60 to-blue-600/90  text-white  py-20"
    >
      <div className="container mx-auto max-w-5xl text-center text-white mt-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Bienvenue sur la plateforme AUF SARL !
        </h1>

        <p className="text-2xl md:text-2xl font-bold mb-6">
          N’hésitez pas, votre satisfaction est notre priorité.
        </p>
      </div>
    </section>
  );
}
