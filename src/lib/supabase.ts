import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      q2c_customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          company: string;
          address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          address?: string;
          updated_at?: string;
        };
      };
      q2c_products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          sku: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price?: number;
          category: string;
          sku: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          sku?: string;
          updated_at?: string;
        };
      };
      q2c_quotes: {
        Row: {
          id: string;
          quote_number: string;
          customer_id: string;
          subtotal: number;
          tax: number;
          total: number;
          status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
          valid_until: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_number: string;
          customer_id: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
          valid_until: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quote_number?: string;
          customer_id?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
          valid_until?: string;
          updated_at?: string;
        };
      };
      q2c_quote_items: {
        Row: {
          id: string;
          quote_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          discount: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          product_id: string;
          quantity?: number;
          unit_price: number;
          discount?: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quote_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          discount?: number;
          total?: number;
        };
      };
      q2c_orders: {
        Row: {
          id: string;
          order_number: string;
          quote_id: string;
          customer_id: string;
          total: number;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          quote_id: string;
          customer_id: string;
          total?: number;
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          quote_id?: string;
          customer_id?: string;
          total?: number;
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          updated_at?: string;
        };
      };
      q2c_invoices: {
        Row: {
          id: string;
          invoice_number: string;
          order_id: string;
          customer_id: string;
          total: number;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          due_date: string;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          order_id: string;
          customer_id: string;
          total?: number;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          due_date: string;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          order_id?: string;
          customer_id?: string;
          total?: number;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
          due_date?: string;
          paid_at?: string | null;
        };
      };
    };
  };
}