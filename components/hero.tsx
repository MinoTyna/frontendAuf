import Link from "next/link";
import { Button } from "../components/ui/button";
import { FaStore, FaTags } from "react-icons/fa";

export function Hero() {
  return (
    <section
      id="accueil"
      className="bg-gradient-to-br from-red-400/60 to-blue-600/90 text-white py-28 md:py-40"
    >
      <div className="container mx-auto max-w-5xl text-center mt-[-50px]">
        {/* Titre principal */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
          Bienvenue chez <span className="text-orange-800">AUF SARL</span>
        </h1>
        {/* Phrase en petit */}
        <p className="text-lg md:text-xl lg:text-2xl font-medium mb-6">
          Si vous cherchez des ustensiles de cuisine, de l'électroménager ou
          encore des accessoires pour la maison, vous êtes au bon endroit. , des
          accessoires pour la maison et bien plus encore, vous êtes au bon
          endroit. Vous êtes au bon endroit.
        </p>
        {/* Phrase en gras */}
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Votre satisfaction est notre priorité.
        </h2>
        {/* Boutons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          {/* Bouton Promotion avec icône */}
          <button className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-orange-400 text-black cursor-pointer rounded-lg font-semibold transition">
            <FaTags />
            Promotion
          </button>

          {/* Bouton Tous Produits : cadre transparent orange */}
          <button className="flex items-center gap-2 px-8 py-3 border-2 border-orange-500 text-white bg-transparent hover:bg-orange-500 hover:text-white rounded-lg font-semibold transition">
            <FaStore />
            Tous les produits
          </button>
        </div>
      </div>
    </section>
  );
}
