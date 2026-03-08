import jsPDF from "jspdf";
import { Download } from "lucide-react";

const ReceiptInvoice = ({ order }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [58, 200], // Thermal paper roll
    });

    let y = 5;

    // --- Logo ---
    const logoUrl =
      "https://res.cloudinary.com/dvxaztwnz/image/upload/v1754728677/jewelora_rlc5cq.jpg";
    doc.addImage(logoUrl, "JPEG", 14, y, 30, 10);
    y += 12;

    // --- Brand Name ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("JEWELORA", 29, y, { align: "center" });
    y += 4;

    // --- Website ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("www.jewelora.in", 29, y, { align: "center" });
    y += 4;

    doc.text("================================", 29, y, { align: "center" });
    y += 4;

    // --- Order Info ---
    doc.setFontSize(8);
    const orderId = doc.splitTextToSize(`Order ID: ${order.id}`, 54);
    doc.text(orderId, 2, y);
    y += orderId.length * 4;

    doc.text(`Date: ${new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}`, 2, y);
    y += 4;

    doc.text(`Status: ${order.status}`, 2, y);
    y += 4;

    // --- Customer Info ---
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details:", 2, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    const name = doc.splitTextToSize(
      `${order.shippingInfo?.fullName || "-"}`, 54
    );
    doc.text(`Name: ${name}`, 2, y);
    y += name.length * 4;

    doc.text(`Phone: ${order.shippingInfo?.phone || "-"}`, 2, y);
    y += 4;

    const address = `${order.shippingInfo?.address || ""}, ${order.shippingInfo?.city || ""}, ${order.shippingInfo?.state || ""}`;
    const addressLines = doc.splitTextToSize(`Addr: ${address}`, 54);
    doc.text(addressLines, 2, y);
    y += addressLines.length * 4;

    doc.text(`Pincode: ${order.shippingInfo?.pincode || "-"}`, 2, y);
    y += 4;

    doc.text(`Payment: ${order.shippingInfo?.paymentMethod || "-"}`, 2, y);
    y += 4;

    doc.text("--------------------------------", 29, y, { align: "center" });
    y += 4;

    // --- Table Header ---
    doc.setFont("helvetica", "bold");
    doc.text("Item", 2, y);
    doc.text("Amt", 54, y, { align: "right" });
    y += 4;

    // --- Items ---
    doc.setFont("helvetica", "normal");
    order.items.forEach((item) => {
      const itemName = doc.splitTextToSize(`${item.name} x${item.quantity}`, 44);
      doc.text(itemName, 2, y);
      doc.text(`₹${item.price}`, 54, y, { align: "right" });
      y += itemName.length * 4;
    });

    // --- Shipping ---
    doc.text(`Shipping`, 2, y);
    doc.text(`₹${order.shippingCharge || 0}`, 54, y, { align: "right" });
    y += 4;

    // --- Total ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`TOTAL`, 2, y);
    doc.text(`₹${order.total}`, 54, y, { align: "right" });
    y += 6;

    // --- Footer ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("================================", 29, y, { align: "center" });
    y += 4;
    doc.text("Thank you for shopping!", 29, y, { align: "center" });
    y += 4;
    doc.text("No returns without receipt", 29, y, { align: "center" });

    // Save File
    doc.save(`Receipt_${order.id}.pdf`);
  };

  return (
    <button
      type="button"
      onClick={generatePDF}
      className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
    >
      <Download size={16} />
      Download Receipt
    </button>
  );
};

export default ReceiptInvoice;
