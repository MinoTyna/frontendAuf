// "use client";

// interface OMPayButtonProps {
//   montant: number;
// }

// export default function OMPayButton({ montant }: OMPayButtonProps) {
//   const payer = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/paiement/api/pay/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: montant,
//             phone: "261379572691",
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.payment_url) {
//         window.location.href = data.payment_url;
//       } else {
//         alert("Erreur OM: " + JSON.stringify(data));
//       }
//     } catch (err) {
//       alert("Erreur réseau: " + err);
//     }
//   };

//   return (
//     <img
//       src="/170421 logo_payer_OM-03_OK.JPG"
//       width={80}
//       style={{ cursor: "pointer" }}
//       onClick={payer}
//       alt="Payer avec Orange Money"
//     />
//   );
// }
"use client";
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
