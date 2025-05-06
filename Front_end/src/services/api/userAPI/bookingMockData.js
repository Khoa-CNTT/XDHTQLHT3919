const mockBookingData = [
    {
      Id: "1",
      Status: "Đã xác nhận",
      Total: 500000,
      CreateAt: "2025-04-10T10:00:00Z",
      CheckInDate: "2025-04-15",
      CheckOutDate: "2025-04-20",
      BookingDetails: [
        { RoomName: "Phòng 101", Quantity: 2, Price: 200000 },
        { RoomName: "Phòng 102", Quantity: 1, Price: 300000 }
      ]
    },
    {
      Id: "2",
      Status: "Chưa xác nhận",
      Total: 300000,
      CreateAt: "2025-04-05T12:00:00Z",
      CheckInDate: "2025-04-12",
      CheckOutDate: "2025-04-18",
      BookingDetails: [
        { RoomName: "Phòng 201", Quantity: 1, Price: 300000 }
      ]
    }
  ];
  
  export default mockBookingData;