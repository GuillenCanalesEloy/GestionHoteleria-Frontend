import React from "react";

const MisReservas = () => {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 md:px-12 max-w-7xl mx-auto bg-white/90 backdrop-blur-md shadow-sm border-b z-50">
        <div className="text-xl font-bold uppercase">LuxeStay</div>

        <nav className="hidden md:flex items-center space-x-8">
          <a className="text-sm text-gray-600 hover:text-black" href="#">Home</a>
          <a className="text-sm text-gray-600 hover:text-black" href="#">Rooms</a>
          <a className="text-sm text-amber-600 border-b-2 border-amber-600 pb-1" href="#">My Bookings</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden md:block px-4 py-2 hover:bg-gray-100">
            Sign In
          </button>
          <button className="px-6 py-2 bg-black text-white rounded-lg">
            Book Now
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto w-full">

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-500 max-w-2xl">
            Manage your upcoming stays and review your past experiences.
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button className="px-6 py-2 rounded-full bg-black text-white">
            All Reservations
          </button>
          <button className="px-6 py-2 rounded-full bg-gray-200">
            Upcoming
          </button>
          <button className="px-6 py-2 rounded-full bg-gray-200">
            Completed
          </button>
          <button className="px-6 py-2 rounded-full bg-gray-200">
            Cancelled
          </button>
        </div>

        {/* TARJETA */}
        <div className="flex flex-col gap-6">

          {/* RESERVA 1 */}
          <div className="bg-white rounded-xl p-6 border shadow flex flex-col md:flex-row gap-6 items-center">

            <img
              className="w-full md:w-48 h-32 object-cover rounded-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrlRQHUUNvq62wV1YpWThz5ZrjOHOXrKELCrWvq2brm916kTrFZMeEwvlABighNmwWHYPjYT5GwtaHjcNrdQniDMGg3hK7G0sYJweHh-hVph9ghZXUDtjNzAMtXIRN3p7zNAQzOzL-m60ivQMhP5OKNtWbKMdmsfbeiONf1D0WsrQV9lQIlcJUddpOJWWwAM8dCK2D6Xq2P4xYrEipleH4BZDqt1LMaEQItb9slzc6ophojiLW0OYYF9khP0fBu3ovjkGm7HPOGRs"
              alt="suite"
            />

            <div className="flex-grow flex justify-between w-full">
              <div>
                <span className="text-sm text-green-600">Upcoming stay</span>
                <h3 className="text-xl font-semibold">The Presidential Suite</h3>
                <p className="text-gray-500">Dec 12 - Dec 18, 2024</p>
              </div>

              <div className="text-right">
                <span className="text-green-600 font-bold">Confirmed</span>
                <p className="text-lg font-bold">$4,250.00</p>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10 text-center">
        <p>© 2024 LuxeStay</p>
      </footer>

    </div>
  );
};

export default MisReservas;