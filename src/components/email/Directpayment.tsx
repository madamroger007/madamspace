export default async function DirectPayment(params: {
  link: string;
  order_id: string;
  name: string;
  total: number;
}) {
  const { link, order_id, name, total } = params;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px",
        border: "1px solid #eee",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#6c47ff", margin: 0 }}>Madamspace</h1>
      </div>

      {/* Title */}
      <h2 style={{ marginBottom: "10px" }}>Complete Your Payment</h2>

      <p>Hello <strong>{name}</strong>,</p>

      <p>
        Thank you for your order! Your order has been created but the payment
        has not been completed yet.
      </p>

      <p>Please complete your payment to process your order.</p>

      {/* Order summary */}
      <div
        style={{
          background: "#f8f8ff",
          padding: "16px",
          borderRadius: "6px",
          margin: "20px 0",
        }}
      >
        <p style={{ margin: "6px 0" }}>
          <strong>Order ID:</strong> {order_id}
        </p>

        <p style={{ margin: "6px 0" }}>
          <strong>Total Amount:</strong>{" "}
          <span style={{ color: "#6c47ff", fontWeight: "bold", fontSize: "16px" }}>
            {(total / 1000000).toFixed(2)} ETH
          </span>
        </p>
      </div>

      {/* Payment button */}
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href={link}
          style={{
            backgroundColor: "#6c47ff",
            color: "#ffffff",
            padding: "14px 32px",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            display: "inline-block",
            fontSize: "16px",
          }}
        >
          Pay Now
        </a>
      </div>

      {/* Backup link */}
      <p style={{ fontSize: "14px", color: "#555" }}>
        If the button does not work, you can copy and paste this link into your browser:
      </p>

      <p
        style={{
          wordBreak: "break-all",
          fontSize: "13px",
          background: "#f5f5f5",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        {link}
      </p>

      <hr style={{ margin: "30px 0", borderColor: "#eee" }} />

      {/* Footer */}
      <p style={{ fontSize: "12px", color: "#888" }}>
        ⚠️ This payment link may expire soon. Please complete your payment as soon as possible.
      </p>

      <p style={{ fontSize: "12px", color: "#888" }}>
        This is an automated message from <strong>Your Store</strong>. Please do not reply to this email.
      </p>
    </div>
  );
}