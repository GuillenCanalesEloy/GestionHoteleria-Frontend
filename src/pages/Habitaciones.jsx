import React from 'react';

const Habitaciones = () => {
  return (
    <div className="text-on-surface bg-[#f9f9ff] min-h-screen font-['Inter']">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md text-slate-900 border-b border-slate-200 shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 md:px-12 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter uppercase">LuxeStay</div>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide">
            <a className="text-slate-600 hover:text-slate-900 transition-all duration-300" href="/">Home</a>
            <a className="text-amber-600 border-b-2 border-amber-600 pb-1" href="/habitaciones">Rooms</a>
            <a className="text-slate-600 hover:text-slate-900 transition-all duration-300" href="#">My Bookings</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-4 py-2 text-slate-900 font-medium hover:bg-slate-50 transition-all duration-300 active:scale-95">Sign In</button>
            <button className="bg-[#041627] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all active:scale-95">Book Now</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar - Filtros */}
          <aside className="md:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold mb-6">Filters</h2>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold block mb-4 uppercase text-slate-500 tracking-wider">Price Range</span>
                  <input className="w-full accent-[#775a19]" max="1000" min="100" type="range" />
                  <div className="flex justify-between mt-2 text-sm text-slate-500">
                    <span>$100</span>
                    <span>$1000+</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold block mb-4 uppercase text-slate-500 tracking-wider">Room Type</span>
                  <div className="space-y-3">
                    {['Single Room', 'Double Classic', 'Luxury Suite'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          className="w-5 h-5 rounded border-slate-300 text-[#775a19] focus:ring-[#775a19]" 
                          type="checkbox" 
                          defaultChecked={type === 'Luxury Suite'} 
                        />
                        <span className="text-md group-hover:text-[#775a19] transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold block mb-4 uppercase text-slate-500 tracking-wider">Availability</span>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm">Instant Booking</span>
                    <div className="w-10 h-5 bg-[#775a19] rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#041627] text-white rounded-lg font-bold mt-4 hover:opacity-90 transition-all">
                  Apply Filters
                </button>
              </div>
            </div>

            <div className="hidden md:block bg-amber-50 p-6 rounded-xl border border-amber-200">
              <span className="material-symbols-outlined text-[#775a19] mb-3">auto_awesome</span>
              <h4 className="text-lg font-bold text-[#5d4201] mb-2">Member Discount</h4>
              <p className="text-sm text-[#5d4201]">Log in to save an additional 15% on all suite bookings this season.</p>
            </div>
          </aside>

          {/* Grid de Habitaciones */}
          <div className="md:col-span-9">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#041627]">Explore Rooms</h1>
                <p className="text-slate-500 mt-2">Showing 12 luxury stays available for your dates.</p>
              </div>
              <div className="hidden sm:flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button className="p-2 bg-white shadow-sm rounded-md"><span className="material-symbols-outlined">grid_view</span></button>
                <button className="p-2 text-slate-500"><span className="material-symbols-outlined">format_list_bulleted</span></button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Ejemplo de una Card */}
              <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800" 
                    alt="Presidential Suite"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#775a19]">Suite</div>
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#041627] group-hover:text-[#775a19] transition-colors">Presidential Suite</h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#775a19] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 mb-6">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span className="text-xs">4 Adults</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">aspect_ratio</span>
                      <span className="text-xs">85m²</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Per Night</span>
                      <span className="text-xl font-bold text-[#041627]">$450</span>
                    </div>
                    <button className="px-5 py-2 bg-[#041627] text-white rounded-lg text-sm hover:opacity-90 transition-all">Ver Detalle</button>
                  </div>
                </div>
              </div>
              {/* Aquí podrías repetir la card con un .map() */}
            </div>

            {/* Paginación */}
            <div className="mt-12 flex justify-center">
              <nav className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-[#775a19] hover:text-[#775a19] transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#775a19] text-white font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-[#775a19] hover:text-[#775a19] transition-all">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-[#775a19] hover:text-[#775a19] transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-100 border-t border-slate-800 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="text-lg font-bold text-amber-500 mb-4 uppercase">LuxeStay</div>
            <p className="text-xs font-light text-slate-400">Curating the world's most sophisticated accommodation experiences since 2012.</p>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest">Explore</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a className="hover:text-white transition-colors" href="#">Our Rooms</a>
              <a className="hover:text-white transition-colors" href="#">Special Offers</a>
              <a className="hover:text-white transition-colors" href="#">Dining</a>
              <a className="hover:text-white transition-colors" href="#">Spa & Wellness</a>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a className="hover:text-white transition-colors" href="#">About Us</a>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="#">Contact Support</a>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-4">Subscribe for exclusive early access and seasonal rewards.</p>
            <div className="flex gap-2">
              <input className="bg-slate-800 border-none rounded-lg px-4 py-2 text-xs text-white focus:ring-1 focus:ring-amber-500 w-full" placeholder="Your email" type="email" />
              <button className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-400 transition-all">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Habitaciones;