// import React from "react";
// import { useAuth } from "../Context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function ProfilePage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   if (!user) {
//     navigate("/login");
//     return null;
//   }

//   return(
//     <div className="min-h-screen bg-[#171630] text-white flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
//       <p className="text-lg mb-4">Email: {user.email}</p>
//       <button
//         onClick={() => {
//           logout();
//           navigate("/login");
//         }}
//         className="bg-[#ffc72c] text-black font-bold py-2 px-6 rounded hover:bg-[#f2a31b]"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }