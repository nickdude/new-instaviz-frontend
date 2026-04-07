// Utility to export JSON data to Excel using SheetJS
export function exportOrdersToExcel(orders, fileName = 'orders.xlsx') {
  // Only run on client
  if (typeof window === 'undefined') {
    console.warn('Excel export can only run on the client side.');
    return;
  }
  import('xlsx')
    .then(XLSX => {
      const worksheetData = orders.map(order => ({
        'Order ID': order._id,
        'User Name': order.userId?.name,
        'User Email': order.userId?.email,
        'Plan': order.planId?.title,
        'Card Type': order.cardType,
        'Quantity': order.orderDetails?.quantity,
        'Amount': order.orderDetails?.totalAmount,
        'Status': order.status,
        'Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      XLSX.writeFile(workbook, fileName);
    })
    .catch(err => {
      alert('Failed to load Excel export library. Please try again.');
      console.error('xlsx dynamic import failed:', err);
    });
}
