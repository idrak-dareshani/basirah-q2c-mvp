/*
  # Create Q2C (Quote to Cash) Database Schema

  1. New Tables
    - `q2c_customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `company` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `q2c_products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `sku` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `q2c_quotes`
      - `id` (uuid, primary key)
      - `quote_number` (text, unique)
      - `customer_id` (uuid, foreign key)
      - `subtotal` (numeric)
      - `tax` (numeric)
      - `total` (numeric)
      - `status` (text)
      - `valid_until` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `q2c_quote_items`
      - `id` (uuid, primary key)
      - `quote_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `discount` (numeric)
      - `total` (numeric)
      - `created_at` (timestamp)
    
    - `q2c_orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `quote_id` (uuid, foreign key)
      - `customer_id` (uuid, foreign key)
      - `total` (numeric)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `q2c_invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text, unique)
      - `order_id` (uuid, foreign key)
      - `customer_id` (uuid, foreign key)
      - `total` (numeric)
      - `status` (text)
      - `due_date` (timestamp)
      - `paid_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS q2c_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  company text NOT NULL,
  address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS q2c_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) DEFAULT 0,
  category text NOT NULL,
  sku text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS q2c_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL,
  customer_id uuid NOT NULL REFERENCES q2c_customers(id) ON DELETE CASCADE,
  subtotal numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')),
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quote items table
CREATE TABLE IF NOT EXISTS q2c_quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES q2c_quotes(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES q2c_products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  discount numeric(5,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS q2c_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  quote_id uuid NOT NULL REFERENCES q2c_quotes(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES q2c_customers(id) ON DELETE CASCADE,
  total numeric(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS q2c_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  order_id uuid NOT NULL REFERENCES q2c_orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES q2c_customers(id) ON DELETE CASCADE,
  total numeric(10,2) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date timestamptz NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_q2c_customers_email ON q2c_customers(email);
CREATE INDEX IF NOT EXISTS idx_q2c_products_sku ON q2c_products(sku);
CREATE INDEX IF NOT EXISTS idx_q2c_products_category ON q2c_products(category);
CREATE INDEX IF NOT EXISTS idx_q2c_quotes_customer_id ON q2c_quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_q2c_quotes_status ON q2c_quotes(status);
CREATE INDEX IF NOT EXISTS idx_q2c_quote_items_quote_id ON q2c_quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_q2c_quote_items_product_id ON q2c_quote_items(product_id);
CREATE INDEX IF NOT EXISTS idx_q2c_orders_customer_id ON q2c_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_q2c_orders_quote_id ON q2c_orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_q2c_orders_status ON q2c_orders(status);
CREATE INDEX IF NOT EXISTS idx_q2c_invoices_customer_id ON q2c_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_q2c_invoices_order_id ON q2c_invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_q2c_invoices_status ON q2c_invoices(status);

-- Enable Row Level Security
ALTER TABLE q2c_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE q2c_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE q2c_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE q2c_quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE q2c_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE q2c_invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can manage customers"
  ON q2c_customers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage products"
  ON q2c_products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage quotes"
  ON q2c_quotes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage quote items"
  ON q2c_quote_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage orders"
  ON q2c_orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage invoices"
  ON q2c_invoices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_q2c_customers_updated_at
  BEFORE UPDATE ON q2c_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_q2c_products_updated_at
  BEFORE UPDATE ON q2c_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_q2c_quotes_updated_at
  BEFORE UPDATE ON q2c_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_q2c_orders_updated_at
  BEFORE UPDATE ON q2c_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();