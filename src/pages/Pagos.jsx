import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Pagos = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenemos los datos de la habitación (si vienen desde Detalle)
  // Si no hay datos, usamos unos por defecto para que no explote
  const room = location.state?.room || {
    title: "Grand Royal Suite",
    price: 700,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900",
  };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = (e) => {
    e.preventDefault();

    // Simulación de procesamiento
    Swal.fire({
      title: "Procesando pago...",
      text: "Estamos validando tu tarjeta",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "¡Pago Confirmado!",
        text: `Tu reserva en ${room.title} ha sido procesada con éxito.`,
        confirmButtonText: "Ver mis Reservas",
        confirmButtonColor: "#041627",
      }).then(() => {
        navigate("/mis-reservas"); // O la ruta que prefieras
      });
    }, 2000);
  };

  return (
    <main className="flex-grow pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto w-full font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-slate-500 text-sm">
        <span>Stays</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span>{room.title}</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-slate-900 font-semibold">Payment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Métodos de Pago */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Método de Pago
            </h2>

            <form onSubmit={handlePay} className="space-y-4">
              {/* Opción Tarjeta */}
              <div
                className={`border-2 rounded-xl p-6 transition-all ${paymentMethod === "card" ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}
              >
                <label
                  className="flex items-center justify-between cursor-pointer mb-6"
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-900">
                      {paymentMethod === "card"
                        ? "radio_button_checked"
                        : "radio_button_unchecked"}
                    </span>
                    <span className="font-semibold text-slate-900">
                      Tarjeta de Crédito o Débito
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-500">
                    credit_card
                  </span>
                </label>

                {paymentMethod === "card" && (
                  <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        name="cardNumber"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                        placeholder="0000 0000 0000 0000"
                        type="text"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Expiración
                      </label>
                      <input
                        name="expiry"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                        placeholder="MM/YY"
                        type="text"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        CVV
                      </label>
                      <input
                        name="cvv"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                        placeholder="***"
                        type="password"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal (Solo UI) */}
              <div
                className="border border-slate-200 rounded-xl p-6 hover:border-slate-400 transition-all cursor-pointer"
                onClick={() => setPaymentMethod("paypal")}
              >
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">
                      {paymentMethod === "paypal"
                        ? "radio_button_checked"
                        : "radio_button_unchecked"}
                    </span>
                    <span className="font-semibold text-slate-900">PayPal</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-500">
                    account_balance_wallet
                  </span>
                </label>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 border-t border-slate-100 pt-6 opacity-60">
                <span className="material-symbols-outlined text-slate-900">
                  verified_user
                </span>
                <p className="text-sm text-slate-500">
                  Pago 100% Seguro con encriptación SSL
                </p>
              </div>
            </form>
          </section>
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="lg:col-span-5">
          <aside className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="h-48 -mx-6 -mt-6 mb-6 relative">
                <img
                  alt={room.title}
                  className="w-full h-full object-cover"
                  src={room.image}
                />
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  GUEST FAVORITE
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{room.title}</h3>

              <div className="space-y-4 py-6 border-y border-slate-100 mt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fechas</span>
                  <span className="font-semibold text-slate-900">
                    12 - 15 Mayo, 2026
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Huéspedes</span>
                  <span className="font-semibold text-slate-900">
                    2 Adultos
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-6">
                <div className="flex justify-between text-sm">
                  <span>Precio base</span>
                  <span>€{room.price}.00</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600 font-medium">
                  <span>Descuento UTP</span>
                  <span>-€35.00</span>
                </div>
                <div className="flex justify-between text-2xl text-slate-900 pt-6 border-t border-slate-100 mt-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">€{room.price - 35}.00</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-lg font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                Pagar €{room.price - 35}.00
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Pagos;
