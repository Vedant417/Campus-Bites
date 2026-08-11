/**
 * Printer Service Abstraction
 * 
 * In production, this service can be extended to send raw ESC/POS commands
 * to a local printer bridge or cloud printer endpoint (e.g., PrintNode or a custom local listener).
 * For development/MVP testing, it prints a beautifully formatted text receipt to the server console.
 */
class PrinterService {
  /**
   * Mock printer implementation - logs a formatted receipt ticket to the console
   * @param {Object} order - The order document from MongoDB
   */
  async printOrderTicket(order) {
    try {
      const divider = '========================================';
      const thinDivider = '----------------------------------------';
      
      let ticket = '\n';
      ticket += `${divider}\n`;
      ticket += `            CAMPUS BITES RECEIPT        \n`;
      ticket += `            ${order.cafeId && order.cafeId.name ? order.cafeId.name.toUpperCase() : 'CAMPUS CAFE'}\n`;
      ticket += `${divider}\n`;
      ticket += `Order Number: #${order.orderNumber}\n`;
      ticket += `Order Type:   ${order.orderType}\n`;
      ticket += `Date/Time:    ${new Date(order.createdAt).toLocaleString()}\n`;
      ticket += `Student:      ${order.studentName}\n`;
      ticket += `Phone:        ${order.studentPhone}\n`;
      ticket += `Email:        ${order.studentEmail}\n`;
      ticket += `${thinDivider}\n`;
      ticket += ` Qty  Item Name                   Price \n`;
      ticket += `${thinDivider}\n`;

      order.items.forEach(item => {
        const qtyStr = String(item.quantity).padStart(3, ' ');
        // Limit item name to 24 characters for standard 58mm/80mm thermal printers
        const nameStr = item.name.substring(0, 24).padEnd(24, ' ');
        const priceStr = `₹${(item.price * item.quantity).toFixed(2)}`.padStart(9, ' ');
        ticket += `${qtyStr}  ${nameStr}${priceStr}\n`;
      });

      ticket += `${thinDivider}\n`;
      ticket += `Subtotal:                      ₹${order.subtotal.toFixed(2).padStart(8, ' ')}\n`;
      ticket += `Tax (5%):                      ₹${order.tax.toFixed(2).padStart(8, ' ')}\n`;
      ticket += `TOTAL:                         ₹${order.totalAmount.toFixed(2).padStart(8, ' ')}\n`;
      ticket += `${thinDivider}\n`;
      ticket += `Payment Status: PAID (${order.paymentStatus.toUpperCase()})\n`;
      ticket += `Thank you for ordering at Campus Bites!\n`;
      ticket += `Please present this order number to collect food.\n`;
      ticket += `${divider}\n`;

      console.log('--- PRINTING THERMAL TICKET TO PHYSICAL PRINTER MOCK ---');
      console.log(ticket);
      console.log('------------------ END OF TICKET -----------------------\n');
      
      return { success: true, ticket };
    } catch (error) {
      console.error('Failed to print order ticket:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PrinterService();
