import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      deliveryDetails,
      subtotal,
      deliveryFee,
      tax,
      total
    } = body;

    // Generate order number
    const orderNumber = `TTB${Date.now()}`;

    // Calculate estimated delivery (40 minutes from now)
    const estimatedDelivery = new Date(Date.now() + 40 * 60 * 1000).toISOString();

    // 1. Create or get customer
    const { data: customer, error: customerError } = await supabase
      .from('Customer')
      .upsert({
        name: deliveryDetails.fullName,
        phone: deliveryDetails.phone,
        email: deliveryDetails.email || null,
      }, { onConflict: 'phone' })
      .select('id')
      .single();

    if (customerError) throw customerError;

    // 2. Create order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        orderNumber,
        customerId: customer.id,
        deliveryName: deliveryDetails.fullName,
        deliveryPhone: deliveryDetails.phone,
        deliveryEmail: deliveryDetails.email || null,
        addressLine1: deliveryDetails.addressLine1,
        addressLine2: deliveryDetails.addressLine2 || null,
        landmark: deliveryDetails.landmark || null,
        pincode: deliveryDetails.pincode,
        city: deliveryDetails.city || 'Ahmedabad',
        subtotal,
        deliveryFee,
        tax,
        discount: 0,
        total,
        estimatedDelivery,
      })
      .select('*')
      .single();

    if (orderError) throw orderError;

    // 3. Create order items
    const orderItemsData = items.map((item: any) => ({
      orderId: order.id,
      menuItemId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('OrderItem')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 4. Return complete order
    return NextResponse.json({
      ...order,
      orderItems: items // For the frontend to use immediately
    });

  } catch (error) {
    console.error('Error creating order:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      );
    }

    const { data: customer, error: customerError } = await supabase
      .from('Customer')
      .select('id')
      .eq('phone', phone)
      .single();

    if (customerError || !customer) {
      return NextResponse.json([]);
    }

    const { data: orders, error: ordersError } = await supabase
      .from('Order')
      .select(`
        *,
        orderItems:OrderItem(
          *,
          menuItem:MenuItem(*)
        )
      `)
      .eq('customerId', customer.id)
      .order('createdAt', { ascending: false });

    if (ordersError) throw ordersError;

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
