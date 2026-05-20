import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import seller from '../../services/seller';
import SellerCard from '../../components/seller/SellerCard';

export default function Seller() {
    const [sellers, setSellers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO(api): brancher création vendeur
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const list = await seller.loadSeller();
                if (!cancelled) setSellers(Array.isArray(list) ? list : []);
            } catch {
                if (!cancelled) setSellers([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="flex flex-col">
            <div>
                <form onSubmit={handleSubmit} className="flex justify-between">
                    <h1 className="text-amber-600 font-bold text-2xl">Vendeurs</h1>
                    <Button type="submit" className="px-2">
                        Ajouter
                    </Button>
                </form>
            </div>
            <div className="flex-1">
                <SellerCard sellers={sellers} />
            </div>
        </div>
    );
}
