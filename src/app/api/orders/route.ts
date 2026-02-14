import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      deliveryDetails,
      subtotal,
      deliveryFee,
      tax,
      discountAmount,
      couponCode,
      total
    } = body;

    // 1. Create or update customer
    let { data: customer, error: fetchError } = await supabaseAdmin
      .from('Customer')
      .select('id')
      .eq('phone', deliveryDetails.phone)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message || 'Failed to fetch customer');
    }

    if (customer) {
      // Update existing
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('Customer')
        .update({
          name: deliveryDetails.fullName,
          email: deliveryDetails.email || null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', customer.id)
        .select()
        .single();

      if (updateError) throw updateError;
      customer = updated;
    } else {
      // Create new
      const { data: newCustomer, error: insertError } = await supabaseAdmin
        .from('Customer')
        .insert({
          id: crypto.randomUUID(),
          phone: deliveryDetails.phone,
          name: deliveryDetails.fullName,
          email: deliveryDetails.email || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;
      customer = newCustomer;
    }

    if (!customer) {
      throw new Error('Customer creation/update failed (no data returned)');
    }

    // 2. Create Order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { data: order, error: orderError } = await supabaseAdmin
      .from('Order')
      .insert({
        id: crypto.randomUUID(),
        orderNumber: orderNumber,
        customerId: customer.id,
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
        discount: discountAmount || 0,
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        paymentMethod: 'RAZORPAY',
        estimatedDelivery: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      throw new Error(orderError.message || 'Failed to create order');
    }

    // 3. Create OrderItems
    const orderItemsData = items.map((item: any) => ({
      id: crypto.randomUUID(),
      orderId: order.id,
      menuItemId: item.id,
      itemName: item.name,
      itemImage: item.image || null,
      customizations: item.customizations || [],
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('OrderItem')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      throw new Error(itemsError.message || 'Failed to create order items');
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order', raw: error },
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

    const { data: orders, error } = await supabaseAdmin
      .from('Order')
      .select('*, orderItems:OrderItem(*), customer:Customer!inner(phone)')
      .eq('customer.phone', phone)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    const formattedOrders = orders?.map((order: any) => ({
      ...order,
      order_items: order.orderItems?.map((item: any) => ({
        ...item,
        item_name: item.itemName || item.item_name,
      })) || [],
    })) || [];

    return NextResponse.json({ orders: formattedOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
