import { useState } from "react";

const guests = [
  {
    id: "#LM-9021",
    initials: "EH",
    name: "Eleanor Henderson",
    email: "e.henderson@example.com",
    phone: "+1 (555) 012-3456",
    bookings: 12,
    bookingsBadge: "↑ 2",
    status: "VIP",
    latestStay: "Oct 12 - Oct 15, 2023",
  },
  {
    id: "#LM-8842",
    initials: "JV",
    name: "Julian Vance",
    email: "julian.v@techcorp.com",
    phone: "+44 20 7946 0123",
    bookings: 4,
    bookingsBadge: null,
    status: "ACTIVE",
    latestStay: "Nov 02 - Nov 05, 2023",
  },
  {
    id: "#LM-9055",
    initials: "SC",
    name: "Sofia Castillo",
    email: "sofia.castillo@global.net",
    phone: "+34 912 34 56 78",
    bookings: 28,
    bookingsBadge: null,
    status: "VIP",
    latestStay: "In-house (Checking out tomorrow)",
  },
  {
    id: "#LM-9102",
    initials: "AO",
    name: "Amara Okafor",
    email: "amara.okafor@agency.com",
    phone: "+234 803 123 4567",
    bookings: 2,
    bookingsBadge: null,
    status: "ACTIVE",
    latestStay: "First Stay (Completed Oct 05)",
  },
];

const stats = [
  {
    icon: "groups",
    iconBg: "bg-slate-50 text-[#041627]",
    label: "TOTAL GUESTS",
    value: "2,482",
  },
  {
    icon: "star",
    iconBg: "bg-amber-50 text-[#775a19]",
    label: "VIP MEMBERS",
    value: "156",
    filled: true,
  },
  {
    icon: "event_available",
    iconBg: "bg-green-50 text-green-600",
    label: "CURRENTLY IN-HOUSE",
    value: "42",
  },
  {
    icon: "trending_up",
    iconBg: "bg-slate-50 text-[#041627]",
    label: "NEW THIS MONTH",
    value: "+12.5%",
  },
];

const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "bed", label: "Rooms" },
  { icon: "group", label: "Clients", active: true },
  { icon: "calendar_month", label: "Bookings" },
  { icon: "payments", label: "Payments" },
  { icon: "badge", label: "Employees" },
  { icon: "analytics", label: "Reports" },
];

const inquiries = [
  {
    dotColor: "bg-[#775a19]",
    title: "Eleanor Henderson requested early check-in",
    sub: "Requested for reservation #LM-BOOK-4201 • 2 hours ago",
    message:
      "Arriving on the 10:30 AM flight from London. Would appreciate if Room 402 is ready slightly earlier.",
    showReply: true,
  },
  {
    dotColor: "bg-green-500",
    title: "Julian Vance confirmed spa booking",
    sub: "Confirmed for Nov 03, 4:00 PM • 5 hours ago",
    message: null,
    showReply: false,
  },
];

export default function ClientesAdmin() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="flex min-h-screen bg-[#f9f9ff] font-sans text-[#111c2c]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-slate-200 bg-white shadow-sm flex flex-col py-6 px-4 z-50">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#041627] flex items-center justify-center text-white">
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
                  ? "bg-slate-50 text-slate-900 font-semibold border-r-2 border-slate-900 shadow-sm"
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

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600">
              MS
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-slate-900 truncate">Marcus Sterling</p>
              <p className="text-xs text-slate-500 truncate">General Manager</p>
            </div>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400"
                placeholder="Search guests, email, or reservation ID..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-4 text-slate-500">
              <button className="hover:text-slate-900 transition-colors p-1 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </button>
              <button className="hover:text-slate-900 transition-colors p-1">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-900 hover:opacity-80 transition-opacity">
              <span>Admin Profile</span>
              <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-[#775a19] uppercase tracking-widest mb-2">
                <span>Directory</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-slate-400 tracking-widest">All Guests</span>
              </nav>
              <h2 className="text-4xl font-bold text-[#041627]">Guest Directory</h2>
              <p className="text-slate-500 mt-2 text-sm">
                Manage your guest relationships and detailed stay history across all properties.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-[#041627] hover:bg-slate-50 transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">file_download</span>
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#041627] text-white font-semibold hover:opacity-90 transition-all shadow-md">
                <span className="material-symbols-outlined text-lg">person_add</span>
                Register New Guest
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.iconBg}`}>
                  <span
                    className="material-symbols-outlined"
                    style={s.filled ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {s.icon}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-bold text-[#041627]">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Show:</span>
                  <select className="bg-transparent border-none focus:ring-0 font-medium text-slate-900 py-0 pr-8">
                    <option>25 entries</option>
                    <option>50 entries</option>
                    <option>100 entries</option>
                  </select>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md hover:bg-white transition-colors text-slate-500">
                    <span className="material-symbols-outlined text-lg">filter_list</span>
                  </button>
                  <span className="text-sm font-medium text-slate-600">Filters</span>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Displaying 1-25 of 2,482 Guests
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    {["Guest Name", "Contact Information", "Total Bookings", "Loyalty Status", "Latest Stay", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {guests.map((g, i) => (
                    <tr
                      key={g.id}
                      className="hover:bg-slate-50/80 transition-colors"
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-[#041627]">
                            {g.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{g.name}</div>
                            <div className="text-xs text-slate-500">Guest ID: {g.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{g.email}</div>
                        <div className="text-xs text-slate-500">{g.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{g.bookings}</span>
                          {g.bookingsBadge && (
                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                              {g.bookingsBadge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {g.status === "VIP" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            VIP
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{g.latestStay}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end gap-2 transition-opacity ${hoveredRow === i ? "opacity-100" : "opacity-0"}`}>
                          <button className="p-2 text-slate-400 hover:text-[#041627] hover:bg-slate-100 rounded-lg transition-all" title="View Profile">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button className="p-2 text-slate-400 hover:text-[#041627] hover:bg-slate-100 rounded-lg transition-all" title="History">
                            <span className="material-symbols-outlined">history</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">1</span> to{" "}
                <span className="font-medium text-slate-900">25</span> of{" "}
                <span className="font-medium text-slate-900">2,482</span> results
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed" disabled>
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`w-8 h-8 rounded-lg text-xs font-bold ${
                      p === 1 ? "bg-[#041627] text-white" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-2 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-xs">100</button>
                <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Recent Inquiries */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-[#041627] mb-6">Recent Guest Inquiries</h3>
              <div className="space-y-6">
                {inquiries.map((inq, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${inq.dotColor}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{inq.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{inq.sub}</p>
                      {inq.message && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                          "{inq.message}"
                        </div>
                      )}
                    </div>
                    {inq.showReply && (
                      <button className="text-xs font-bold text-[#775a19] uppercase tracking-wider hover:underline flex-shrink-0">
                        REPLY
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty Insights */}
            <div className="bg-[#1a2b3c] text-white rounded-xl p-8 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-[#775a19] tracking-widest bg-white/10 px-2 py-1 rounded uppercase">
                  Insights
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-2 text-white">Loyalty Growth</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  VIP conversions are up{" "}
                  <span className="text-[#e9c176] font-bold">14%</span> this quarter. Consider offering
                  complimentary lounge access to "Active" status guests with &gt;10 bookings.
                </p>
              </div>
              <button className="relative z-10 mt-8 w-full py-3 bg-[#775a19] text-white font-semibold rounded-lg hover:brightness-110 transition-all">
                Generate Campaign
              </button>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#775a19]/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}