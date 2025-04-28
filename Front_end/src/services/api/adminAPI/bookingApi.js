// src/services/api/adminAPI/bookingApi.js

// Fake data BookingDetail
let fakeBookingDetails = [
    {
      id: '1',
      roomName: "Phòng Deluxe",
      checkInDate: "2025-05-01T12:00:00Z",
      checkOutDate: "2025-05-03T12:00:00Z",
      note: "Khách yêu cầu thêm gối",
      totalPrice: 2400000,
      status: "chưa xác nhận",
    },
    {
      id: '2',
      roomName: "Phòng Standard",
      checkInDate: "2025-05-02T12:00:00Z",
      checkOutDate: "2025-05-05T12:00:00Z",
      note: "Không hút thuốc",
      totalPrice: 3200000,
      status: "đang xác nhận",
    },
    {
      id: '3',
      roomName: "Phòng VIP",
      checkInDate: "2025-05-10T12:00:00Z",
      checkOutDate: "2025-05-12T12:00:00Z",
      note: "",
      totalPrice: 5000000,
      status: "đã xác nhận",
    },
    {
      id: '4',
      roomName: "Phòng Family",
      checkInDate: "2025-05-15T12:00:00Z",
      checkOutDate: "2025-05-20T12:00:00Z",
      note: "Mang theo trẻ nhỏ",
      totalPrice: 9000000,
      status: "chưa xác nhận",
    }
  ];
  
  export const bookingApi = {
    async getAllBookingDetails() {
      console.log(`🔵 [Mock API] Fetch all booking details`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 200,
            data: fakeBookingDetails
          });
        }, 500); // giả lập delay 500ms
      });
    },
  
    async deleteBookingDetail(id) {
      console.log(`🗑️ [Mock API] Delete booking detail ID: ${id}`);
      fakeBookingDetails = fakeBookingDetails.filter(item => item.id !== id);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 200,
            message: "Xóa thành công"
          });
        }, 300);
      });
    },
  
    async updateBookingStatus(id, newStatus) {
      console.log(`🔄 [Mock API] Update booking detail ID: ${id} to Status: ${newStatus}`);
      fakeBookingDetails = fakeBookingDetails.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 200,
            message: "Cập nhật trạng thái thành công"
          });
        }, 300);
      });
    },
  
    async updateBookingNote(id, newNote) {
      console.log(`📝 [Mock API] Update booking detail ID: ${id} Note: ${newNote}`);
      fakeBookingDetails = fakeBookingDetails.map(item => 
        item.id === id ? { ...item, note: newNote } : item
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 200,
            message: "Cập nhật ghi chú thành công"
          });
        }, 300);
      });
    }
  };
  