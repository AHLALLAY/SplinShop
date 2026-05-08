import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import seller from "../../services/seller";
import SellerCard from "../../components/seller/SellerCard";


export default function Seller() {
    const [sellers, setSellers] = useState([]);
    const handleSubmition = async (e) => {

    }
    const getSellers = async () => {
        setSellers(await seller.loadSeller());
    }
    useEffect(() => {
        getSellers();
    }, [])
    return (
        <div className="flex flex-col">
            <div>
                <form onSubmit={handleSubmition} className="flex justify-between">
                    <h1 className="text-amber-600 font-bold text-2xl">Vendeurs</h1>
                    <Button type="submit" className="px-2">
                        {"Ajouter"}
                    </Button>
                </form>
            </div>
            <div className="flex-1">
                <SellerCard sellers={sellers} />
            </div>
        </div>
    );
}