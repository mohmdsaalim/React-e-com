// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [email, setEmail] = useState("");      
//   const [password, setPassword] = useState(""); 
//   const [loading, setLoading] = useState(false);

//   // Load user from localStorage on reload
//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error("Error parsing saved user:", error);
//         localStorage.removeItem("currentUser");
//       }
//     }
//   }, []);

//   // Check if email already exists
//   const checkEmailExists = async (email) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/users?email=${email}`);
//       return response.data.length > 0;
//     } catch (error) {
//       console.error('Error checking email:', error);
//       return false;
//     }
//   };

//   // Register new user with email duplication check
//   const register = async (userData) => {
//     setLoading(true);
//     try {
//       // Check if email already exists
//       const emailExists = await checkEmailExists(userData.email);
      
//       if (emailExists) {
//         setLoading(false);
//         return { success: false, error: 'Email already exists. Please use a different email.' };
//       }

//       // Generate unique ID for new user
//       const newUser = {
//         ...userData,
//         role:"user",
//         id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
//         cart: [],
//         wishlist: [],
//         orders: [],
//         shippingAddress: {},
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Create new user
//       const response = await axios.post('http://localhost:3000/users', newUser);
      
//       setLoading(false);
//       return { success: true, user: response.data };
      
//     } catch (error) {
//       console.error('Registration error:', error);
//       setLoading(false);
//       return { success: false, error: 'Registration failed. Please try again.' };
//     }
//   };

//   // Proper login function that validates against database
//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:3000/users?email=${email}`);
//       const users = response.data;
      
//       if (users.length > 0) {
//         const user = users[0];
//         if (user.password === password) {
//           setUser(user);
//           localStorage.setItem('currentUser', JSON.stringify(user));
//           setLoading(false);
//           return { success: true, user };
//         }
//       }
//       setLoading(false);
//       return { success: false, error: 'Invalid credentials' };
//     } catch (error) {
//       console.error('Login error:', error);
//       setLoading(false);
//       return { success: false, error: 'Login failed' };
//     }
//   };

//   // Simple login for direct user data
//   const loginWithUserData = (userData) => {
//     setUser(userData);
//     localStorage.setItem("currentUser", JSON.stringify(userData));
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     setEmail("");
//     setPassword("");
//     localStorage.removeItem("currentUser");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         email,
//         setEmail,
//         password,
//         setPassword,
//         login,
//         register,
//         loginWithUserData,
//         logout,
//         loading
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [email, setEmail] = useState("");      
//   const [password, setPassword] = useState(""); 
//   const [loading, setLoading] = useState(false);

//   // Load user from localStorage on reload
//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error("Error parsing saved user:", error);
//         localStorage.removeItem("currentUser");
//       }
//     }
//   }, []);

//   // Check if email already exists
//   const checkEmailExists = async (email) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/users?email=${email}`);
//       return response.data.length > 0;
//     } catch (error) {
//       console.error('Error checking email:', error);
//       return false;
//     }
//   };

//   // Register new user with email duplication check
//   const register = async (userData) => {
//     setLoading(true);
//     try {
//       // Check if email already exists
//       const emailExists = await checkEmailExists(userData.email);
      
//       if (emailExists) {
//         setLoading(false);
//         return { success: false, error: 'Email already exists. Please use a different email.' };
//       }

//       // Generate unique ID for new user
//       const newUser = {
//         ...userData,
//         role:"user",
//         id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
//         cart: [],
//         wishlist: [],
//         orders: [],
//         shippingAddress: {},
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Create new user
//       const response = await axios.post('http://localhost:3000/users', newUser);
      
//       setLoading(false);
//       return { success: true, user: response.data };
      
//     } catch (error) {
//       console.error('Registration error:', error);
//       setLoading(false);
//       return { success: false, error: 'Registration failed. Please try again.' };
//     }
//   };

//   // Proper login function that validates against database
//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:3000/users?email=${email}`);
//       const users = response.data;
      
//       if (users.length > 0) {
//         const user = users[0];
//         if (user.password === password) {
//           setUser(user);
//           localStorage.setItem('currentUser', JSON.stringify(user));
//           setLoading(false);
          
//           // ✅ ADD THIS ONE LINE - Check if user is admin
//           const isAdmin = user.role === 'admin';
//           return { 
//             success: true, 
//             user,
//             isAdmin // This will tell you if user is admin
//           };
//         }
//       }
//       setLoading(false);
//       return { success: false, error: 'Invalid credentials' };
//     } catch (error) {
//       console.error('Login error:', error);
//       setLoading(false);
//       return { success: false, error: 'Login failed' };
//     }
//   };

//   // Simple login for direct user data
//   const loginWithUserData = (userData) => {
//     setUser(userData);
//     localStorage.setItem("currentUser", JSON.stringify(userData));
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     setEmail("");
//     setPassword("");
//     localStorage.removeItem("currentUser");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         email,
//         setEmail,
//         password,
//         setPassword,
//         login,
//         register,
//         loginWithUserData,
//         logout,
//         loading
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { usersAPI } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");      
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on reload
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Check if user is suspended when loading from localStorage
        if (parsedUser.status === "suspended") {
          logout();
          return;
        }
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Check if email already exists
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`${usersAPI}?email=${email}`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Register new user with email duplication check
  const register = async (userData) => {
    setLoading(true);
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(userData.email);
      
      if (emailExists) {
        setLoading(false);
        return { success: false, error: 'Email already exists. Please use a different email.' };
      }

      // Generate unique ID for new user
      const newUser = {
        ...userData,
        role: "user",
        status: "active", // Default status for new users
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        cart: [],
        wishlist: [],
        orders: [],
        shippingAddress: {},
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create new user
      const response = await axios.post(usersAPI, newUser);
      
      setLoading(false);
      return { success: true, user: response.data };
      
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // Proper login function that validates against database
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.get(`${usersAPI}?email=${email}`);
      const users = response.data;
      
      if (users.length > 0) {
        const user = users[0];
        
        // Check if user is suspended
        if (user.status === "suspended") {
          setLoading(false);
          return { 
            success: false, 
            error: 'Your account has been suspended. Please contact support.' 
          };
        }
        
        if (user.password === password) {
          setUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          setLoading(false);
          
          // Check if user is admin
          const isAdmin = user.role === 'admin';
          return { 
            success: true, 
            user,
            isAdmin
          };
        }
      }
      setLoading(false);
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  // Simple login for direct user data
  const loginWithUserData = (userData) => {
    // Check if user is suspended
    if (userData.status === "suspended") {
      logout();
      return { success: false, error: 'Your account has been suspended.' };
    }
    
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    return { success: true };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        email,
        setEmail,
        password,
        setPassword,
        login,
        register,
        loginWithUserData,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);