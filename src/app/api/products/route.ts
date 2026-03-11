import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/src/server/services/products';
import { productSchema } from '@/src/server/validations/products';
import { requireApiTokenRole } from '@/src/lib/auth/withAuth';

/** GET /api/products — public, list all products */
export async function GET(request: NextRequest) {
    try {
        // Check for category filter
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const products = category
            ? await productService.getProductsByCategory(category)
            : await productService.getProducts();

        return NextResponse.json({ success: true, products }, { status: 200 });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

/** POST /api/products — admin only (Bearer token), create product */
export async function POST(request: NextRequest) {
    const auth = await requireApiTokenRole(request);
    if (auth instanceof NextResponse) return auth;

    try {
        const body = await request.json();
        const validation = productSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Validation failed', errors: validation.error.flatten() },
                { status: 400 }
            );
        }

        const product = await productService.createProduct(validation.data);
        return NextResponse.json(
            { success: true, message: 'Product created successfully', product },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create product' },
            { status: 500 }
        );
    }
}
