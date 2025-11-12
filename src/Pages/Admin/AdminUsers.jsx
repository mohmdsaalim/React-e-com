import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiUser, FiMail, FiCalendar, FiShoppingBag, FiCheckCircle, FiXCircle, FiPlus, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { usersAPI } from '../../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); //pagination
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // User status options
  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: FiUser },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-800', icon: FiXCircle },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FiCheckCircle }
  ];

  // User role options
  const roleOptions = [
    { value: 'customer', label: 'Customer', color: 'bg-blue-100 text-blue-800' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'vendor', label: 'Vendor', color: 'bg-orange-100 text-orange-800' },
    { value: 'moderator', label: 'Moderator', color: 'bg-green-100 text-green-800' }
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(usersAPI);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Process user data for display
  const processUserData = (user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const totalOrders = user.orders ? user.orders.length : 0;
    const totalSpent = user.orders ? totalOrders * 1000 : 0;
    const joinDate = user.createdAt || user.updatedAt || new Date().toISOString();
    const status = user.status || 'active';
    const role = user.role || 'customer';

    return {
      id: user.id,
      name: fullName || 'Unknown User',
      email: user.email,
      phone: user.shippingAddress?.phone || 'Not provided',
      role: role,
      status: status,
      joinDate: joinDate,
      totalOrders: totalOrders,
      totalSpent: totalSpent,
      cartItems: user.cart ? user.cart.length : 0,
      wishlistItems: user.wishlist ? user.wishlist.length : 0,
      orders: user.orders || [],
      shippingAddress: user.shippingAddress || {},
      rawData: user
    };
  };

  // Filter users based on search
  const filteredUsers = users
    .map(processUserData)
    .filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.id?.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // User actions
  const updateUserStatus = async (userId, newStatus) => {
    try {
      await axios.patch(`${usersAPI}/${userId}`, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus, updatedAt: new Date().toISOString() } : user
      ));
      
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user status');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.patch(`${usersAPI}/${userId}`, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole, updatedAt: new Date().toISOString() } : user
      ));
      
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await axios.delete(`${usersAPI}/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users to update');
      return;
    }

    try {
      const updatePromises = selectedUsers.map(userId =>
        axios.patch(`${usersAPI}/${userId}`, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      );

      await Promise.all(updatePromises);
      
      setUsers(prev => prev.map(user =>
        selectedUsers.includes(user.id) ? { ...user, status: newStatus, updatedAt: new Date().toISOString() } : user
      ));
      
      setSelectedUsers([]);
      toast.success(`Updated ${selectedUsers.length} users to ${newStatus}`);
    } catch (error) {
      console.error('Error bulk updating users:', error);
      toast.error('Failed to update users');
    }
  };

  const addNewUser = async (userData) => {
    try {
      const users= {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        email: userData.email,
        password: 'default123',
        cart: [],
        wishlist: [],
        orders: [],
        shippingAddress: userData.phone ? { phone: userData.phone } : {},
        role: userData.role,
        status: userData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await axios.post(usersAPI, users);
      setUsers(prev => [...prev, response.data]);
      setShowAddUser(false);
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['User ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Total Orders', 'Cart Items', 'Wishlist Items'],
      ...filteredUsers.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.role,
        user.status,
        new Date(user.joinDate).toLocaleDateString(),
        user.totalOrders,
        user.cartItems,
        user.wishlistItems
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Users exported successfully');
  };

  // Statistics based on actual data
  const processedUsers = users.map(processUserData);
  const stats = {
    total: processedUsers.length,
    active: processedUsers.filter(u => u.status === 'active').length,
    suspended: processedUsers.filter(u => u.status === 'suspended').length,
    pending: processedUsers.filter(u => u.status === 'pending').length,
    withOrders: processedUsers.filter(u => u.totalOrders > 0).length,
    withCart: processedUsers.filter(u => u.cartItems > 0).length,
    totalOrders: processedUsers.reduce((sum, user) => sum + user.totalOrders, 0),
    totalCartItems: processedUsers.reduce((sum, user) => sum + user.cartItems, 0),
    admins: processedUsers.filter(u => u.role === 'admin').length,
    customers: processedUsers.filter(u => u.role === 'customer').length
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage system users and their permissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-green-600 mt-1">{stats.withOrders} have orders</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((stats.active / stats.total) * 100)}% of total</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              <p className="text-xs text-gray-500 mt-1">Administrative users</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiUser className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500 mt-1">Across all users</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-orange-600" />
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
                placeholder="Search users by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Add User Button */}
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} users selected
              </span>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    onClick={() => bulkUpdateStatus(status.value)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Mark as {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(currentUsers.map(user => user.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => {
                const statusConfig = statusOptions.find(s => s.value === user.status) || statusOptions[0];
                const roleConfig = roleOptions.find(r => r.value === user.role) || roleOptions[0];
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && user.phone !== 'Not provided' && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${roleConfig.color} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        {roleOptions.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) => updateUserStatus(user.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.totalOrders} orders</div>
                      <div className="text-sm text-gray-500">{user.cartItems} in cart</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditUser(user)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit User"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete User"
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

          {currentUsers.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating a new user'
                }
              </p>
              <button
                onClick={() => setShowAddUser(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of{' '}
              {filteredUsers.length} results
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

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportUsers}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <AddUserModal 
          onClose={() => setShowAddUser(false)}
          onSave={addNewUser}
          statusOptions={statusOptions}
          roleOptions={roleOptions}
        />
      )}

      {/* User Details Modal */}
      {viewUser && (
        <UserDetailsModal 
          user={viewUser}
          onClose={() => setViewUser(null)}
          statusOptions={statusOptions}
          roleOptions={roleOptions}
        />
      )}

      {/* Edit User Modal */}
      {editUser && (
        <EditUserModal 
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(updatedUser) => {
            setUsers(prev => prev.map(u => {
              if (u.id === updatedUser.rawData.id) {
                return {
                  ...u,
                  firstName: updatedUser.name.split(' ')[0],
                  lastName: updatedUser.name.split(' ').slice(1).join(' '),
                  email: updatedUser.email,
                  role: updatedUser.role,
                  status: updatedUser.status,
                  shippingAddress: {
                    ...u.shippingAddress,
                    phone: updatedUser.phone !== 'Not provided' ? updatedUser.phone : undefined
                  },
                  updatedAt: new Date().toISOString()
                };
              }
              return u;
            }));
            setEditUser(null);
            toast.success('User updated successfully');
          }}
          statusOptions={statusOptions}
          roleOptions={roleOptions}
        />
      )}
    </div>
  );
};

// Modal Components
const AddUserModal = ({ onClose, onSave, statusOptions, roleOptions }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add New User</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
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
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, statusOptions, roleOptions }) => {
  const statusConfig = statusOptions.find(s => s.value === user.status) || statusOptions[0];
  const roleConfig = roleOptions.find(r => r.value === user.role) || roleOptions[0];
  const rawUser = user.rawData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Details - {user.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiXCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="text-xl font-semibold">{user.name}</h4>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleConfig.color}`}>
                  {roleConfig.label}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900">Personal Information</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-medium">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                {rawUser?.firstName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Name:</span>
                    <span className="font-medium">{rawUser.firstName}</span>
                  </div>
                )}
                {rawUser?.lastName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Name:</span>
                    <span className="font-medium">{rawUser.lastName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900">Activity & Statistics</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium">{user.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Items:</span>
                  <span className="font-medium">{user.cartItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wishlist Items:</span>
                  <span className="font-medium">{user.wishlistItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {rawUser?.updatedAt ? new Date(rawUser.updatedAt).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {rawUser?.shippingAddress && Object.keys(rawUser.shippingAddress).length > 0 && (
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900">Shipping Address</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1 text-sm">
                  {rawUser.shippingAddress.fullName && (
                    <div><strong>Name:</strong> {rawUser.shippingAddress.fullName}</div>
                  )}
                  {rawUser.shippingAddress.address && (
                    <div><strong>Address:</strong> {rawUser.shippingAddress.address}</div>
                  )}
                  {rawUser.shippingAddress.city && (
                    <div><strong>City:</strong> {rawUser.shippingAddress.city}</div>
                  )}
                  {rawUser.shippingAddress.state && (
                    <div><strong>State:</strong> {rawUser.shippingAddress.state}</div>
                  )}
                  {rawUser.shippingAddress.pincode && (
                    <div><strong>Pincode:</strong> {rawUser.shippingAddress.pincode}</div>
                  )}
                  {rawUser.shippingAddress.country && (
                    <div><strong>Country:</strong> {rawUser.shippingAddress.country}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, onClose, onSave, statusOptions, roleOptions }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    role: user.role
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Edit User - {user.name}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
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

export default UserManagement;