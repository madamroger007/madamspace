import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/src/server/services/products';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/** POST /api/products/[id]/like — public, increment like count */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const product = await productService.likeProduct(Number(id));

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Product liked', likes: product.likes },
            { status: 200 }
        );
    } catch (error) {
        console.error('Like product error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to like product' },
            { status: 500 }
        );
    }
}
