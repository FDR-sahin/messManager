// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { auth } from "../firebase/config";
// import { useAuth } from "../context/AuthContext";


// const adminLinks = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: "M3 11l9-7 9 7M5 10v9h14v-9M9 19v-5h6v5" },
//   { to: "/admin/members", label: "Members", icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21v-1a7 7 0 0 1 14 0v1M19 8v3m0 0v3m0-3h3m-3 0h-3" },
//   { to: "/admin/expenses", label: "Bazar Khoroch", icon: "M3 3h2l.4 2M7 13h10l3-7H6.4M7 13 5.4 5M7 13l-1.5 4.5h11" },
//   { to: "/admin/bills", label: "Bill Management", icon: "M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z" },
//   { to: "/admin/notices", label: "Notice Board", icon: "M4 5h16M4 12h10M4 19h16" },
// ];

// const memberLinks = [
//   { to: "/member/dashboard", label: "Dashboard", icon: "M3 11l9-7 9 7M5 10v9h14v-9M9 19v-5h6v5" },
//   { to: "/member/expenses", label: "Bazar Khoroch", icon: "M3 3h2l.4 2M7 13h10l3-7H6.4M7 13 5.4 5M7 13l-1.5 4.5h11" },
//   { to: "/member/bills", label: "Amar Bill", icon: "M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z" },
//   { to: "/member/notices", label: "Notice Board", icon: "M4 5h16M4 12h10M4 19h16" },
// ];

// function Sidebar() {
//   const navigate = useNavigate();
//   const { isAdmin, userProfile } = useAuth();
//   const links = isAdmin ? adminLinks : memberLinks;

//   const handleLogout = async () => {
//     await signOut(auth);
//     toast.success("Logout hoye gechhe");
//     navigate("/login");
//   };
//   const [open, setOpen] = useState(false);

//   return (
//     <aside className="md:w-64 w-30 bg-white border-r border-slate2-100 flex flex-col h-screen sticky top-0">
//       <div className="px-6 py-6 border-b border-slate2-100">
//         <h1 className="font-display font-bold text-lg text-slate2-900">
//           MessManager
//         </h1>
//         <p className="text-xs text-slate2-400 mt-1">
//           {isAdmin ? "Admin Panel" : "Member Panel"}
//         </p>
//       </div>

//       <nav className="flex-1 px-3 py-4 space-y-1">
//         {links.map((link) => (
//           <NavLink
//             key={link.to}
//             to={link.to}
//             className={({ isActive }) =>
//               `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                 isActive
//                   ? "bg-brand-50 text-brand-600"
//                   : "text-slate2-600 hover:bg-slate2-50"
//               }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 {isActive && (
//                   <motion.span
//                     layoutId="active-pill"
//                     className="absolute left-0 top-0 h-full w-1 bg-brand-500 rounded-r"
//                     transition={{ type: "spring", stiffness: 350, damping: 30 }}
//                   />
//                 )}
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5 flex-shrink-0">
//                   <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
//                 </svg>
//                 {link.label}
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="px-3 py-4 border-t border-slate2-100">
//         <div className="px-3 py-2 mb-2">
//           <p className="text-sm font-medium text-slate2-800 truncate">
//             {userProfile?.name || "User"}
//           </p>
//           <p className="text-xs text-slate2-400 truncate">{userProfile?.email}</p>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent-red hover:bg-accent-red/10 transition-colors"
//         >
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2m4-14 5 5-5 5m5-5H9" />
//           </svg>
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;



import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: "M3 11l9-7 9 7M5 10v9h14v-9M9 19v-5h6v5",
  },
  {
    to: "/admin/members",
    label: "Members",
    icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21v-1a7 7 0 0 1 14 0v1M19 8v3m0 0v3m0-3h3m-3 0h-3",
  },
  {
    to: "/admin/expenses",
    label: "Bazar Khoroch",
    icon: "M3 3h2l.4 2M7 13h10l3-7H6.4M7 13 5.4 5M7 13l-1.5 4.5h11",
  },
  {
    to: "/admin/bills",
    label: "Bill Management",
    icon: "M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z",
  },
  {
    to: "/admin/notices",
    label: "Notice Board",
    icon: "M4 5h16M4 12h10M4 19h16",
  },
];

const memberLinks = [
  {
    to: "/member/dashboard",
    label: "Dashboard",
    icon: "M3 11l9-7 9 7M5 10v9h14v-9M9 19v-5h6v5",
  },
  {
    to: "/member/expenses",
    label: "Bazar Khoroch",
    icon: "M3 3h2l.4 2M7 13h10l3-7H6.4M7 13 5.4 5M7 13l-1.5 4.5h11",
  },
  {
    to: "/member/bills",
    label: "Amar Bill",
    icon: "M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z",
  },
  {
    to: "/member/notices",
    label: "Notice Board",
    icon: "M4 5h16M4 12h10M4 19h16",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { isAdmin, userProfile } = useAuth();

  const [open, setOpen] = useState(false);

  const links = isAdmin ? adminLinks : memberLinks;

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logout hoye gechhe");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate2-100 flex flex-col transform transition-transform duration-300
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-3 md:hidden">
          <button onClick={() => setOpen(false)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate2-100">
          <h1 className="font-display font-bold text-lg text-slate2-900">
            MessManager
          </h1>

          <p className="text-xs text-slate2-400 mt-1">
            {isAdmin ? "Admin Panel" : "Member Panel"}
          </p>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-slate2-600 hover:bg-slate2-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute left-0 top-0 h-full w-1 bg-brand-500 rounded-r"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="w-5 h-5 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={link.icon}
                    />
                  </svg>

                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-slate2-100">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-slate2-800 truncate">
              {userProfile?.name || "User"}
            </p>

            <p className="text-xs text-slate2-400 truncate">
              {userProfile?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2m4-14 5 5-5 5m5-5H9"
              />
            </svg>

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;