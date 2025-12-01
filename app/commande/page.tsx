"use client";

import { CheckCircle, ThumbsUp, UserCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

type Produit = {
  id: number;
  nom: string;
  quantite: number;
  prix: number;
};

type Client = {
  id: number;
  nom: string;
  prenom: string;
};

type Notification = {
  id: number;
  client: Client;
  mode_reception?: string;
  produit_nom?: string;
  produits?: Produit[];
  message: string;
  vue: boolean; // côté admin
  vue_client: boolean; // côté client
  created_at: string;
  url?: string;
};

export default function Commande() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmId, setShowConfirmId] = useState<number | null>(null); // ✅ modal spécifique à une notif
  const [confirmingIds, setConfirmingIds] = useState<number[]>([]); // ✅ suivi des notifs déjà confirmées

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/achats/notifications?ts=${Date.now()}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Erreur serveur");

        const data: Notification[] = await res.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error);
        setNotifications([]);
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAccepter = async (notifId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/achats/notifications/${notifId}/accepter/`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Erreur serveur");

      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, vue: true } : n))
      );
    } catch (err) {
      console.error("Erreur accepter notification:", err);
    }
  };

  const handleConfirmClick = async (notifId: number) => {
    // ✅ mise à jour immédiate de l'état
    setConfirmingIds((prev) => [...prev, notifId]);
    setShowConfirmId(null);
    try {
      await handleAccepter(notifId);
    } catch (err) {
      console.error("Erreur lors de la confirmation :", err);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 bg-gradient-to-br from-red-400/50 to-blue-600/90 p-6">
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br">
          <LoadingSpinner />
        </div>
      ) : notifications.length === 0 ? (
        <p>Aucune notification pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border">Client</th>
                <th className="py-2 px-4 border">Produits</th>
                <th className="py-2 px-4 border">Mode réception</th>
                <th className="py-2 px-4 border text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => {
                const isConfirmed =
                  confirmingIds.includes(notif.id) || notif.vue_client;

                return (
                  <tr key={notif.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border text-center">
                      {notif.client.nom} {notif.client.prenom}
                    </td>

                    <td className="py-2 px-4 border text-center">
                      {notif.produits && notif.produits.length > 0 ? (
                        <ul className="list-disc list-inside text-left">
                          {notif.produits.map((p) => (
                            <li key={p.id}>
                              {p.nom} ({p.quantite}) – {p.prix.toLocaleString()}{" "}
                              Ar
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="py-2 px-4 border text-center">
                      {notif.mode_reception || "—"}
                    </td>

                    <td className="py-2 px-4 border text-center relative">
                      {!notif.vue && !isConfirmed && (
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-green-700"
                          onClick={() => setShowConfirmId(notif.id)}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                      )}

                      {!notif.vue && isConfirmed && (
                        <span className="text-blue-600 font-semibold flex justify-center items-center">
                          <CheckCircle className="w-5 h-5" />
                        </span>
                      )}

                      {notif.vue && !notif.vue_client && (
                        <span className="text-green-600 font-semibold flex justify-center items-center">
                          <UserCheck className="w-5 h-5" />
                        </span>
                      )}

                      {notif.vue && notif.vue_client && (
                        <span className="text-purple-600 font-semibold">
                          Lu (admin & client)
                        </span>
                      )}

                      {/* ✅ Modal spécifique à la notif */}
                      {showConfirmId === notif.id && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-xl shadow-lg p-6 w-120 text-center">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                              Confirmation
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Voulez-vous accepter cette notification ?
                            </p>
                            <div className="flex justify-center space-x-4">
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded cursor-pointer"
                                onClick={() => handleConfirmClick(notif.id)}
                              >
                                Oui
                              </button>
                              <button
                                className="bg-red-400 hover:bg-red-600 text-gray-800 px-4 py-1 rounded cursor-pointer"
                                onClick={() => setShowConfirmId(null)}
                              >
                                Non
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
