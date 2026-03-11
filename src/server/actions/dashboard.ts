'use server';

// ─── Products Server Actions ─────────────────────────────────────────────────

export async function createProduct(formData: {
    name: string;
    price: number;
    description: string;
    image: string | null;
    videoUrl: string | null;
    category: string | null;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(formData),
    });

    return response.json();
}

export async function updateProduct(
    productId: number,
    formData: {
        name?: string;
        price?: number;
        description?: string;
        image?: string | null;
        videoUrl?: string | null;
        category?: string | null;
    }
) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(formData),
    });

    return response.json();
}

export async function deleteProduct(productId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
    });

    return response.json();
}

// ─── Categories Server Actions ───────────────────────────────────────────────

export async function createCategory(formData: { name: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(formData),
    });

    return response.json();
}

export async function updateCategory(categoryId: number, formData: { name: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(formData),
    });

    return response.json();
}

export async function deleteCategory(categoryId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
    });

    return response.json();
}

// ─── Vouchers Server Actions ─────────────────────────────────────────────────

export async function createVoucher(formData: {
    code: string;
    discount: string;
    expiredAt: string;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/voucher`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(formData),
    });

    return response.json();
}

export async function updateVoucher(
    voucherId: number,
    formData: {
        code: string;
        discount: string;
        expiredAt: string;
    }
) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/voucher/${voucherId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
        body: JSON.stringify(formData),
    });

    return response.json();
}

export async function deleteVoucher(voucherId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/voucher/${voucherId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        },
    });

    return response.json();
}
