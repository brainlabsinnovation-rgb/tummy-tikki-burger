import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define types for the query result
type MenuItemWithCategory = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
  Category: {
    slug: string;
    name: string;
  } | null;
};

export async function GET() {
  try {
    const { data: menuItems, error } = await supabase
      .from('MenuItem')
      .select(`
        *,
        Category:categoryId (
          slug,
          name
        )
      `)
      .eq('isAvailable', true)
      .order('name');

    if (error) {
      console.error('Supabase error fetching menu:', error);
      return NextResponse.json(
        { error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }

    if (!menuItems) {
      return NextResponse.json({ categories: [] });
    }

    // Transform data to group by category slug (old structure expected by frontend)
    const groupedMenu = (menuItems as any[]).reduce((acc: any, item: any) => {
      // Handle the case where Category might be an array or object depending on Supabase response
      const categoryData = Array.isArray(item.Category) ? item.Category[0] : item.Category;
      const categorySlug = categoryData?.slug || 'other';

      if (!acc[categorySlug]) {
        acc[categorySlug] = [];
      }

      acc[categorySlug].push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: categorySlug,
        image: item.image,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
      });

      return acc;
    }, {});

    return NextResponse.json(groupedMenu);
  } catch (error) {
    console.error('Error in menu API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
