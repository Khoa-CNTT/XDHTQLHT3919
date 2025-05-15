-- Roles
INSERT INTO Roles (Id, Name, CreateAt)
VALUES 
(NEWID(), N'Admin', GETDATE()),
(NEWID(), N'Member', GETDATE());
GO
-- Users
INSERT INTO [Users] (Id, Email, Name, Password, Address, Phone, PathImg, IdRole, CreateAt)
VALUES 
(NEWID(), N'user1@gmail.com', N'User1', 
    CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', '123456'), 2), 
    N'123 Main St', N'0123456789', NULL,
    (SELECT TOP 1 Id FROM Roles WHERE Name = N'Member'), GETDATE()),
(NEWID(), N'user2@gmail.com', N'User2', 
    CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', '123456'), 2), 
    N'456 Admin Rd', N'0987654321', NULL,
    (SELECT TOP 1 Id FROM Roles WHERE Name = N'Member'), GETDATE()),

(NEWID(), N'admin@gmail.com', N'Admin', 
    CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', '123456'), 2), 
    N'456 Member Rd', N'0901212311', NULL,
    (SELECT TOP 1 Id FROM Roles WHERE Name = N'Admin'), GETDATE());
GO
-- Categories
INSERT INTO Categories (Id, Name, CreateAt)
VALUES 
(NEWID(), N'Phòng đơn', GETDATE()),
(NEWID(), N'Phòng đôi', GETDATE());
GO
-- Rooms
INSERT INTO Rooms (Id, Name, Detail, Note, Price, Status, CreateAt, IdUser, PathImg, IdCategory)
VALUES 
(NEWID(), N'Phòng 101', N'Phòng đơn đẹp', N'Gần cửa sổ', 300000, N'Còn trống', GETDATE(), NULL, NULL,
    (SELECT TOP 1 Id FROM Categories WHERE Name = N'Phòng đơn')),

(NEWID(), N'Phòng 102', N'Phòng đôi tiện nghi', N'Có ban công', 500000, N'Đã đặt', GETDATE(), NULL, NULL,
    (SELECT TOP 1 Id FROM Categories WHERE Name = N'Phòng đôi'));
GO
-- Services
INSERT INTO Services (Id, ServiceName, Description, Price)
VALUES 
(NEWID(), N'Giặt ủi', N'Dịch vụ giặt ủi chuyên nghiệp', 50000),
(NEWID(), N'Bữa sáng', N'Phục vụ bữa sáng tại phòng', 70000);
GO
-- Bookings
INSERT INTO Bookings (IdBooking, Status, Total, CreateAt, IdUser)
VALUES 
(NEWID(), N'chưa xác nhận', 800000, GETDATE(), NULL);
GO
-- BookingDetails
INSERT INTO BookingDetails (Id, CheckInDate, CheckOutDate, TotalPrice, IdBooking, IdRoom, CreateAt)
VALUES 
(NEWID(), '2025-04-27', '2025-04-29', 400000, NULL, NULL, GETDATE());
GO
-- Reviews
INSERT INTO Reviews (Id, Comment, CreateAt, IdUser)
VALUES 
(NEWID(), N'Phòng sạch sẽ và yên tĩnh.', GETDATE(), NULL);
GO
-- Thêm dữ liệu mẫu vào bảng Images
INSERT INTO Images (Src, Alt, CreatedAt)
VALUES
(N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMxQMfXg6x_m7plPEVVCUITPBoFcxMm6LbtA&s', N'Phòng ngủ hiện đại', GETDATE()),
(N'https://noithatkendesign.vn/storage/app/media/1%20b%C3%ACa/review-5-mau-thiet-ke-homestay-dep-tai-phu-yen-1.jpg', N'Cảnh biển từ ban công', GETDATE()),
(N'https://www.coolhome.com.vn/wp-content/uploads/2024/06/mo-hinh-nha-nghi-homestay.jpg', N'Mặt tiền homestay', GETDATE())
GO
-- Thêm dữ liệu mẫu vào bảng Amenities
INSERT INTO Amenities (Id, Name, Description)
VALUES
(NEWID(), N'Wifi', N'Kết nối internet không dây tốc độ cao'),
(NEWID(), N'Máy lạnh', N'Máy điều hòa không khí cho phòng'),
(NEWID(), N'TV', N'Tivi hiện đại, hỗ trợ kết nối HDMI và Netflix'),
(NEWID(), N'Tủ lạnh', N'Tủ lạnh nhỏ để bảo quản đồ uống và thực phẩm');
GO