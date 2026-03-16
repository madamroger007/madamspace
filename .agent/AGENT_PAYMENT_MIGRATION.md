
## Replace Snap Payment with Midtrans Core API

## 1. Objective

Migrate the payment system from **Snap Payment Gateway** to **Core API** to achieve:

* Better backend control
* Easier integration with custom UI
* Direct control of payment methods
* More flexible payment orchestration

The system must support the following payment methods:

* QRIS
* DANA
* GoPay
* SeaBank
* Credit Card (MasterCard)
* PayPal
* BNI Virtual Account
* BRI Virtual Account
* Mandiri Virtual Account

---

# 2. Current Architecture

Current payment flow:

```
Client
   ↓
Next.js API
   ↓
Midtrans Snap API
   ↓
Redirect / Popup
   ↓
Payment
   ↓
Webhook
   ↓
Update Database
```

Problems:

* Limited customization
* Snap UI dependency
* Hard to manage per-payment-method logic
* Less efficient for backend orchestration

---

# 3. Target Architecture (Core API)

New payment flow:

```
Client
   ↓
Next.js API
   ↓
Payment Service
   ↓
Midtrans Core API
   ↓
Return payment instructions
   ↓
Client displays payment UI
   ↓
User completes payment
   ↓
Midtrans Webhook
   ↓
Update Transaction Status
```

---

# 4. Repository Architecture

Follow the existing repository pattern:

```
db
repositories
services
api
```

Payment modules:

```
src/server/
│
├── repositories
│   └── transactionRepository.ts
│
├── services
│   └── paymentService.ts
│
├── providers
│   └── midtransProvider.ts
│
├── webhook
│   └── midtransWebhookHandler.ts
│
└── types
    └── paymentTypes.ts
```

---

# 5. Supported Payment Methods Mapping

| Payment Method | Midtrans Type |
| -------------- | ------------- |
| QRIS           | qris          |
| GoPay          | gopay         |
| DANA           | ewallet       |
| SeaBank        | bank_transfer |
| BNI            | bni_va        |
| BRI            | bri_va        |
| Mandiri        | mandiri_va    |
| MasterCard     | credit_card   |
| PayPal         | paypal        |

---

# 6. Core API Payment Request

Endpoint:

```
POST https://api.midtrans.com/v2/charge
```

Example payload:

```json
{
  "payment_type": "qris",
  "transaction_details": {
    "order_id": "ORDER-123",
    "gross_amount": 100000
  },
  "qris": {
    "acquirer": "gopay"
  }
}
```

---

# 7. Payment Service Logic

Responsibilities:

* create transaction
* call Midtrans Core API
* store payment instructions
* return instructions to frontend

Example service flow:

```
createTransaction()
      ↓
storePendingTransaction()
      ↓
callMidtransChargeAPI()
      ↓
savePaymentInstruction()
      ↓
returnPaymentDataToClient()
```

---

# 8. Database Schema

Transaction table example:

```
transactions

id
order_id
user_id
payment_method
gross_amount
fee
net_amount
status
midtrans_transaction_id
created_at
updated_at
```

Status values:

```
pending
settlement
expire
cancel
failure
```

---

# 9. Webhook Handling

Webhook endpoint:

```
POST /api/payment/webhook/midtrans
```

Webhook responsibilities:

* verify signature
* update transaction status
* record settlement data

Example webhook flow:

```
receiveWebhook
     ↓
verifySignature
     ↓
getTransaction(order_id)
     ↓
updateStatus
     ↓
triggerPostPaymentLogic
```

---

# 10. Frontend Payment UI

Since Snap is removed, frontend must render UI.

Example:

```
Payment Page
   ↓
Select payment method
   ↓
Call API /create-payment
   ↓
Receive payment instructions
   ↓
Render UI depending on payment type
```

Examples:

QRIS → show QR image
VA → show virtual account number
GoPay → deeplink / QR
Credit Card → card form

---

# 11. Security Rules

Server-side only:

```
MIDTRANS_SERVER_KEY
```

Never expose:

```
server_key
```

Webhook validation:

```
signature_key verification
```

---

# 12. AI Agent Tasks

AI agents must perform the following tasks:

### Task 1

Remove Snap integration:

```
snap.js
snapToken
snapPopup
```

---

### Task 2

Create Core API provider:

```
midtransProvider.ts
```

Responsible for:

```
createCharge
checkTransaction
cancelTransaction
```

---

### Task 3

Create payment service:

```
paymentService.ts
```

Responsibilities:

```
orchestrate payment flow
map payment method
store transaction
return payment instructions
```

---

### Task 4

Create webhook handler:

```
midtransWebhookHandler.ts
```

Responsibilities:

```
verify webhook signature
update transaction status
log settlement data
```

---

### Task 5

Implement payment UI components:

```
components/payment
│
├── QrisPayment.tsx
├── VirtualAccountPayment.tsx
├── EwalletPayment.tsx
└── CreditCardPayment.tsx
```

---

# 13. Environment Variables

```
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_BASE_URL=https://api.midtrans.com
```

Sandbox:

```
https://api.sandbox.midtrans.com
```

---

# 14. Testing Strategy

Testing steps:

1. Create transaction
2. Generate payment instruction
3. Simulate payment
4. Receive webhook
5. Verify database update
6. Validate settlement logic

---

# 15. Expected Result

Final system should:

* remove Snap dependency
* fully use Core API
* support multiple payment methods
* allow full UI customization
* maintain secure backend processing

---

# 16. Future Improvements

Possible enhancements:

* automatic fee calculation
* settlement reconciliation
* payment retry system
* refund handling
* transaction monitoring dashboard
