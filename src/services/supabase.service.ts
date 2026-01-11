
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;
  private _isConfigured = false;

  constructor() {
    this.initClient();
  }

  private initClient() {
    // 1. Priority: Hardcoded Config File (src/supabase.config.ts)
    let supabaseUrl = SUPABASE_CONFIG.url;
    let supabaseKey = SUPABASE_CONFIG.key;

    // 2. Fallback: Environment Variables
    if (!supabaseUrl || !supabaseKey) {
        try {
            supabaseUrl = process.env['SUPABASE_URL'] || '';
            supabaseKey = process.env['SUPABASE_KEY'] || '';
        } catch (e) {
            // process.env might not be available
        }
    }

    // 3. Fallback: LocalStorage (Persistence "once for ever" via UI)
    if (!supabaseUrl || !supabaseKey) {
        const storedUrl = localStorage.getItem('SUPABASE_URL');
        const storedKey = localStorage.getItem('SUPABASE_KEY');
        if (storedUrl && storedKey) {
            supabaseUrl = storedUrl;
            supabaseKey = storedKey;
        }
    }

    // 4. Initialize
    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co') {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this._isConfigured = true;
    } else {
        console.warn('Supabase not configured. Please set credentials in src/supabase.config.ts or via the UI.');
        // Initialize with placeholder to allow app to load without crashing, but marks isConfigured as false
        this.supabase = createClient('https://placeholder.supabase.co', 'placeholder');
        this._isConfigured = false;
    }
  }

  public configure(url: string, key: string) {
      if (url && key) {
          localStorage.setItem('SUPABASE_URL', url);
          localStorage.setItem('SUPABASE_KEY', key);
          this.initClient();
          window.location.reload(); // Reload to force fresh state
      }
  }

  get isConfigured(): boolean {
      return this._isConfigured;
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: any }> {
    if (!this._isConfigured) return { user: null, session: null, error: { message: "Supabase not configured." } };
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  }

  async signUp(email: string, password: string, fullName: string): Promise<{ user: User | null; session: Session | null; error: any }> {
    if (!this._isConfigured) return { user: null, session: null, error: { message: "Supabase not configured." } };

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { user: data.user, session: data.session, error };
  }

  async signOut(): Promise<{ error: any }> {
    if (!this._isConfigured) return { error: null };
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getSession(): Promise<{ session: Session | null; error: any }> {
    if (!this._isConfigured) return { session: null, error: null };
    const { data, error } = await this.supabase.auth.getSession();
    return { session: data.session, error };
  }

  async getUser(): Promise<{ user: User | null; error: any }> {
      if (!this._isConfigured) return { user: null, error: null };
      const { data, error } = await this.supabase.auth.getUser();
      return { user: data.user, error };
  }

  async sendPasswordResetEmail(email: string): Promise<{ error: any }> {
    if (!this._isConfigured) return { error: { message: "Supabase not configured." } };
    
    // The redirectTo URL should point to a page where you handle the password update logic
    // For this app, we'll redirect to root, the user can then change it in their profile if implemented
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, 
    });
    return { error };
  }
}
