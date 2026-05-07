import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./views/index";
import Login from "./views/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./views/admin/Dashboard";
import HomeLayout from "./layouts/HomeLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
        
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
