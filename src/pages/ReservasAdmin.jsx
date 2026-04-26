import { useState } from "react";

const reservations = [
  {
    id: "#RES-94021",
    initials: "JD",
    name: "Julianne Deville",
    room: "Suite 402",
    checkIn: { date: "Oct 24, 2023", time: "14:00 PM" },
    checkOut: { date: "Oct 28, 2023", time: "11:00 AM" },
    status: "Confirmed",
  },
  {
    id: "#RES-94025",
    initials: "RH",
    name: "Robert Harrison",
    room: "Deluxe 205",
    checkIn: { date: "Oct 23, 2023", time: "15:30 PM" },
    checkOut: { date: "Oct 24, 2023", time: "10:00 AM" },
    status: "Checked-out",
  },
  {
    id: "#RES-94030",
    initials: "ES",
    name: "Elena Sokolova",
    room: "Penthouse 1",
    checkIn: { date: "Oct 26, 2023", time: "12:00 PM" },
    checkOut: { date: "Nov 02, 2023", time: "11:00 AM" },
    status: "Canceled",
  },
  {
    id: "#RES-94033",
    initials: "MW",
    name: "Michael Wu",
    room: "Standard 304",
    checkIn: { date: "Oct 25, 2023", time: "14:00 PM" },
    checkOut: { date: "Oct 27, 2023", time: "11:00 AM" },
    status: "Confirmed",
  },
];

const statusStyles = {
  Confirmed: "bg-green-50 text-green-700 border border-green-100",
  "Checked-out": "bg-slate-100 text-slate-600 border border-slate-200",
  Canceled: "bg-red-50 text-red-700 border border-red-100",
};

const statusDot = {
  Confirmed: "bg-green-600",
  "Checked-out": "bg-slate-500",
  Canceled: "bg-red-600",
};

const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "bed", label: "Rooms" },
  { icon: "group", label: "Clients" },
  { icon: "calendar_month", label: "Bookings", active: true },
  { icon: "payments", label: "Payments" },
  { icon: "badge", label: "Employees" },
  { icon: "analytics", label: "Reports" },
];

const stats = [
  {
    icon: "event_available",
    iconBg: "bg-blue-50 text-blue-600",
    label: "Total Bookings",
    value: "1,284",
    badge: "+12%",
    badgeStyle: "text-green-600 bg-green-50",
  },
  {
    icon: "login",
    iconBg: "bg-amber-50 text-amber-600",
    label: "Check-ins Today",
    value: "42",
    badge: "Today",
    badgeStyle: "text-slate-400",
  },
  {
    icon: "logout",
    iconBg: "bg-purple-50 text-purple-600",
    label: "Check-outs Today",
    value: "38",
    badge: "Today",
    badgeStyle: "text-slate-400",
  },
  {
    icon: "payments",
    iconBg: "bg-emerald-50 text-emerald-600",
    label: "Total Revenue",
    value: "$42,390",
    badge: "+8.4%",
    badgeStyle: "text-green-600 bg-green-50",
  },
];

const occupancyGrid = [
  { room: "101", days: [true, true, true, false, false, true, true] },
  { room: "102", days: [false, false, true, true, true, true, true] },
];

const dayLabels = ["MON 23", "TUE 24", "WED 25", "THU 26", "FRI 27", "SAT 28", "SUN 29"];

const todos = [
  {
    icon: "cleaning_services",
    iconBg: "bg-amber-100 text-amber-600",
    title: "Suite 402 - Clean",
    sub: "Scheduled for 11:30 AM",
    right: <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-tighter">Urgent</span>,
    dim: false,
  },
  {
    icon: "restaurant",
    iconBg: "bg-blue-100 text-blue-600",
    title: "Room 105 - Breakfast",
    sub: "Service: Continental",
    right: <span className="material-symbols-outlined text-slate-300 text-sm">check_circle</span>,
    dim: false,
  },
  {
    icon: "luggage",
    iconBg: "bg-slate-200 text-slate-500",
    title: "Lobby - Porter Assist",
    sub: "Completed at 09:15 AM",
    right: <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>,
    dim: true,
  },
];

export default function ReservasAdmin() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="flex min-h-screen bg-[#f9f9ff] font-sans text-[#111c2c]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-slate-200 bg-white shadow-sm flex flex-col py-6 px-4 z-50">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 bg-[#041627] rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              apartment
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">LuxeManage</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#775a19] font-bold mt-1">Premium Operations</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                item.active
                  ? "bg-slate-50 text-slate-900 font-semibold border-r-2 border-slate-900"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto px-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600">
              MV
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Marcus Vane</p>
              <p className="text-xs text-slate-500 truncate">General Manager</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm">more_vert</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[280px] flex flex-col flex-1">
        {/* TopBar */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center h-16 px-8">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400"
                placeholder="Search guests, booking ID, or room..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-sm font-medium text-slate-900">Admin Profile</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-[#775a19] uppercase tracking-widest mb-2">
                <span>Operations</span>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-slate-400">Reservations</span>
              </nav>
              <h2 className="text-3xl font-bold text-[#111c2c]">Reservations</h2>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filters
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#041627] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md">
                <span className="material-symbols-outlined text-sm">add</span>
                New Booking
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${s.iconBg}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.badgeStyle}`}>{s.badge}</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold">Recent Reservations</h3>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined">download</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined">print</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 border-b border-slate-100">Guest Name</th>
                    <th className="px-6 py-4 border-b border-slate-100">Room #</th>
                    <th className="px-6 py-4 border-b border-slate-100">Check-in</th>
                    <th className="px-6 py-4 border-b border-slate-100">Check-out</th>
                    <th className="px-6 py-4 border-b border-slate-100">Status</th>
                    <th className="px-6 py-4 border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservations.map((r, i) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/50 transition-colors"
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[#041627]">
                            {r.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{r.name}</p>
                            <p className="text-xs text-slate-400">ID: {r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium py-1 px-2 bg-slate-100 rounded text-slate-700">
                          {r.room}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{r.checkIn.date}</p>
                        <p className="text-xs text-slate-400">{r.checkIn.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{r.checkOut.date}</p>
                        <p className="text-xs text-slate-400">{r.checkOut.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold ${statusStyles[r.status]}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[r.status]}`}></span>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={`flex justify-end gap-2 transition-opacity ${hoveredRow === i ? "opacity-100" : "opacity-0"}`}
                        >
                          {r.status === "Confirmed" && (
                            <>
                              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Check-in">
                                <span className="material-symbols-outlined text-sm">login</span>
                              </button>
                              <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                                <span className="material-symbols-outlined text-sm">edit</span>
                              </button>
                              <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </>
                          )}
                          {r.status === "Checked-out" && (
                            <>
                              <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                              </button>
                              <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Invoice">
                                <span className="material-symbols-outlined text-sm">receipt_long</span>
                              </button>
                            </>
                          )}
                          {r.status === "Canceled" && (
                            <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Restore">
                              <span className="material-symbols-outlined text-sm">history</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Showing 1 to 4 of 1,284 entries</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${
                      p === 1
                        ? "bg-[#041627] text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-white transition-colors"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Occupancy */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Occupancy Overview</h3>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-[#041627]"></span> Booked
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span> Available
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-1">
                  <div className="w-16 h-10 flex items-center justify-center text-[10px] font-bold text-slate-400 border-r border-slate-100">
                    Room
                  </div>
                  <div className="flex-1 grid grid-cols-7 gap-1">
                    {dayLabels.map((d) => (
                      <div key={d} className="text-[10px] font-bold text-slate-400 text-center">{d}</div>
                    ))}
                  </div>
                </div>

                {occupancyGrid.map((row) => (
                  <div key={row.room} className="flex gap-1">
                    <div className="w-16 h-8 flex items-center justify-center text-[10px] font-bold bg-slate-50 border border-slate-100 rounded">
                      {row.room}
                    </div>
                    <div className="flex-1 grid grid-cols-7 gap-1">
                      {row.days.map((booked, idx) => (
                        <div
                          key={idx}
                          className={`h-8 rounded border ${
                            booked
                              ? "bg-[#041627]/10 border-[#041627]/20"
                              : "bg-slate-50 border-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff To-Do */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-6">Staff To-Do</h3>
              <div className="space-y-4">
                {todos.map((t, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 bg-slate-50 rounded-xl ${t.dim ? "opacity-60" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
                      <span className="material-symbols-outlined text-sm">{t.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{t.title}</p>
                      <p className="text-xs text-slate-500">{t.sub}</p>
                    </div>
                    {t.right}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm font-bold text-[#041627] border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                View Full Schedule
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}