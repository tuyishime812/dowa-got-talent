import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Users, Search, Trash2, Check } from 'lucide-react'
import './Users.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await supabase.auth.admin.listUsers()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) {
        console.error('Delete user error:', error)
        throw error
      }
      fetchUsers()
      toast.success('User deleted successfully!')
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="users-page">
        <div className="page-header">
          <h2>Users</h2>
          <div className="header-actions">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Sign In</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar-placeholder">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        {user.app_metadata?.role === 'admin' ? (
                          <span className="badge badge-admin">
                            <Check size={14} /> Admin
                          </span>
                        ) : (
                          <span className="badge badge-user">User</span>
                        )}
                      </td>
                      <td>
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="users-stats">
          <div className="stat-box">
            <Users size={24} color="#ff6b35" />
            <div>
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{users.filter(u => u.app_metadata?.role === 'admin').length}</div>
            <span className="stat-label">Admins</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
