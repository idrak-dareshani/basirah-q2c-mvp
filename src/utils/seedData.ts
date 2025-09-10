import { supabase } from '../lib/supabase';

export async function generateSeedData() {
  try {
    console.log('Starting seed data generation...');

    // Clear existing data
    await supabase.from('q2c_quote_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('q2c_invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('q2c_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('q2c_quotes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('q2c_products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('q2c_customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Seed Customers
    const customers = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Solutions',
        address: '123 Business Ave, New York, NY 10001'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@innovate.io',
        phone: '+1 (555) 987-6543',
        company: 'Innovate Industries',
        address: '456 Innovation Dr, San Francisco, CA 94105'
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@globaltech.com',
        phone: '+1 (555) 456-7890',
        company: 'GlobalTech Enterprises',
        address: '789 Enterprise Blvd, Austin, TX 73301'
      },
      {
        name: 'David Kim',
        email: 'david.kim@startupx.com',
        phone: '+1 (555) 321-9876',
        company: 'StartupX Inc',
        address: '321 Startup Lane, Seattle, WA 98101'
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@megacorp.com',
        phone: '+1 (555) 654-3210',
        company: 'MegaCorp International',
        address: '654 Corporate Plaza, Chicago, IL 60601'
      }
    ];

    const { data: insertedCustomers } = await supabase
      .from('q2c_customers')
      .insert(customers)
      .select();

    console.log('Customers seeded:', insertedCustomers?.length);

    // Seed Products
    const products = [
      {
        name: 'Enterprise Software License',
        description: 'Annual license for enterprise software suite with full support',
        price: 5000,
        category: 'Software',
        sku: 'ESL-001'
      },
      {
        name: 'Professional Consulting',
        description: 'Expert consulting services per hour for system implementation',
        price: 200,
        category: 'Services',
        sku: 'PC-002'
      },
      {
        name: 'Cloud Storage Package',
        description: 'Premium cloud storage with 1TB capacity and backup',
        price: 100,
        category: 'Cloud Services',
        sku: 'CSP-003'
      },
      {
        name: 'Security Audit',
        description: 'Comprehensive security assessment and vulnerability testing',
        price: 3000,
        category: 'Security',
        sku: 'SA-004'
      },
      {
        name: 'Training Workshop',
        description: 'Full-day training workshop for up to 20 participants',
        price: 1500,
        category: 'Training',
        sku: 'TW-005'
      },
      {
        name: 'Premium Support Package',
        description: '24/7 premium support with dedicated account manager',
        price: 2000,
        category: 'Support',
        sku: 'PSP-006'
      },
      {
        name: 'Custom Integration',
        description: 'Custom API integration and development services',
        price: 4000,
        category: 'Services',
        sku: 'CI-007'
      },
      {
        name: 'Hardware Setup',
        description: 'Complete hardware setup and configuration service',
        price: 800,
        category: 'Hardware',
        sku: 'HS-008'
      }
    ];

    const { data: insertedProducts } = await supabase
      .from('q2c_products')
      .insert(products)
      .select();

    console.log('Products seeded:', insertedProducts?.length);

    if (!insertedCustomers || !insertedProducts) {
      throw new Error('Failed to insert customers or products');
    }

    // Seed Quotes
    const quotes = [
      {
        quote_number: 'Q-2024-001',
        customer_id: insertedCustomers[0].id,
        subtotal: 10000,
        tax: 1000,
        total: 11000,
        status: 'approved',
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        quote_number: 'Q-2024-002',
        customer_id: insertedCustomers[1].id,
        subtotal: 8000,
        tax: 800,
        total: 8800,
        status: 'sent',
        valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        quote_number: 'Q-2024-003',
        customer_id: insertedCustomers[2].id,
        subtotal: 6500,
        tax: 650,
        total: 7150,
        status: 'approved',
        valid_until: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        quote_number: 'Q-2024-004',
        customer_id: insertedCustomers[3].id,
        subtotal: 3000,
        tax: 300,
        total: 3300,
        status: 'draft',
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        quote_number: 'Q-2024-005',
        customer_id: insertedCustomers[4].id,
        subtotal: 12000,
        tax: 1200,
        total: 13200,
        status: 'rejected',
        valid_until: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: insertedQuotes } = await supabase
      .from('q2c_quotes')
      .insert(quotes)
      .select();

    console.log('Quotes seeded:', insertedQuotes?.length);

    if (!insertedQuotes) {
      throw new Error('Failed to insert quotes');
    }

    // Seed Quote Items
    const quoteItems = [
      // Quote 1 items
      {
        quote_id: insertedQuotes[0].id,
        product_id: insertedProducts[0].id,
        quantity: 2,
        unit_price: 5000,
        discount: 0,
        total: 10000
      },
      // Quote 2 items
      {
        quote_id: insertedQuotes[1].id,
        product_id: insertedProducts[1].id,
        quantity: 40,
        unit_price: 200,
        discount: 0,
        total: 8000
      },
      // Quote 3 items
      {
        quote_id: insertedQuotes[2].id,
        product_id: insertedProducts[3].id,
        quantity: 1,
        unit_price: 3000,
        discount: 0,
        total: 3000
      },
      {
        quote_id: insertedQuotes[2].id,
        product_id: insertedProducts[4].id,
        quantity: 2,
        unit_price: 1500,
        discount: 0,
        total: 3000
      },
      {
        quote_id: insertedQuotes[2].id,
        product_id: insertedProducts[2].id,
        quantity: 5,
        unit_price: 100,
        discount: 0,
        total: 500
      },
      // Quote 4 items
      {
        quote_id: insertedQuotes[3].id,
        product_id: insertedProducts[3].id,
        quantity: 1,
        unit_price: 3000,
        discount: 0,
        total: 3000
      },
      // Quote 5 items
      {
        quote_id: insertedQuotes[4].id,
        product_id: insertedProducts[0].id,
        quantity: 1,
        unit_price: 5000,
        discount: 0,
        total: 5000
      },
      {
        quote_id: insertedQuotes[4].id,
        product_id: insertedProducts[6].id,
        quantity: 1,
        unit_price: 4000,
        discount: 0,
        total: 4000
      },
      {
        quote_id: insertedQuotes[4].id,
        product_id: insertedProducts[5].id,
        quantity: 1,
        unit_price: 2000,
        discount: 0,
        total: 2000
      },
      {
        quote_id: insertedQuotes[4].id,
        product_id: insertedProducts[7].id,
        quantity: 1,
        unit_price: 800,
        discount: 0,
        total: 800
      }
    ];

    const { data: insertedQuoteItems } = await supabase
      .from('q2c_quote_items')
      .insert(quoteItems)
      .select();

    console.log('Quote items seeded:', insertedQuoteItems?.length);

    // Seed Orders (only for approved quotes)
    const approvedQuotes = insertedQuotes.filter(q => q.status === 'approved');
    const orders = [
      {
        order_number: 'ORD-2024-001',
        quote_id: approvedQuotes[0].id,
        customer_id: approvedQuotes[0].customer_id,
        total: approvedQuotes[0].total,
        status: 'confirmed'
      },
      {
        order_number: 'ORD-2024-002',
        quote_id: approvedQuotes[1].id,
        customer_id: approvedQuotes[1].customer_id,
        total: approvedQuotes[1].total,
        status: 'shipped'
      }
    ];

    const { data: insertedOrders } = await supabase
      .from('q2c_orders')
      .insert(orders)
      .select();

    console.log('Orders seeded:', insertedOrders?.length);

    if (!insertedOrders) {
      throw new Error('Failed to insert orders');
    }

    // Seed Invoices
    const invoices = [
      {
        invoice_number: 'INV-2024-001',
        order_id: insertedOrders[0].id,
        customer_id: insertedOrders[0].customer_id,
        total: insertedOrders[0].total,
        status: 'paid',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paid_at: new Date().toISOString()
      },
      {
        invoice_number: 'INV-2024-002',
        order_id: insertedOrders[1].id,
        customer_id: insertedOrders[1].customer_id,
        total: insertedOrders[1].total,
        status: 'sent',
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { data: insertedInvoices } = await supabase
      .from('q2c_invoices')
      .insert(invoices)
      .select();

    console.log('Invoices seeded:', insertedInvoices?.length);

    console.log('✅ Seed data generation completed successfully!');
    return {
      customers: insertedCustomers?.length || 0,
      products: insertedProducts?.length || 0,
      quotes: insertedQuotes?.length || 0,
      quoteItems: insertedQuoteItems?.length || 0,
      orders: insertedOrders?.length || 0,
      invoices: insertedInvoices?.length || 0
    };

  } catch (error) {
    console.error('❌ Error generating seed data:', error);
    throw error;
  }
}