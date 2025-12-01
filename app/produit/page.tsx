/* eslint-disable @next/next/no-img-element */
"use client";

export default function OMPayButton() {
  async function payer() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/paiement/api/pay/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 10, // montant fixe
            phone: "7701900014", // SANDBOX
          }),
        }
      );

      const data = await res.json();

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert("Erreur OM: " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Erreur réseau: " + err);
    }
  }

  return (
    <img
      src="/170421 logo_payer_OM-03_OK.JPG"
      width={80} // taille fixe
      style={{ cursor: "pointer" }}
      onClick={payer}
      alt="Payer avec Orange Money"
    />
  );
}
