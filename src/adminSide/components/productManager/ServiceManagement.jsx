import React, { useState, useEffect } from 'react';
import { getAllServices, addService, updateService, deleteService } from '../../../services/api/userAPI/serviceAPI';
import '../../../assets/Style/admin-css/serviceManager.css';

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
            const updatedList = services.map(service => service.id === updatedService.id ? updatedService : service);
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
            <h2>Quản lý Dịch Vụ</h2>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="add-service-form">
                <h3>Thêm Dịch Vụ Mới</h3>
                <input
                    type="text"
                    value={newService.serviceName}
                    onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                    placeholder="Tên dịch vụ"
                />
                <input
                    type="text"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Mô tả"
                />
                <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                    placeholder="Giá"
                />
                <button onClick={handleAddService} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang thêm...' : 'Thêm Dịch Vụ'}
                </button>
            </div>

            {editingService && (
                <div className="edit-service-form">
                    <h3>Sửa Dịch Vụ</h3>
                    <input
                        type="text"
                        value={editingService.serviceName}
                        onChange={(e) => setEditingService({ ...editingService, serviceName: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    />
                    <input
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                    />
                    <button onClick={handleEditService} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật'}
                    </button>
                </div>
            )}

            <div>
                <h3>Danh Sách Dịch Vụ</h3>
                <ul className="service-list">
                    {services.length > 0 ? (
                        services.map(service => (
                            <li key={service.id}>
                                <h4>{service.serviceName}</h4>
                                <p>{service.description}</p>
                                <p>Giá: {service.price}</p>
                                <button onClick={() => setEditingService(service)}>Sửa</button>
                                <button onClick={() => handleDeleteService(service.id)}>Xóa</button>
                            </li>
                        ))
                    ) : (
                        <p>Không có dịch vụ nào để hiển thị.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ServiceManager;