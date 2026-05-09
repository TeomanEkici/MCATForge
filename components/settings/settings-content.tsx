'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Props {
  user: User
}

export function SettingsContent({ user }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Password updated successfully')
      form.reset()
    }
    setLoading(false)
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    // In production, call a server-side function with service role key
    alert('Account deletion requires a server-side action. Contact support.')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account</p>

      {/* Account info */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Account Information</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm text-foreground">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="text-sm text-foreground font-mono text-xs">{user.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="text-sm text-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="New password (min. 6 characters)"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {message && (
            <p className={`text-sm ${message.startsWith('Error') ? 'text-destructive' : 'text-green-400'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-fit bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/30 rounded-xl p-6">
        <h2 className="font-semibold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting your account will remove all your progress, quiz history, and flashcard reviews permanently.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
