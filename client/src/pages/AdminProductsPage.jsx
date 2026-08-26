import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import ProductFormModal from '../components/admin/ProductFormModal';
import * as adminService from '../services/adminService';
import * as productService from '../services/productService';
import { useToast } from '../components/common/Toast';
import { formatCurrency } from '../utils/formatters';
import { Plus, Edit3, Trash2, Search, Box, Sparkles } from 'lucide-react';

const AdminProductsPage = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('[Admin Products Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProduct(id);
        showToast('Product removed', 'info');
        fetchAdminProducts();
      } catch (err) {
        showToast(err.response?.data?.message || 'Delete failed', 'error');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, formData);
        showToast('Product updated successfully!', 'success');
      } else {
        await adminService.createProduct(formData);
        showToast('Product created successfully!', 'success');
      }
      setModalOpen(false);
      fetchAdminProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Product Inventory Management</h1>
            <p className="text-xs text-slate-400">Add, edit, delete, and configure 3D model properties</p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search inventory products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Products Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase text-[10px] bg-slate-800/60 rounded-xl">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">3D Model</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-xl object-contain bg-slate-800 p-1" />
                    <div>
                      <span className="block truncate max-w-xs">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.brand}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">{p.categoryName || p.category?.name || 'General'}</td>
                  <td className="p-3 font-bold text-emerald-400">{formatCurrency(p.price)}</td>
                  <td className="p-3 font-semibold">
                    <span className={p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center gap-1 w-fit">
                      <Box className="w-3 h-3" /> {p.model3D?.type || 'headphones'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialProduct={editingProduct}
        categories={categories}
      />
    </div>
  );
};

export default AdminProductsPage;
