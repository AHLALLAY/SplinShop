import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/index';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './views/admin/Dashboard';
import ShopEntryLayout from './layouts/ShopEntryLayout';
import Seller from './views/admin/Seller';
import Catalog from './views/admin/Catalog';
import Product from './views/admin/Product';
import CustomerDashboard from './views/customer/Dashboard';
import CustomerProfile from './views/customer/Profile';

// TODO(routes): /seller quand l'espace vendeur sera prêt

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ShopEntryLayout />}>
                    <Route index element={<Home />} />
                    <Route path="catalog/:catalogSlug/products" element={<Product />} />
                    <Route path="customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="customer/profile" element={<CustomerProfile />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="sellers" element={<Seller />} />
                    <Route path="catalog" element={<Catalog />} />
                    <Route path="catalog/:catalogSlug/products" element={<Product adminContext />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
