import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ChevronUp, ChevronDown, Plus, Edit, Trash2, X, Eye, Mail, Phone, MapPin } from 'lucide-react';

interface TableData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  orders: number;
  location: string;
  joinDate: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  orders: number;
  location: string;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof TableData>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState<TableData | null>(null);
  const [viewingUser, setViewingUser] = useState<TableData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'User',
    status: 'Active',
    orders: 0,
    location: ''
  });
  const itemsPerPage = 10;

  const defaultData: TableData[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+1 (555) 123-4567',
      role: 'Admin', 
      status: 'Active', 
      lastLogin: '2024-01-15', 
      orders: 23,
      location: 'New York, USA',
      joinDate: '2023-06-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '+1 (555) 234-5678',
      role: 'User', 
      status: 'Active', 
      lastLogin: '2024-01-14', 
      orders: 45,
      location: 'Los Angeles, USA',
      joinDate: '2023-08-22'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      phone: '+1 (555) 345-6789',
      role: 'Manager', 
      status: 'Inactive', 
      lastLogin: '2024-01-10', 
      orders: 12,
      location: 'Chicago, USA',
      joinDate: '2023-04-10'
    },
    { 
      id: 4, 
      name: 'Alice Brown', 
      email: 'alice@example.com', 
      phone: '+1 (555) 456-7890',
      role: 'User', 
      status: 'Pending', 
      lastLogin: '2024-01-16', 
      orders: 67,
      location: 'Miami, USA',
      joinDate: '2024-01-01'
    },
    { 
      id: 5, 
      name: 'Charlie Wilson', 
      email: 'charlie@example.com', 
      phone: '+1 (555) 567-8901',
      role: 'Admin', 
      status: 'Active', 
      lastLogin: '2024-01-15', 
      orders: 89,
      location: 'Seattle, USA',
      joinDate: '2023-02-28'
    },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('users-data');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      setData(defaultData);
      localStorage.setItem('users-data', JSON.stringify(defaultData));
    }
  }, []);

  const saveToLocalStorage = (newData: TableData[]) => {
    localStorage.setItem('users-data', JSON.stringify(newData));
    setData(newData);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesRole = filterRole === 'all' || item.role === filterRole;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection, filterStatus, filterRole]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: keyof TableData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedData.map(user => user.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      const newData = data.filter(user => !selectedUsers.includes(user.id));
      saveToLocalStorage(newData);
      setSelectedUsers([]);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'User',
      status: 'Active',
      orders: 0,
      location: ''
    });
    setShowModal(true);
  };

  const handleEdit = (user: TableData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      orders: user.orders,
      location: user.location
    });
    setShowModal(true);
  };

  const handleView = (user: TableData) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const newData = data.filter(user => user.id !== id);
      saveToLocalStorage(newData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      const newData = data.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, lastLogin: new Date().toISOString().split('T')[0] }
          : user
      );
      saveToLocalStorage(newData);
    } else {
      const newUser: TableData = {
        id: Math.max(...data.map(u => u.id), 0) + 1,
        ...formData,
        lastLogin: new Date().toISOString().split('T')[0],
        joinDate: new Date().toISOString().split('T')[0]
      };
      saveToLocalStorage([...data, newUser]);
    }
    
    setShowModal(false);
  };

  const exportData = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Last Login', 'Orders', 'Location', 'Join Date'],
      ...filteredAndSortedData.map(user => [
        user.name, user.email, user.phone, user.role, user.status, 
        user.lastLogin, user.orders.toString(), user.location, user.joinDate
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-900/20 text-green-400';
      case 'Inactive': return 'bg-red-900/20 text-red-400';
      case 'Pending': return 'bg-yellow-900/20 text-yellow-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-900/20 text-purple-400';
      case 'Manager': return 'bg-blue-900/20 text-blue-400';
      case 'User': return 'bg-gray-900/20 text-gray-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="rounded-xl bg-gray-800 border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  User Management
                </h3>
                <p className="text-gray-400">
                  Manage your users and their permissions ({filteredAndSortedData.length} users)
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
                <button 
                  onClick={exportData}
                  className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>

              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete ({selectedUsers.length})
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                  />
                </th>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                  { key: 'lastLogin', label: 'Last Login' },
                  { key: 'orders', label: 'Orders' },
                  { key: 'location', label: 'Location' },
                  { key: 'actions', label: 'Actions' },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
                      column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-800 transition-colors' : ''
                    }`}
                    onClick={column.key !== 'actions' ? () => handleSort(column.key as keyof TableData) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.key !== 'actions' && sortField === column.key && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-white">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(user)}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete User"
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
        
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-700 transition-colors text-white"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2);
              return page <= totalPages ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    page === currentPage
                      ? 'bg-primary-500 text-white'
                      : 'border border-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {page}
                </button>
              ) : null;
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-700 transition-colors text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending' })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Orders
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.orders}
                  onChange={(e) => setFormData({ ...formData, orders: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingUser ? 'Update' : 'Add'} User
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                User Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {viewingUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{viewingUser.name}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(viewingUser.role)}`}>
                    {viewingUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-white">{viewingUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-white">{viewingUser.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-white">{viewingUser.location || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingUser.status)}`}>
                    {viewingUser.status}
                  </span>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Orders</p>
                  <p className="text-white font-semibold">{viewingUser.orders}</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Last Login</p>
                  <p className="text-white">{viewingUser.lastLogin}</p>
                </div>

                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Join Date</p>
                  <p className="text-white">{viewingUser.joinDate}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingUser);
                  }}
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Edit User
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;