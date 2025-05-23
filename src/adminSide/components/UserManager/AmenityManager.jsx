import React, { useState, useEffect } from "react";
import { getAllAmenities, createAmenity, updateAmenity, deleteAmenity } from "../../../services/api/userAPI/amenityAPI";
import "../../../assets/Style/admin-css/amenityManager.css";  // Import CSS file

const AmenityManager = () => {
  const [amenities, setAmenities] = useState([]);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [editAmenityId, setEditAmenityId] = useState(null);
  const [editAmenityName, setEditAmenityName] = useState("");

  // Load all amenities
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const response = await getAllAmenities();
        setAmenities(response.data);
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };
    loadAmenities();
  }, []);

  // Create new amenity
  const handleCreateAmenity = async () => {
    try {
      const newAmenity = { name: newAmenityName };
      await createAmenity(newAmenity);
      setNewAmenityName(""); // Clear input
      const response = await getAllAmenities();
      setAmenities(response.data); // Reload amenities list
    } catch (error) {
      console.error("Error creating amenity:", error);
    }
  };

  // Edit amenity
  const handleEditAmenity = async (id) => {
    const amenity = amenities.find((a) => a.id === id);
    setEditAmenityId(id);
    setEditAmenityName(amenity.name);
  };

  const handleUpdateAmenity = async () => {
    try {
      const updatedAmenity = { name: editAmenityName };
      await updateAmenity(editAmenityId, updatedAmenity);
      setEditAmenityId(null); // Reset edit mode
      setEditAmenityName(""); // Clear input
      const response = await getAllAmenities();
      setAmenities(response.data); // Reload amenities list
    } catch (error) {
      console.error("Error updating amenity:", error);
    }
  };

  // Delete amenity
  const handleDeleteAmenity = async (id) => {
    try {
      await deleteAmenity(id);
      const response = await getAllAmenities();
      setAmenities(response.data); // Reload amenities list
    } catch (error) {
      console.error("Error deleting amenity:", error);
    }
  };

  return (
    <div className="amenity-manager">
      <h1>Quản lý Tiện Nghi</h1>

      {/* Create new amenity */}
      <div className="create-amenity">
        <input
          type="text"
          value={newAmenityName}
          onChange={(e) => setNewAmenityName(e.target.value)}
          placeholder="Tên tiện nghi"
        />
        <button onClick={handleCreateAmenity}>Thêm Tiện Nghi</button>
      </div>

      {/* Edit amenity */}
      {editAmenityId && (
        <div className="edit-amenity">
          <input
            type="text"
            value={editAmenityName}
            onChange={(e) => setEditAmenityName(e.target.value)}
            placeholder="Tên tiện nghi"
          />
          <button onClick={handleUpdateAmenity}>Cập Nhật</button>
          <button onClick={() => setEditAmenityId(null)}>Hủy</button>
        </div>
      )}

      {/* Amenity List */}
      <div className="amenity-list">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="amenity-item">
            <span>{amenity.name}</span>
            <button onClick={() => handleEditAmenity(amenity.id)}>Sửa</button>
            <button onClick={() => handleDeleteAmenity(amenity.id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenityManager;
