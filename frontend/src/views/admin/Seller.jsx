import { useState } from 'react';
import Button from '../../components/ui/Button';
import sellerService from '../../services/seller';
import SellerCard from '../../components/seller/SellerCard';
import { useAsyncData } from '../../hooks/useAsyncData';
import { formatApiError } from '../../utils/formatApiError';

export default function Seller() {
    const { data: sellers, loading, reload } = useAsyncData(
        () => sellerService.loadSeller(),
        [],
    );
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback('Formulaire vendeur : branchez les champs du formulaire pour créer un vendeur.');
        setSubmitting(true);
        try {
            // Exemple d’appel API lorsque le formulaire sera complété :
            // await sellerService.addSeller({ name, email, password, phone });
            await reload();
        } catch (err) {
            setFeedback(formatApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col">
            {feedback && (
                <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
                    {feedback}
                </p>
            )}
            <div>
                <form onSubmit={handleSubmit} className="flex justify-between">
                    <h1 className="text-amber-600 font-bold text-2xl">Vendeurs</h1>
                    <Button type="submit" className="px-2" disabled={submitting}>
                        Ajouter
                    </Button>
                </form>
            </div>
            <div className="flex-1">
                {loading && <p className="mt-4 text-sm text-stone-500">Chargement…</p>}
                <SellerCard sellers={sellers ?? []} />
            </div>
        </div>
    );
}
