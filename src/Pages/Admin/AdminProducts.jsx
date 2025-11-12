import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiSearch, 
  FiFilter,
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiShoppingCart,
  FiDollarSign,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiGrid,
  FiList,
  FiTag,
  FiArchive,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle
} from 'react-icons/fi';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('grid');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  // Extract categories and genders from actual data
  const categories = [
    { value: 'Home Kit', label: 'Home Kit' },
    { value: 'Away Kit', label: 'Away Kit' },
    { value: 'Goalkeeper Kit', label: 'Goalkeeper Kit' },
    { value: 'Training Kit', label: 'Training Kit' },
    { value: 'Apparel', label: 'Apparel' },
    { value: 'Classic', label: 'Classic' },
    { value: 'Modern', label: 'Modern' }
  ];

  const genders = [
    { value: 'Boys', label: 'Boys' },
    { value: 'Girls', label: 'Girls' },
    { value: 'Kids', label: 'Kids' },
    { value: 'Men', label: 'Men' }
  ];

  // Status options based on your data
  const statusOptions = [
    { value: 'in_stock', label: 'In Stock', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
    { value: 'low_stock', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: FiAlertCircle },
    { value: 'out_of_stock', label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: FiXCircle }
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/products');
      
      // Flatten products from all categories (kids_kits, apparel, new_era)
      const allProducts = [
        ...(response.data.kids_kits || []).map(p => ({ ...p, collection: 'kids_kits' })),
        ...(response.data.apparel || []).map(p => ({ ...p, collection: 'apparel' })),
        ...(response.data.new_era || []).map(p => ({ ...p, collection: 'new_era' }))
      ];
      
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.materials?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.gender?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (statusFilter === 'in_stock') return product.stock_quantity > 10;
        if (statusFilter === 'low_stock') return product.stock_quantity <= 10 && product.stock_quantity > 0;
        if (statusFilter === 'out_of_stock') return product.stock_quantity === 0;
        return true;
      });
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price_inr;
        if (priceFilter === 'under_5000') return price < 5000;
        if (priceFilter === '5000_10000') return price >= 5000 && price <= 10000;
        if (priceFilter === 'over_10000') return price > 10000;
        return true;
      });
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(product => product.gender === genderFilter);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter, priceFilter, genderFilter, products]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Product actions
  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      await axios.delete(`http://localhost:3000/products/${productId}`);
      setProducts(prev => prev.filter(product => product.id !== productId));
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const bulkDeleteProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      const deletePromises = selectedProducts.map(productId =>
        axios.delete(`http://localhost:3000/products/${productId}`)
      );

      await Promise.all(deletePromises);
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      toast.success(`Deleted ${selectedProducts.length} products successfully`);
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const updateProductStatus = async (productId, newStatus) => {
    try {
      // Find the product to get its collection
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Product not found');
        return;
      }

      // Calculate new stock quantity based on status
      let newStockQuantity;
      switch (newStatus) {
        case 'in_stock':
          newStockQuantity = 50; // Default high stock
          break;
        case 'low_stock':
          newStockQuantity = 5; // Default low stock
          break;
        case 'out_of_stock':
          newStockQuantity = 0;
          break;
        default:
          newStockQuantity = product.stock_quantity;
      }

      // Update the product in the correct collection
      const response = await axios.patch(`http://localhost:3000/${product.collection}/${productId}`, {
        stock_quantity: newStockQuantity,
        status: newStockQuantity > 0
      });
      
      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId ? { 
          ...product, 
          stock_quantity: newStockQuantity,
          status: newStockQuantity > 0
        } : product
      ));
      
      toast.success('Product status updated successfully');
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const addNewProduct = async (productData) => {
    try {
      // Generate a unique ID (find the highest existing ID and add 1)
      const maxId = Math.max(...products.map(p => parseInt(p.id)), 0);
      const newId = maxId + 1;

      const newProduct = {
        ...productData,
        id: newId.toString(), // Ensure ID is string to match your data
        status: parseInt(productData.stock_quantity) > 0,
        stock_quantity: parseInt(productData.stock_quantity),
        price_inr: parseInt(productData.price_inr),
        // Add missing fields with default values
        rating: 0,
        reviewCount: 0,
        // Ensure all required fields are present
        materials: productData.materials || '100% Polyester',
        care_instructions: productData.care_instructions || 'Machine wash cold',
        label: productData.label || 'New'
      };

      // Determine which collection to add to based on category
      let collection = 'kids_kits';
      if (productData.category === 'Apparel') collection = 'apparel';
      if (productData.category === 'Classic' || productData.category === 'Modern') collection = 'new_era';

      console.log('Adding to collection:', collection, 'with data:', newProduct);

      const response = await axios.post(`http://localhost:3000/${collection}`, newProduct);
      
      // Add the collection info to the product for local state management
      const productWithCollection = { ...response.data, collection };
      
      setProducts(prev => [...prev, productWithCollection]);
      setShowAddProduct(false);
      toast.success('Product created successfully');
      
      // Refresh the products list to ensure consistency
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        toast.error(`Failed to create product: ${error.response.data.message || 'Server error'}`);
      } else {
        toast.error('Failed to create product: Network error');
      }
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Product not found');
        return false;
      }

      const response = await axios.patch(`http://localhost:3000/${product.collection}/${productId}`, {
        ...updatedData,
        stock_quantity: parseInt(updatedData.stock_quantity),
        price_inr: parseInt(updatedData.price_inr),
        status: parseInt(updatedData.stock_quantity) > 0
      });

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...response.data, collection: product.collection } : p
      ));

      toast.success('Product updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return false;
    }
  };

  // Statistics
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock_quantity > 10).length,
    lowStock: products.filter(p => p.stock_quantity <= 10 && p.stock_quantity > 0).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    totalValue: products.reduce((sum, product) => sum + (product.price_inr * product.stock_quantity), 0),
    averagePrice: products.length > 0 ? Math.round(products.reduce((sum, product) => sum + product.price_inr, 0) / products.length) : 0
  };

  const getStockStatus = (quantity) => {
    if (quantity > 10) return { status: 'in_stock', label: 'In Stock', color: 'bg-green-100 text-green-800' };
    if (quantity > 0) return { status: 'low_stock', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'out_of_stock', label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  const getCollectionBadge = (collection) => {
    const collections = {
      kids_kits: { label: 'Kids Kits', color: 'bg-blue-100 text-blue-800' },
      apparel: { label: 'Apparel', color: 'bg-green-100 text-green-800' },
      new_era: { label: 'New Era', color: 'bg-purple-100 text-purple-800' }
    };
    return collections[collection] || { label: collection, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
        <p className="text-gray-600">Manage your FC Barcelona product catalog</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiTrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, category, or material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under_5000">Under ₹5000</option>
                <option value="5000_10000">₹5000 - ₹10000</option>
                <option value="over_10000">Over ₹10000</option>
              </select>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Genders</option>
                {genders.map(gender => (
                  <option key={gender.value} value={gender.value}>{gender.label}</option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} products selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={bulkDeleteProducts}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 className="w-3 h-3" />
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(currentProducts.map(product => product.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                const collectionBadge = getCollectionBadge(product.collection);
                const StatusIcon = statusOptions.find(s => s.value === stockStatus.status)?.icon || FiPackage;
                
                return (
                  <tr key={`${product.collection}-${product.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(prev => [...prev, product.id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{product.materials}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${collectionBadge.color}`}>
                        {collectionBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">₹{product.price_inr}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{product.stock_quantity}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900 capitalize">{product.gender}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={stockStatus.status}
                        onChange={(e) => updateProductStatus(product.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus.color} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit Product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete Product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {currentProducts.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || priceFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of{' '}
              {filteredProducts.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSave={addNewProduct}
          categories={categories}
          genders={genders}
        />
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <ViewProductModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          getStockStatus={getStockStatus}
          getCollectionBadge={getCollectionBadge}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={updateProduct}
          categories={categories}
          genders={genders}
        />
      )}
    </div>
  );
};

// Modal Components
const AddProductModal = ({ onClose, onSave, categories, genders }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Home Kit',
    price_inr: '',
    stock_quantity: '',
    materials: '',
    care_instructions: '',
    gender: 'Boys',
    image_url: '',
    label: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price_inr: parseInt(formData.price_inr),
      stock_quantity: parseInt(formData.stock_quantity)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add New Product</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price_inr}
                onChange={(e) => setFormData(prev => ({ ...prev, price_inr: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {genders.map(gender => (
                  <option key={gender.value} value={gender.value}>{gender.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materials</label>
            <input
              type="text"
              value={formData.materials}
              onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
            <textarea
              value={formData.care_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewProductModal = ({ product, onClose, getStockStatus, getCollectionBadge }) => {
  const stockStatus = getStockStatus(product.stock_quantity);
  const collectionBadge = getCollectionBadge(product.collection);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiTrash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{product.name}</h4>
                <p className="text-2xl font-bold text-blue-600">₹{product.price_inr}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Quantity</p>
                  <p className="text-lg font-bold text-gray-900">{product.stock_quantity}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{product.gender}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${collectionBadge.color}`}>
                  {collectionBadge.label}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {product.category}
                </span>
              </div>

              {product.materials && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Materials</h5>
                  <p className="text-gray-700">{product.materials}</p>
                </div>
              )}

              {product.care_instructions && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Care Instructions</h5>
                  <p className="text-gray-700">{product.care_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProductModal = ({ product, onClose, onSave, categories, genders }) => {
  const [formData, setFormData] = useState({
    ...product,
    stock_quantity: product.stock_quantity.toString(),
    price_inr: product.price_inr.toString()
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product.id, {
      ...formData,
      price_inr: parseInt(formData.price_inr),
      stock_quantity: parseInt(formData.stock_quantity)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Edit Product</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price_inr}
                onChange={(e) => setFormData(prev => ({ ...prev, price_inr: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {genders.map(gender => (
                  <option key={gender.value} value={gender.value}>{gender.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={formData.label || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materials</label>
            <input
              type="text"
              value={formData.materials || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
            <textarea
              value={formData.care_instructions || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;



