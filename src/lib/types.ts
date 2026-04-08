export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Role = 'super_admin' | 'owner' | 'staff' | 'customer';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; first_name: string | null; last_name: string | null; email: string | null; phone: string | null; avatar_url: string | null; role: Role; created_at: string; };
        Insert: { id: string; first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null; avatar_url?: string | null; role?: Role; };
        Update: { first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null; avatar_url?: string | null; role?: Role; };
      };
      categories: {
        Row: { id: string; name: string; slug: string; description: string | null; image_url: string | null; created_at: string; };
        Insert: { id?: string; name: string; slug: string; description?: string | null; image_url?: string | null; };
        Update: { name?: string; slug?: string; description?: string | null; image_url?: string | null; };
      };
      products: {
        Row: { id: string; category_id: string | null; title: string; slug: string; description: string | null; price: number; stock_quantity: number; images: string[]; is_featured: boolean; created_at: string; };
        Insert: { id?: string; category_id?: string | null; title: string; slug: string; description?: string | null; price: number; stock_quantity?: number; images?: string[]; is_featured?: boolean; };
        Update: { category_id?: string | null; title?: string; slug?: string; description?: string | null; price?: number; stock_quantity?: number; images?: string[]; is_featured?: boolean; };
      };
      orders: {
        Row: { id: string; user_id: string | null; status: string; total_amount: number; created_at: string; };
        Insert: { id?: string; user_id?: string | null; status?: string; total_amount: number; };
        Update: { user_id?: string | null; status?: string; total_amount?: number; };
      };
      order_items: {
        Row: { id: string; order_id: string | null; product_id: string | null; quantity: number; price_at_time: number; };
        Insert: { id?: string; order_id?: string | null; product_id?: string | null; quantity: number; price_at_time: number; };
        Update: { order_id?: string | null; product_id?: string | null; quantity?: number; price_at_time?: number; };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type ProductWithCategory = Product & { categories: Category | null };
export type OrderWithItems = Order & { order_items: (OrderItem & { products: Product | null })[] };
