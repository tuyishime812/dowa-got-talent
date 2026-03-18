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

    // Method 1: Try using the is_admin() SQL function
    try {
      const { data, error } = await supabase.rpc('is_admin')
      
      if (!error && data === true) {
        console.log('✅ User is admin (via is_admin function):', user.email)
        setIsAdmin(true)
        return
      }
    } catch (err) {
      console.log('is_admin() function not available:', err.message)
    }

    // Method 2: Check admin_roles table
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        console.log('✅ User has admin role (via admin_roles table):', user.email)
        setIsAdmin(true)
        return
      }
    } catch (err) {
      console.log('admin_roles check failed:', err.message)
    }

    // Method 3: Fallback - check user email against admin emails
    const adminEmails = [
      'jeterothako276@gmail.com',
      'admin@dgt.com',
      'admin@dgtsounds.com'
    ]
    
    if (adminEmails.includes(user.email)) {
      console.log('✅ Admin email detected (fallback):', user.email)
      setIsAdmin(true)
    } else {
      console.log('⚠️ User is not admin:', user.email)
      setIsAdmin(false)
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
    if (data.user) {
      await checkAdminStatus(data.user)
    }
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
    setIsAdmin(false)
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
