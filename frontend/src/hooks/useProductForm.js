import { useState } from 'react';
import productService from '../services/product';
import { slugify } from '../utils/slug';
import { formatApiError } from '../utils/formatApiError';

/**
 * Gère le formulaire de produit.
 * @param {{ catalogId: string, item?: object, onClose: Function }} props
 */
export function useProductForm({ catalogId, item, onClose }) {
  const isEditing = Boolean(item?.id);
  const [name, setName] = useState(item?.name ?? '');
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : '');
  const [quantity, setQuantity] = useState(item?.quantity != null ? String(item.quantity) : '1');
  const [description, setDescription] = useState(item?.description ?? '');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName('');
    setPrice('');
    setQuantity('1');
    setDescription('');
    setImages([]);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (isEditing) {
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
      await productService.add({
        catalogId,
        name: name.trim(),
        price: priceNum,
        quantity: qtyNum,
        slug: slugify(name),
        description: description.trim() || undefined,
        images,
      });
      reset();
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(formatApiError(err));
    }
  };

  return {
    isEditing,
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
    submit,
  };
}
