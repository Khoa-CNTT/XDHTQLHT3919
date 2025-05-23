import React, { useState, useEffect } from 'react';
import {
    getAllServices,
    addService,
    updateService,
    deleteService
} from '../../../services/api/userAPI/serviceAPI';
import '../../../assets/Style/admin-css/serviceManager.css';
import Notification from '../../../userSide/components/Other/Notification';

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ serviceName: '', description: '', price: 0 });
    const [editingService, setEditingService] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getAllServices();
                setServices(data);
            } catch (err) {
                console.error('Lỗi khi tải dịch vụ:', err);
                setError('Không thể tải danh sách dịch vụ.');
            }
        };
        fetchServices();
    }, []);

    const handleAddService = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const addedService = await addService(newService);
            setServices(prev => [...prev, addedService]);
            setNewService({ serviceName: '', description: '', price: 0 });
            setMessage('Thêm dịch vụ thành công.');
        } catch (err) {
            console.error(err);
            setError('Thêm dịch vụ thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditService = async () => {
        if (isSubmitting || !editingService) return;
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const updatedService = await updateService(editingService.id, editingService);
            const updatedList = services.map(service =>
                service.id === updatedService.id ? updatedService : service
            );
            setServices(updatedList);
            setEditingService(null);
            setMessage('Cập nhật dịch vụ thành công.');
        } catch (err) {
            console.error(err);
            setError('Cập nhật dịch vụ thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            await deleteService(id);
            setServices(prev => prev.filter(service => service.id !== id));
            setMessage('Xóa dịch vụ thành công.');
        } catch (err) {
            console.error(err);
            setError('Xóa dịch vụ thất bại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="service-manager-container">
            <h2>Quản Lý Dịch Vụ</h2>

            <Notification message={message} show={!!message} onClose={() => setMessage(null)} />
            <Notification message={error} show={!!error} onClose={() => setError(null)} />

            <div className="card form-card">
                <h3>{editingService ? 'Chỉnh sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h3>
                <input
                    type="text"
                    placeholder="Tên dịch vụ"
                    value={editingService ? editingService.serviceName : newService.serviceName}
                    onChange={(e) => {
                        const value = e.target.value;
                        editingService
                            ? setEditingService({ ...editingService, serviceName: value })
                            : setNewService({ ...newService, serviceName: value });
                    }}
                />
                <textarea
                    placeholder="Mô tả"
                    value={editingService ? editingService.description : newService.description}
                    onChange={(e) => {
                        const value = e.target.value;
                        editingService
                            ? setEditingService({ ...editingService, description: value })
                            : setNewService({ ...newService, description: value });
                    }}
                />
                <input
                    type="number"
                    placeholder="Giá"
                    value={editingService ? editingService.price : newService.price}
                    onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        editingService
                            ? setEditingService({ ...editingService, price: value })
                            : setNewService({ ...newService, price: value });
                    }}
                />
                {editingService ? (
                    <div className="form-buttons">
                        <button onClick={handleEditService} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật Dịch Vụ'}
                        </button>
                        <button onClick={() => setEditingService(null)} disabled={isSubmitting}>
                            Hủy
                        </button>
                    </div>

                ) : (
                    <button onClick={handleAddService} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang thêm...' : 'Thêm Dịch Vụ'}
                    </button>
                )}
            </div>

            <div className="service-list-section">
                <h3>Danh Sách Dịch Vụ</h3>
                <div className="service-grid">
                    {services.length > 0 ? (
                        services.map(service => (
                            <div key={service.id} className="card service-card">
                                <h4>{service.serviceName}</h4>
                                <p>{service.description}</p>
                                <p><strong>Giá:</strong> {service.price.toLocaleString()} VND</p>
                                <div className="card-actions">
                                    <button className="edit-btn" onClick={() => setEditingService(service)}>Sửa</button>
                                    <button className="delete-btn" onClick={() => handleDeleteService(service.id)}>Xóa</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có dịch vụ nào để hiển thị.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceManager;
