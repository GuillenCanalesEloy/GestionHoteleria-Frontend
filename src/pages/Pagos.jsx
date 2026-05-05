import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Header } from "./Home.jsx";
import { saveClientReservation } from "../services/clientReservationsStorage.js";

const defaultRoom = {
  title: "Grand Royal Suite",
  price: 700,
  image:
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900",
};

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function Pagos() {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room || defaultRoom;
  const reservation = location.state?.reservation;
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formatters = {
      cardNumber: formatCardNumber,
      expiry: formatExpiry,
      cvv: (input) => input.replace(/\D/g, "").slice(0, 4),
    };

    setFormData((current) => ({
      ...current,
      [name]: formatters[name](value),
    }));
  };

  const handlePay = (event) => {
    event.preventDefault();

    Swal.fire({
      title: "Procesando pago...",
      text: "Estamos validando tu tarjeta",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      saveClientReservation({
        id: `RES-${Date.now().toString().slice(-6)}`,
        title: room.title,
        status: "Confirmada",
        stage: "Proxima estadia",
        dates: reservation ? `${reservation.checkIn} - ${reservation.checkOut}` : "Fechas por confirmar",
        checkIn: reservation?.checkIn || "",
        checkOut: reservation?.checkOut || "",
        room: room.title,
        guests: reservation?.people || "2 Adultos",
        total: `$${room.price}.00`,
        guest: {
          name: reservation?.guestName || "Cliente",
          email: reservation?.guestEmail || "user@demo.com",
          phone: reservation?.guestPhone || "Sin telefono",
          requests: reservation?.specialRequests || "Sin peticiones especiales.",
        },
        payment: {
          transactionId: `TRX-${Date.now().toString().slice(-6)}`,
          method: paymentMethod === "paypal" ? "PayPal" : "Tarjeta",
          cardLast4:
            paymentMethod === "card"
              ? formData.cardNumber.replace(/\D/g, "").slice(-4)
              : "",
          paidAt: new Date().toISOString(),
        },
        image: room.image,
      });

      Swal.fire({
        icon: "success",
        title: "Pago confirmado",
        text: `Tu reserva en ${room.title} ha sido procesada con exito.`,
        confirmButtonText: "Ver mis reservas",
        confirmButtonColor: "#041627",
      }).then(() => {
        navigate("/mis-reservas");
      });
    }, 1200);
  };

  return (
    <div className="home-page pagos-page">
      <Header />

      <main className="pagos-main">
        <button className="pagos-back-button" type="button" onClick={() => navigate(-1)}>
          Volver
        </button>

        <section className="pagos-heading">
          <p className="section-kicker">Pago seguro</p>
          <h1>Finaliza tu reserva</h1>
          <p>Ingresa los datos de tu tarjeta para confirmar la reserva seleccionada.</p>
        </section>

        <section className="pagos-layout">
          <form className="pagos-form" onSubmit={handlePay}>
            <div className="payment-method-card">
              <button
                className={paymentMethod === "card" ? "active" : ""}
                type="button"
                onClick={() => setPaymentMethod("card")}
              >
                Tarjeta de credito o debito
              </button>
              <button
                className={paymentMethod === "paypal" ? "active" : ""}
                type="button"
                onClick={() => setPaymentMethod("paypal")}
              >
                PayPal
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="payment-fields">
                <label className="payment-field">
                  <span>Numero de tarjeta</span>
                  <input
                    inputMode="numeric"
                    name="cardNumber"
                    pattern="[0-9 ]{19}"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="payment-field">
                  <span>Expiracion</span>
                  <input
                    inputMode="numeric"
                    name="expiry"
                    pattern="[0-9]{2}/[0-9]{2}"
                    placeholder="MM/YY"
                    type="text"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="payment-field">
                  <span>CVV</span>
                  <input
                    inputMode="numeric"
                    name="cvv"
                    pattern="[0-9]{3,4}"
                    placeholder="123"
                    type="password"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            )}

            <div className="payment-security-note">
              Pago 100% seguro con validacion cifrada.
            </div>

            <button className="payment-submit" type="submit">
              Pagar ${room.price}.00
            </button>
          </form>

          <aside className="payment-summary">
            <img src={room.image} alt={room.title} />
            <div>
              <span>Resumen</span>
              <h2>{room.title}</h2>
              <div className="payment-summary-row">
                <small>Fechas</small>
                <strong>
                  {reservation ? `${reservation.checkIn} - ${reservation.checkOut}` : "Por confirmar"}
                </strong>
              </div>
              <div className="payment-summary-row">
                <small>Huespedes</small>
                <strong>{reservation?.people || "2 Adultos"}</strong>
              </div>
              <div className="payment-total">
                <small>Total</small>
                <strong>${room.price}.00</strong>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Pagos;
