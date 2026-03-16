# Checkout Flow — Refactor Plan

## Desired Flow

```
products/page.tsx
  → checkout/page.tsx     (form + Snap.js fires HERE)
       ↓ onSuccess / onPending
  → checkout/payment/[orderId]/page.tsx   (read-only receipt)
```

---

## Phase 1 — Types & Reducer Cleanup

### `src/types/type.ts`
- Remove `snapToken: string | null` from `CartState` (dead state)
- Remove `SET_SNAP_TOKEN` from `CartAction`
- Add `DELETE_FROM_CART: { payload: number }` to `CartAction`
- Change `checkout()` signature: accept explicit `grossAmount: number`

### `src/store/context/cart/cartReducer.ts`
- Remove `snapToken: null` from `initialState`
- **Add missing `SET_CHECKOUT_STATUS` case** (dispatched but never handled — button never shows loading)
- Remove dead `SET_SNAP_TOKEN` case
- Add `DELETE_FROM_CART` case (removes item at any quantity)

### `src/store/context/cart/CartContext.tsx`
- Update `checkout(customer, grossAmount, payment_method?)` signature
- Pass `grossAmount` directly as `payload.gross_amount`
- Remove `dispatch({ type: "SET_SNAP_TOKEN", ... })`
- Expose `deleteFromCart(productId)` wrapping new action

---

## Phase 2 — checkout/page.tsx Redesign (Snap moves here)

### `src/app/checkout/page.tsx`
- Compute:
  - `feePercent = parseFloat(process.env.NEXT_PUBLIC_FEE || "0")`
  - `feeAmount = Math.round(cartTotal * feePercent)`
  - `discount = appliedVoucher ? Math.round(cartTotal * appliedVoucher.discountPercent / 100) : 0`
  - `grandTotal = cartTotal + feeAmount - discount`
- `handleCheckout()`:
  1. Call `checkout(customer, grandTotal)` → get `{ order_id, snap_token }`
  2. Call `window.snap?.pay(snap_token, { onSuccess, onPending, onError, onClose })`
  3. `onSuccess` → update localStorage status to "success", POST `/api/email/send-confirmation`, `clearCart()`, `router.push(/checkout/payment/${order_id})`
  4. `onPending` → update localStorage status to "pending", `clearCart()`, `router.push(/checkout/payment/${order_id})`
  5. `onError` → dispatch error, show inline error
  6. `onClose` → dispatch idle (user cancelled, stays on page)
- Fix: phone `type="number"` → `type="tel"`

---

## Phase 3 — Payment Detail Page (read-only receipt)

### `src/app/checkout/payment/[orderId]/page.tsx`
- Remove `handlePayNow`, `window.snap`, `clearCart`, `useCartContext`
- Remove unused imports: `CreditCard`, `QrCode`, `AlertCircle`, `Play`
- Load order from localStorage, display:
  - Status badge (pending / success)
  - Customer info
  - Items list
  - `formatIDR(gross_amount)`
  - Copy invoice button
  - Transaction date
- Pending → static payment instructions (no action button)
- Success → green card + "Back to Marketplace"

---

## Phase 4 — Voucher Feature

### `src/server/actions/vouchers/action.ts`
Add `validateVoucherByCode(code: string)`:
- Calls `cachedVoucherRepository.getVoucherByCode(code)` (no HTTP round-trip)
- Returns `{ valid: false, message: "Not found" }` if missing
- Returns `{ valid: false, message: "Voucher expired" }` if `now > expiredAt`
- Returns `{ valid: true, code, discountPercent: Number(voucher.discount) }` on success

### `src/components/ModalVoucher.tsx`
- **FIX:** Add `type="button"` to `<X>` close button (defaults to submit — close = submits form)
- Add props: `isLoading: boolean`, `validationResult?: { valid: boolean; message?: string }`
- Show success/error feedback inside modal

### `src/app/checkout/page.tsx` (voucher state)
- State: `appliedVoucher: { code: string; discountPercent: number } | null`
- `voucherLoading: boolean`, `voucherError: string | null`
- `handleSubmitVoucher` calls `validateVoucherByCode` → sets `appliedVoucher`
- Conditional discount row in summary

---

## Phase 5 — IDR Formatting

### `src/utils/utils.ts`
Add:
```ts
export function formatIDR(amount: number): string {
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}
```

Apply to:
- `checkout/page.tsx` — subtotal, feeAmount, discount, grandTotal, line totals
- `checkout/payment/[orderId]/page.tsx` — `order.gross_amount`
- `components/products/CartDrawer.tsx` — `cartTotal`

---

## Phase 6 — Page Decomposition (per page-components.md)

| New File | Responsibility | Props |
|---|---|---|
| `src/components/checkout/ContactForm.tsx` | name/email/phone inputs | `value`, `onChange` |
| `src/components/checkout/OrderItem.tsx` | item card + qty controls + trash | `item`, `onDecrement`, `onIncrement`, `onDelete` |
| `src/components/checkout/OrderSummary.tsx` | totals + voucher btn + checkout btn | amounts, status, callbacks |
| `src/components/products/ProductsTopBar.tsx` | search / sort / cart (single id) | state + callbacks |
| `src/components/products/CategoryTabs.tsx` | category pills | `categories`, `active`, `onSelect` |
| `src/components/products/ProductGrid.tsx` | results meta + animated grid | `filtered`, `search`, `activeCategory`, `onClear` |

`checkout/page.tsx` and `products/page.tsx` become thin orchestrators.

---

## Verification Checklist

- [ ] "Complete Payment" → Snap popup opens (not a redirect)
- [ ] Snap success → receipt page shows green "Payment Complete"
- [ ] Snap close → stays on checkout, button resets to idle
- [ ] Snap pending → receipt page shows pending instructions (no Pay Now button)
- [ ] `gross_amount` in Midtrans = subtotal + fee − discount (check Network tab)
- [ ] Valid voucher → discount row + adjusted total
- [ ] Expired/invalid voucher → error text inside modal (stays open)
- [ ] Click ✕ on modal → closes without submitting
- [ ] All prices render as `Rp X.XXX`
- [ ] Trash icon removes item fully (not just decrements)
- [ ] No `window.snap` in payment detail page
- [ ] No duplicate `id="open-cart"` in DOM

---

## Key Decisions

- `gross_amount` computed in checkout page, passed explicitly to `checkout()` — CartContext is fee-agnostic
- `snapToken` removed from CartState — was dead code never in context value
- Snap script stays in CartProvider (loaded once app-wide)
- Pre-payment email (`sendLinkEmailPayment`) fires in CartContext on transaction creation
- Confirmation email fires in `onSuccess` inside checkout page
- Voucher validated via direct server action → repository (no new API endpoint)
- `DELETE_FROM_CART` is separate from `REMOVE_FROM_CART` (which stays decrement-only)

## Excluded

- Actual QR code image / VA number from Midtrans response body
- DB-side order status sync on payment success (requires Midtrans webhook — separate scope)
