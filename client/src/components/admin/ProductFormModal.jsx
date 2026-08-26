import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Box } from 'lucide-react';

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialProduct, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: 0,
    category: '',
    brand: '',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    specifications: [{ key: '', value: '' }],
    model3D: { type: 'headphones', color: '#3b82f6', accentColor: '#f43f5e', gltfUrl: '' },
    isFeatured: false,
    isTrending: false,
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        description: initialProduct.description || '',
        price: initialProduct.price || '',
        discountPercentage: initialProduct.discountPercentage || 0,
        category: initialProduct.category?._id || initialProduct.category || '',
        brand: initialProduct.brand || '',
        stock: initialProduct.stock || 10,
        images: initialProduct.images?.length > 0 ? initialProduct.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        specifications: initialProduct.specifications?.length > 0 ? initialProduct.specifications : [{ key: '', value: '' }],
        model3D: initialProduct.model3D || { type: 'headphones', color: '#3b82f6', accentColor: '#f43f5e', gltfUrl: '' },
        isFeatured: Boolean(initialProduct.isFeatured),
        isTrending: Boolean(initialProduct.isTrending),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPercentage: 0,
        category: categories[0]?._id || '',
        brand: 'SmartCart',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        specifications: [{ key: 'Warranty', value: '1 Year Manufacturer' }],
        model3D: { type: 'headphones', color: '#3b82f6', accentColor: '#f43f5e', gltfUrl: '' },
        isFeatured: false,
        isTrending: false,
      });
    }
  }, [initialProduct, categories]);

  if (!isOpen) return null;

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData({ ...formData, specifications: updated });
  };

  const addSpecRow = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }],
    });
  };

  const removeSpecRow = (index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 max-w-2xl w-full my-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-emerald-400" />
            {initialProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Discount (%)</label>
              <input
                type="number"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Stock Units *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Main Image URL</label>
            <input
              type="text"
              value={formData.images[0] || ''}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          {/* 3D Model Config */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="w-4 h-4" /> 3D Viewer Configuration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Model Type</label>
                <select
                  value={formData.model3D.type}
                  onChange={(e) => setFormData({ ...formData, model3D: { ...formData.model3D, type: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="headphones">Headphones</option>
                  <option value="watch">Smartwatch</option>
                  <option value="phone">Smartphone</option>
                  <option value="shoe">Running Shoe</option>
                  <option value="chair">Ergonomic Chair</option>
                  <option value="controller">Gaming Controller</option>
                  <option value="gltf">Custom GLTF / GLB</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Primary Color</label>
                <input
                  type="color"
                  value={formData.model3D.color || '#3b82f6'}
                  onChange={(e) => setFormData({ ...formData, model3D: { ...formData.model3D, color: e.target.value } })}
                  className="w-full h-9 p-1 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Accent Color</label>
                <input
                  type="color"
                  value={formData.model3D.accentColor || '#f43f5e'}
                  onChange={(e) => setFormData({ ...formData, model3D: { ...formData.model3D, accentColor: e.target.value } })}
                  className="w-full h-9 p-1 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {formData.model3D.type === 'gltf' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">GLB / GLTF File URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/model.glb or /models/product.glb"
                  value={formData.model3D.gltfUrl || ''}
                  onChange={(e) => setFormData({ ...formData, model3D: { ...formData.model3D, gltfUrl: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Specifications</label>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Spec
              </button>
            </div>
            {formData.specifications.map((spec, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Feature Key (e.g. Battery)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 40 Hours)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  className="p-2 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-emerald-500"
              />
              Mark as Featured
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-emerald-500"
              />
              Mark as Trending
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md"
            >
              {initialProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
