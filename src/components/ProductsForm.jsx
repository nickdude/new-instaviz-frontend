'use client';

import { useState } from 'react';
import { FormInput } from '@/components/FormInput';
import { FormButton } from '@/components/FormButton';
import { Plus, X, Image, FileText } from 'lucide-react';

export function ProductsForm({ onSubmit, onBack, initialData = {} }) {
  const [products, setProducts] = useState(initialData.products || []);
  const [errors, setErrors] = useState({});

  const addProduct = () => {
    if (products.length < 3) {
      setProducts([
        ...products,
        { name: '', image: null, description: '', pdf: null },
      ]);
    }
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
    setErrors((prev) => ({ ...prev, [`product${index}_${field}`]: '' }));
  };

  const handleFileChange = (index, field, file) => {
    if (field === 'image' && file && file.type.startsWith('image/')) {
      updateProduct(index, field, file);
    } else if (field === 'pdf' && file && file.type === 'application/pdf') {
      updateProduct(index, field, file);
    } else {
      setErrors((prev) => ({
        ...prev,
        [`product${index}_${field}`]: `Invalid file type`,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    products.forEach((product, index) => {
      if (!product.name.trim())
        newErrors[`product${index}_name`] = 'Product name is required';
      if (!product.description.trim())
        newErrors[`product${index}_description`] = 'Description is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (products.length === 0) {
      setErrors({ general: 'Add at least one product' });
      return;
    }
    if (validate()) {
      onSubmit({ products });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Add up to 3 products</p>
        </div>
        {products.length < 3 && (
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Product {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>

            <FormInput
              label="Product Name"
              name={`product-name-${index}`}
              value={product.name}
              onChange={(e) => updateProduct(index, 'name', e.target.value)}
              error={errors[`product${index}_name`]}
              placeholder="Enter product name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Product Image (Optional)
              </label>
              <label className="cursor-pointer">
                <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                  <Image size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {product.image ? product.image.name : 'Click to upload image'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, 'image', e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={product.description}
                onChange={(e) => updateProduct(index, 'description', e.target.value)}
                placeholder="Short product description..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[`product${index}_description`] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[`product${index}_description`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Product PDF (Optional)
              </label>
              <label className="cursor-pointer">
                <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                  <FileText size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {product.pdf ? product.pdf.name : 'Click to upload PDF'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(index, 'pdf', e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <FormButton type="button" onClick={onBack} variant="secondary" className="flex-1">
          Back
        </FormButton>
        <FormButton type="submit" className="flex-1">
          Continue
        </FormButton>
      </div>
    </form>
  );
}
