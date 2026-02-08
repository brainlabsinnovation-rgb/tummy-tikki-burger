import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching menu from Supabase...');
    const { data, error } = await supabase
      .from('MenuItem')
      .select('*')
      .eq('isAvailable', true)
      .order('category')
      .order('name');

    if (error) throw error;

    console.log(`Found ${data.length} menu items`);

    // Group by category
    const menuItems = data.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
      });
      return acc;
    }, {});

    return NextResponse.json(menuItems);

  } catch (error) {
    console.error('Error fetching menu:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch menu';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
