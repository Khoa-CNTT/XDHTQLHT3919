let mockProducts = [
    {
      id: 1,
      name: 'Thực phẩm bảo vệ sức khỏe Boni Sleep',
      images: ['https://via.placeholder.com/50', 'https://via.placeholder.com/40'],
      price: 405000,
      quantity: 301,
      status: 'Còn phòng',
    },
    {
      id: 2,
      name: 'Sữa rửa mặt Acne-Aid',
      images: ['https://via.placeholder.com/50'],
      price: 175000,
      quantity: 301,
      status: 'Còn phòng',
    }
  ];
  
  export const getProducts = async () => {
    return mockProducts;
  };
  
  export const addOrUpdateProduct = async (product) => {
    if (product.id) {
      mockProducts = mockProducts.map(p => (p.id === product.id ? product : p));
    } else {
      product.id = Date.now();
      mockProducts.push(product);
    }
    return product;
  };
  
  export const deleteProduct = async (id) => {
    mockProducts = mockProducts.filter(p => p.id !== id);
    return true;
  };