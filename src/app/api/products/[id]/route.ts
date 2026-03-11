import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/src/server/services/products';
import { updateProductSchema } from '@/src/server/validations/products';
import { requireApiTokenRole } from '@/src/lib/auth/withAuth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/** GET /api/products/[id] — public, get single product */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const product = await productService.getProductById(Number(id));

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, product }, { status: 200 });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

/** PATCH /api/products/[id] — admin only (Bearer token), update product */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const auth = await requireApiTokenRole(request);
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const body = await request.json();
        const validation = updateProductSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Validation failed', errors: validation.error.flatten() },
                { status: 400 }
            );
        }

        const product = await productService.updateProduct(Number(id), validation.data);

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Product updated successfully', product },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update product' },
            { status: 500 }
        );
    }
}

/** DELETE /api/products/[id] — admin only (Bearer token), delete product */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const auth = await requireApiTokenRole(request);
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const deleted = await productService.deleteProduct(Number(id));

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
