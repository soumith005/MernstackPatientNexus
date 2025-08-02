import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import EditDoctor from "./components/EditDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";
import API_BASE_URL from "./utils/api";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    // Only run in browser environment, not during build
    if (typeof window !== 'undefined') {
      const fetchUser = async () => {
        try {
          const response = await axios.get("/api/v1/user/admin/me");
          console.log("User authenticated:", response.data);
          setIsAuthenticated(true);
          setAdmin(response.data.user);
        } catch (error) {
          console.error("Authentication error:", error.response?.data || error.message);
          setIsAuthenticated(false);
          setAdmin({});
        }
      };
      fetchUser();
    }
  }, []);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/doctor/edit/:id" element={<EditDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;