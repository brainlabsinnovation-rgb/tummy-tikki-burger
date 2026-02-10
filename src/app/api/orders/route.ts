import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
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

    // 1. Create or update customer
    // The previous Prisma code used upsert on phone.
    const { data: customerData, error: customerError } = await supabase
      .from('Customer')
      .upsert({
        name: deliveryDetails.fullName,
        phone: deliveryDetails.phone,
        email: deliveryDetails.email || null,
        updatedAt: new Date().toISOString(),
      }, { onConflict: 'phone' })
      .select()
      .single();

    if (customerError) {
      console.error('Error upserting customer:', customerError);
      throw new Error('Failed to create/update customer');
    }

    if (!customerData) {
      throw new Error('Customer data not returned');
    }

    // 2. Create Order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .insert({
        orderNumber: orderNumber,
        customerId: customerData.id,
        deliveryName: deliveryDetails.fullName,
        deliveryPhone: deliveryDetails.phone,
        deliveryEmail: deliveryDetails.email || null,
        addressLine1: deliveryDetails.addressLine1,
        addressLine2: deliveryDetails.addressLine2 || null,
        landmark: deliveryDetails.landmark || null,
        pincode: deliveryDetails.pincode,
        city: deliveryDetails.city || 'Ahmedabad',
        state: deliveryDetails.state || 'Gujarat',
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: total,
        discount: 0,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        paymentMethod: 'COD', // Defaulting to COD if not provided in body top-level
        estimatedDelivery: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    // 3. Create OrderItems
    const orderItemsData = items.map((item: any) => ({
      orderId: orderData.id,
      menuItemId: item.id,
      itemName: item.name,
      itemImage: item.image || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('OrderItem')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Note: Code cleanup would be needed here in a real transaction
      throw new Error('Failed to create order items');
    }

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      orderNumber: orderNumber
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ orders: [] });
    }

    // Find customer first to get ID? Or join?
    // Let's try to join via Customer table
    // Or fetch by phone if we can join Order -> Customer

    const { data: orders, error } = await supabase
      .from('Order')
      .select(`
                *,
                customer:Customer!inner(phone),
                orderItems:OrderItem(*)
            `)
      .eq('customer.phone', phone)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      // If connection or table error
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    if (!orders) {
      return NextResponse.json({ orders: [] });
    }

    // Transform for frontend
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      order_items: order.orderItems?.map((item: any) => ({
        ...item,
        item_name: item.itemName,
      })) || [],
      orderItems: undefined
    }));

    return NextResponse.json({ orders: formattedOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
