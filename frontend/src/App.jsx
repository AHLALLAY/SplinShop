import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/index';
import Login from './views/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './views/admin/Dashboard';
import HomeLayout from './layouts/HomeLayout';
import Seller from './views/admin/Seller';
import Catalog from './views/admin/Catalog';
import Product from './views/admin/Product';

// TODO(routes): /seller et /customer quand les espaces seront prêts (voir views/seller, views/customer)

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<Home />} />
                    <Route path="catalog/:catalogSlug/products" element={<Product />} />
                </Route>

                <Route path="/login" element={<Login />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="sellers" element={<Seller />} />
                    <Route path="catalog" element={<Catalog />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
