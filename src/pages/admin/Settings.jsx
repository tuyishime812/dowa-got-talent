import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Settings, Save, Bell, Palette, Database, Globe, Shield } from 'lucide-react'
import './Settings.css'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Pamodzi',
    siteDescription: "Authentic Entertainment",
    enableDownloads: true,
    enableRegistration: true,
    defaultVolume: 0.7,
    itemsPerPage: 12,
    enableNotifications: true,
    maintenanceMode: false
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Simulate saving
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="settings-page">
        <div className="page-header">
          <h2>Settings</h2>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={20} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="settings-grid">
          {/* General Settings */}
          <div className="settings-card">
            <div className="settings-header">
              <Globe size={24} color="#ff6b35" />
              <h3>General Settings</h3>
            </div>
            <div className="settings-body">
              <div className="form-group">
                <label>Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Site Description</label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Items Per Page</label>
                <input
                  type="number"
                  value={settings.itemsPerPage}
                  onChange={(e) => setSettings({ ...settings, itemsPerPage: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Feature Settings */}
          <div className="settings-card">
            <div className="settings-header">
              <Settings size={24} color="#4a3b6e" />
              <h3>Feature Settings</h3>
            </div>
            <div className="settings-body">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.enableDownloads}
                  onChange={(e) => setSettings({ ...settings, enableDownloads: e.target.checked })}
                />
                <div>
                  <strong>Enable Downloads</strong>
                  <p>Allow users to download music</p>
                </div>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                />
                <div>
                  <strong>Enable Registration</strong>
                  <p>Allow new user registrations</p>
                </div>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                />
                <div>
                  <strong>Maintenance Mode</strong>
                  <p>Put site in maintenance mode</p>
                </div>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-card">
            <div className="settings-header">
              <Bell size={24} color="#22c55e" />
              <h3>Notification Settings</h3>
            </div>
            <div className="settings-body">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                />
                <div>
                  <strong>Enable Notifications</strong>
                  <p>Send email notifications</p>
                </div>
              </label>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="settings-card">
            <div className="settings-header">
              <Palette size={24} color="#8b5cf6" />
              <h3>Appearance</h3>
            </div>
            <div className="settings-body">
              <div className="form-group">
                <label>Default Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.defaultVolume}
                  onChange={(e) => setSettings({ ...settings, defaultVolume: parseFloat(e.target.value) })}
                />
                <span className="range-value">{Math.round(settings.defaultVolume * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Database Info */}
          <div className="settings-card">
            <div className="settings-header">
              <Database size={24} color="#3b82f6" />
              <h3>Database Status</h3>
            </div>
            <div className="settings-body">
              <div className="status-item">
                <span className="status-label">Connection</span>
                <span className="status-badge status-success">Connected</span>
              </div>
              <div className="status-item">
                <span className="status-label">Tables</span>
                <span className="status-badge">11 tables</span>
              </div>
              <div className="status-item">
                <span className="status-label">Storage</span>
                <span className="status-badge">2 buckets</span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="settings-card">
            <div className="settings-header">
              <Shield size={24} color="#ef4444" />
              <h3>Security</h3>
            </div>
            <div className="settings-body">
              <p className="security-note">
                Security settings are managed directly in Supabase dashboard.
              </p>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Open Supabase Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
