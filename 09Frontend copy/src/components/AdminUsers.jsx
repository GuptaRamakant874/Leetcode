import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Trash2, Users, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import MainNavbar from './MainNavbar';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axiosClient.get('/user/admin/users');
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(`Delete ${user.firstName || 'this user'} permanently?`);
    if (!confirmed) return;

    try {
      setDeleteLoadingId(user._id);
      await axiosClient.delete(`/user/admin/users/${user._id}`);
      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser._id !== user._id));
    } catch (err) {
      window.alert(err?.response?.data?.message || 'Unable to delete this user');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((user) => user.role === 'admin').length;
  const totalRegularUsers = users.filter((user) => user.role !== 'admin').length;
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const normalizedName = (user.firstName || '').toLowerCase();
    const matchesSearch = normalizedName.includes(searchTerm.trim().toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      <MainNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-info/10">
                <Users className="w-6 h-6 text-info" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-base-content">User Management</h1>
                <p className="text-base-content/70">View users on the platform and remove user profiles.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-outline" onClick={fetchUsers}>
              Refresh
            </button>
            <Link to="/admin" className="btn btn-ghost">
              Back to Admin
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Total Profiles</p>
              <p className="text-3xl font-bold">{loading ? '...' : totalUsers}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Regular Users</p>
              <p className="text-3xl font-bold">{loading ? '...' : totalRegularUsers}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Admins</p>
              <p className="text-3xl font-bold">{loading ? '...' : totalAdmins}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="w-full md:max-w-xs">
                <label className="label">
                  <span className="label-text font-medium">Filter by role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="w-full">
                <label className="label">
                  <span className="label-text font-medium">Search by name</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 opacity-70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.5 3a5.5 5.5 0 013.937 9.34l3.611 3.612a1 1 0 01-1.414 1.414l-3.612-3.611A5.5 5.5 0 118.5 3zm-3.5 5.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="Search user or admin by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-base-300 p-8 text-center text-base-content/70">
                No users matched the selected role or search name.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';

                  return (
                    <div
                      key={user._id}
                      className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-start justify-between gap-4 flex-wrap"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className={`p-3 rounded-xl ${isAdmin ? 'bg-warning/10' : 'bg-info/10'}`}>
                            {isAdmin ? (
                              <Shield className={`w-5 h-5 ${isAdmin ? 'text-warning' : 'text-info'}`} />
                            ) : (
                              <UserIcon className="w-5 h-5 text-info" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-base-content">
                              {user.firstName || 'Unnamed User'}
                            </h2>
                            <div className={`badge ${isAdmin ? 'badge-warning' : 'badge-info'} capitalize`}>
                              {user.role || 'user'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-base-content/70 break-all">
                          <Mail className="w-4 h-4" />
                          <span>{user.emailID || user.emailId || 'No email available'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isAdmin ? (
                          <div className="badge badge-outline">Protected</div>
                        ) : (
                          <button
                            className="btn btn-error"
                            onClick={() => handleDeleteUser(user)}
                            disabled={deleteLoadingId === user._id}
                          >
                            {deleteLoadingId === user._id ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete Profile
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const formatDate = (value) => {
  if (!value) return 'Unknown';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  return date.toLocaleDateString();
};

export default AdminUsers;
