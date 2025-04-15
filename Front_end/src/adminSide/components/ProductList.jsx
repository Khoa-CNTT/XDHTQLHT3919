import React, { useEffect, useState } from 'react';
import {getProducts, addOrUpdateProduct, deleteProduct} from '../../api/adminAPI/productApi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    imageInput: '',
    price: '',
    quantity: 0,
    status: 'Còn phòng'
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.imageInput) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const imageArray = form.imageInput.split(',').map(img => img.trim()).filter(Boolean);

    const newProduct = {
      ...form,
      images: imageArray,
      price: +form.price,
      quantity: +form.quantity
    };

    const updated = await addOrUpdateProduct(newProduct);
    const data = await getProducts();
    setProducts(data);
    setForm({ id: null, name: '', imageInput: '', price: '', quantity: 0, status: 'Còn phòng' });
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      imageInput: product.images.join(', ')
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa phòng này?')) {
      await deleteProduct(id);
      const data = await getProducts();
      setProducts(data);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (type) => {
    setForm(prev => ({
      ...prev,
      quantity: type === 'inc' ? prev.quantity + 1 : Math.max(0, prev.quantity - 1)
    }));
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Danh sách phòng</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Nhập phòng bạn muốn tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
          <button className="add-btn" onClick={handleAdd}>THÊM PHÒNG</button>
        </div>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Tên phòng"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Giá phòng"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <div className="quantity-control">
          <button onClick={() => handleQuantityChange('dec')}>-</button>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
            min="0"
          />
          <button onClick={() => handleQuantityChange('inc')}>+</button>
        </div>

        <input
          type="text"
          placeholder="URL các ảnh (cách nhau bởi dấu phẩy)"
          value={form.imageInput}
          onChange={(e) => setForm({ ...form, imageInput: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Còn phòng">Còn phòng</option>
          <option value="Hết phòng">Hết phòng</option>
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên phòng</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>
                {product.images.map((img, idx) => (
                  <img key={idx} src={img} alt="ảnh" style={{ width: 40, marginRight: 5 }} />
                ))}
              </td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()} đ</td>
              <td>{product.quantity}</td>
              <td>{product.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(product)}>CHỈNH SỬA</button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>XÓA</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
