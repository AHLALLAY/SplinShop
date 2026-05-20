import { useState } from 'react';
import product from '../services/product';
import { slugify } from '../utils/slug';
import { formatApiError } from '../utils/formatApiError';

export function useProductForm({ catalogId, item, onClose }) {
  const isEdit = Boolean(item?.id);
  const [name, setName] = useState(item?.name ?? '');
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : '');
  const [quantity, setQuantity] = useState(item?.quantity != null ? String(item.quantity) : '1');
  const [description, setDescription] = useState(item?.description ?? '');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('1');
    setDescription('');
    setImages([]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      setError("La modification sera disponible lorsque l'API sera en place.");
      return;
    }
    if (!catalogId) {
      setError('Catégorie introuvable.');
      return;
    }

    const priceNum = Number(price);
    const qtyNum = Number(quantity);
    if (!name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }
    if (!Number.isInteger(qtyNum) || qtyNum < 1) {
      setError('La quantité doit être au moins 1.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await product.addProduct({
        catalogId,
        name: name.trim(),
        price: priceNum,
        quantity: qtyNum,
        slug: slugify(name),
        description: description.trim() || undefined,
        images,
      });
      resetForm();
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(formatApiError(err));
    }
  };

  return {
    isEdit,
    name,
    setName,
    price,
    setPrice,
    quantity,
    setQuantity,
    description,
    setDescription,
    images,
    setImages,
    error,
    setError,
    loading,
    handleSubmit,
  };
}
