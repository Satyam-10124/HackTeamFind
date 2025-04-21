import { create } from 'zustand';
import { supabase, handleError } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profile: { name?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  checkSession: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data?.session) {
        const { data: userData } = await supabase.auth.getUser();
        set({ session: data.session, user: userData.user });
      } else {
        set({ session: null, user: null });
      }
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      set({ session: data.session, user: data.user });
      return { success: true };
    } catch (error: any) {
      const errorMessage = handleError(error);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email, password, name) => {
    try {
      set({ loading: true, error: null });
      
      // Create user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            avatar_url: null,
          });
          
        if (profileError) {
          throw profileError;
        }
        
        set({ session: data.session, user: data.user });
        return { success: true };
      }
      
      return { success: false, error: "Failed to create user" };
    } catch (error: any) {
      const errorMessage = handleError(error);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      set({ session: null, user: null });
      return { success: true };
    } catch (error: any) {
      const errorMessage = handleError(error);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = handleError(error);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (profile) => {
    try {
      set({ loading: true, error: null });
      const user = get().user;
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Refresh user data
      const { data: userData } = await supabase.auth.getUser();
      set({ user: userData.user });
      return { success: true };
    } catch (error: any) {
      const errorMessage = handleError(error);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));