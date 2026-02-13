import { notFound } from 'next/navigation'
import OrderDetailsClient from '@/components/OrderDetailsClient'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface PageProps {
  params: {
    id: string
  }
  searchParams?: {
    success?: string
  }
}

export default async function OrderDetailsPage({ params, searchParams }: PageProps) {
  const { id } = params

  try {
    const { data: order, error } = await supabaseAdmin
      .from('Order')
      .select('*, orderItems:OrderItem(*)')
      .eq('id', id)
      .single()

    if (error || !order) {
      console.error('Error fetching order:', error)
      notFound()
    }

    // Supabase returns dates as ISO strings, so no manual serialization needed for basic dates.
    // However, we want to ensure consistency with the Client Component's expected types.

    // Check if orderItems are returned correctly
    const orderItems = order.orderItems || []

    const serializedOrder = {
      ...order,
      orderItems: orderItems
    }

    const isSuccess = searchParams?.success === 'true'

    return (
      <OrderDetailsClient order={serializedOrder} success={isSuccess} />
    )
  } catch (error) {
    console.error('Error in OrderDetailsPage:', error)
    notFound()
  }
}
