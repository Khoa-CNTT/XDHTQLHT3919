INSERT INTO Roles (Id, Name, CreateAt)
VALUES 
(NEWID(), 'Admin', GETDATE()),
(NEWID(), 'Member', GETDATE());
GO
INSERT INTO Users (Id, Email, Name, Password, Address, Phone, Image, IdRole, CreateAt)
VALUES 
(NEWID(), 'admin@homestay.com', 'Admin', '123456', 'Đà Nẵng', '0123456789', 'default.jpg', 'B595CC92-21DB-4AF4-9717-39EA54385D7E', GETDATE()),
(NEWID(), 'member1@homestay.com', 'Member One', '123456', 'Hội An', '0987654321', 'default.jpg', '489FA899-3ED6-4527-85FE-B27F1E338131', GETDATE());
Go

