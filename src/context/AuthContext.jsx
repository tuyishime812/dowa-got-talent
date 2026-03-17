import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdminStatus = async (user) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    // Check if user has admin role in the database
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (data) {
        console.log('✅ User has admin role:', user.email)
        setIsAdmin(true)
      } else if (!error) {
        // Fallback: check if user email matches admin email
        // This is for initial setup before admin_roles table is created
        const adminEmails = ['jeterothako276@gmail.com', 'admin@dgt.com']
        if (adminEmails.includes(user.email)) {
          console.log('✅ Admin email detected:', user.email)
          setIsAdmin(true)
        } else {
          console.log('⚠️ User does not have admin role:', user.email)
          setIsAdmin(false)
        }
      } else {
        // If table doesn't exist, fall back to email check
        const adminEmails = ['jeterothako276@gmail.com', 'admin@dgt.com']
        if (adminEmails.includes(user.email)) {
          console.log('✅ Admin email detected:', user.email)
          setIsAdmin(true)
        } else {
          console.log('⚠️ User does not have admin role:', user.email)
          setIsAdmin(false)
        }
      }
    } catch (err) {
      console.log('Error checking admin status:', err)
      // Fallback to email check
      const adminEmails = ['jeterothako276@gmail.com', 'admin@dgt.com']
      if (adminEmails.includes(user.email)) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await checkAdminStatus(session.user)
        } else {
          setIsAdmin(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
