/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

type ClientPaiement = {
  client_id: number;
  client: string;
  prenom: string;
  telephone: string;
  statut: "complet" | "incomplet";
  produits: any[];
  paiements_detail: any[];
  dates_achat: string[];
  prixtotalproduit: number;
  total_paye: number;
  reste_a_payer: number;
};

type Facture = {
  facture_id?: number;
  client_id: number;
  client: string;
  prenom: string;
  telephone: string;
  statut: string;
  date_achat: string;
  produits: any[];
  paiements_detail: any[];
  prixtotalproduit: number;
  total_paye: number;
  reste_a_payer: number;
};

export default function AchatEtPaiementPage() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(""); // format YYYY-MM
  const router = useRouter();

  // --- Fetch factures ---
  const fetchFactures = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/achats/facture?ts=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setFactures(data);
    } catch (err) {
      console.error("Erreur chargement factures :", err);
      toast.error("Erreur chargement factures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  // --- Filtrage : clients qui n'ont rien payé dans le mois sélectionné ---
  const filteredFactures = useMemo(() => {
    if (!filterDate) return factures; // pas de filtre → tout afficher

    const [year, month] = filterDate.split("-").map(Number);

    return factures.filter((facture) => {
      const matchSearch =
        facture.client?.toLowerCase().includes(search.toLowerCase()) ||
        facture.prenom?.toLowerCase().includes(search.toLowerCase()) ||
        facture.telephone?.includes(search);

      // Vérifie si le client a déjà payé ce mois
      const aDejaPayeCeMois = facture.paiements_detail.some((p: any) => {
        const d = new Date(p.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      // S'affiche seulement si il n'a rien payé ce mois
      return matchSearch && !aDejaPayeCeMois;
    });
  }, [factures, search, filterDate]);

  // --- Regroupement par client ---
  const facturesParClient: ClientPaiement[] = useMemo(() => {
    const grouped: Record<number, ClientPaiement> = {};

    filteredFactures.forEach((facture) => {
      const id = facture.client_id;

      if (!grouped[id]) {
        grouped[id] = {
          client_id: id,
          client: facture.client,
          prenom: facture.prenom,
          telephone: facture.telephone,
          statut: facture.reste_a_payer === 0 ? "complet" : "incomplet",
          produits: [...(facture.produits || [])],
          paiements_detail: [...(facture.paiements_detail || [])],
          dates_achat: [facture.date_achat],
          prixtotalproduit: facture.prixtotalproduit,
          total_paye: facture.total_paye,
          reste_a_payer: facture.reste_a_payer,
        };
      } else {
        // Ajouter produits
        facture.produits?.forEach((p) => {
          const exist = grouped[id].produits.find((x) => x.nom === p.nom);
          if (exist) {
            exist.quantite += p.quantite;
            exist.total += p.total;
          } else {
            grouped[id].produits.push({ ...p });
          }
        });

        grouped[id].paiements_detail.push(...(facture.paiements_detail || []));
        grouped[id].dates_achat.push(facture.date_achat);
        grouped[id].prixtotalproduit += facture.prixtotalproduit;
        grouped[id].total_paye += facture.total_paye;
        grouped[id].reste_a_payer += facture.reste_a_payer;

        grouped[id].statut =
          grouped[id].reste_a_payer === 0 ? "complet" : "incomplet";
      }
    });

    return Object.values(grouped);
  }, [filteredFactures]);

  const resetFilters = () => {
    setSearch("");
    setFilterDate("");
  };

  return (
    <div className="p-4 bg-gradient-to-br from-red-400/50 to-blue-600/90 h-full">
      <div className="flex flex-col sm:flex-row justify-between text-white mb-2 gap-3">
        <input
          type="text"
          placeholder="🔍 Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-2 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
        />

        <input
          type="month"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full sm:w-1/3 px-2 py-2 border rounded shadow-sm text-black"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[300px] rounded-lg shadow">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[473px] overflow-y-auto">
          {facturesParClient.length === 0 && (
            <div className="text-white col-span-full text-center mt-10">
              Aucun client ne doit payer ce mois.
            </div>
          )}
          {facturesParClient.map((client) => {
            const isComplet = client.statut === "complet";

            return (
              <div
                key={client.client_id}
                onClick={() =>
                  router.push(
                    `/achatPro/${client.client_id}/${encodeURIComponent(
                      client.dates_achat[0]
                    )}`
                  )
                }
                className={`transition transform duration-200 rounded-2xl border p-4 shadow-md bg-white cursor-pointer
                ${
                  isComplet
                    ? "hover:scale-[1.01] hover:shadow-lg border-green-400"
                    : "hover:scale-[1.01] hover:shadow-lg border-red-400"
                }`}
              >
                <div className="text-xs text-gray-500 mb-2">
                  📅{" "}
                  {client.dates_achat
                    .map((d) => new Date(d).toLocaleDateString())
                    .join(", ")}
                </div>

                <div className="font-semibold text-blue-800">
                  {client.client} {client.prenom}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  📞 {client.telephone}
                </div>

                <div className="mt-2 text-sm">
                  <div>
                    Total produit: {client.prixtotalproduit.toLocaleString()} Ar
                  </div>
                  <div>Total payé: {client.total_paye.toLocaleString()} Ar</div>
                  <div>
                    Reste à payer: {client.reste_a_payer.toLocaleString()} Ar
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  {isComplet ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      ✅ Paiement complété
                    </div>
                  ) : (
                    <div className="text-red-600">⏳ Paiement en attente</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
