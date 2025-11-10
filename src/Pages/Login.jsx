
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
// import BarcaLogo from "../assets/barcalogo.jpg";
// import toast, { Toaster } from "react-hot-toast";

// const LoginPage = () => {
//   const { email, setEmail, password, setPassword, login, loading } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     const result = await login(email, password);
    
//     if (result.success) {
//       toast.success(" Login successful!");
//       setTimeout(() => {
//         navigate("/");
//       }, 1500);
//     } else {
//       toast.error(result.error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#fff',
//             color: '#1f2937',
//             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//             borderRadius: '12px',
//             border: '1px solid #e5e7eb',
//             padding: '12px 16px',
//             fontSize: '14px',
//             fontWeight: '500',
//           },
//         }}
//       />
      
//       <img
//         src={BarcaLogo}
//         alt="FC Barcelona Logo"
//         className="w-70 h-70 mx-auto mb-0 object-contain"
//       />

//       <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-900 font-oswald"
//           >
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none"
//             placeholder="Email"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700 font-oswald"
//           >
//             Password
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none"
//             placeholder="Password"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-[#ffc72c] text-black font-medium rounded-md hover:bg-[#f2a31b] transition-colors duration-200 font-oswald disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "SIGNING IN..." : "SIGN IN"}
//         </button>

//         <div className="text-center">
//           <Link
//             to="/Register"
//             className="mt-4 inline-block text-sm font-oswald underline text-[#004d98] hover:text-[#002b60]"
//           >
//             CREATE AN ACCOUNT
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;




import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import BarcaLogo from "../assets/barcalogo.jpg";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const { email, setEmail, password, setPassword, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      toast.success(" Login successful!");
      setTimeout(() => {
        // ✅ ADD THIS CHECK - Redirect admin to admin panel, user to home
        if (result.isAdmin) {
          navigate('/admin/Adashboard'); // Admin goes to admin panel
        } else {
          navigate('/'); // Regular user goes to home
        }
      }, 1500);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      
      <img
        src={BarcaLogo}
        alt="FC Barcelona Logo"
        className="w-70 h-70 mx-auto mb-0 object-contain"
      />

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 font-oswald"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none"
            placeholder="Email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 font-oswald"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#ffc72c] text-black font-medium rounded-md hover:bg-[#f2a31b] transition-colors duration-200 font-oswald disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <div className="text-center">
          <Link
            to="/Register"
            className="mt-4 inline-block text-sm font-oswald underline text-[#004d98] hover:text-[#002b60]"
          >
            CREATE AN ACCOUNT
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;