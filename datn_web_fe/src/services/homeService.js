import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Hàm xử lý encoding cho tên danh mục
const fixEncoding = (text) => {
  if (!text) return text;

  // Map các ký tự bị lỗi encoding
  const encodingMap = {
    Ão: "Áo",
    "Quáº§n": "Quần",
    "VÃ¡y": "Váy",
    "GiÃy dÃ©p": "Giày dép",
    "Phá»¥ kiá»n": "Phụ kiện",
    "Ão thun": "Áo thun",
    "Ão polo": "Áo polo",
    "Ão sÆ¡mi": "Áo sơmi",
    "Ão khoÃ¡c": "Áo khoác",
  };

  let fixedText = text;
  Object.keys(encodingMap).forEach((bad) => {
    fixedText = fixedText.replace(new RegExp(bad, "g"), encodingMap[bad]);
  });

  return fixedText;
};

// Lấy danh sách banner
export const getBanners = async () => {
  try {
    const response = await axios.get(`${API_URL}/customer/banner`);
    // Backend trả về {success: true, data: [...], total: ...}
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Fallback data với ảnh thể thao 4K
    return [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=100",
        slogan: "THỜI TRANG THỂ THAO NAM",
        desc: "BST mới nhất, phong cách thể thao năng động",
        cta: "Mua ngay",
        link: "/products",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=100",
        slogan: "SALE UP TO 50%",
        desc: "Ưu đãi cực lớn cho đồ thể thao",
        cta: "Xem ưu đãi",
        link: "/products",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=100",
        slogan: "GIÀY THỂ THAO CAO CẤP",
        desc: "Sneaker, running, training...",
        cta: "Khám phá ngay",
        link: "/products",
      },
    ];
  }
};

// Lấy danh sách danh mục - Sử dụng API customer mới
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/customer/categories`);
    // Backend trả về {success: true, data: [...], total: ...}
    const categories = response.data.success
      ? response.data.data
      : response.data;
    // Fix encoding cho tên danh mục
    const fixedCategories = categories.map((category) => ({
      ...category,
      name: fixEncoding(category.name),
    }));
    return fixedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback data
    return [
      { id: 1, name: "Áo thun", icon: "👕", count: 45 },
      { id: 2, name: "Áo polo", icon: "🏷️", count: 32 },
      { id: 3, name: "Áo sơmi", icon: "👔", count: 28 },
      { id: 4, name: "Quần", icon: "👖", count: 38 },
      { id: 5, name: "Áo khoác", icon: "🧥", count: 25 },
      { id: 6, name: "Phụ kiện", icon: "👜", count: 52 },
    ];
  }
};

// Lấy sản phẩm theo danh mục - Sử dụng API customer mới
export const getProductsByCategory = async (categoryName) => {
  try {
    const response = await axios.get(
      `${API_URL}/customer/products/category/${encodeURIComponent(
        categoryName
      )}`
    );
    // Backend trả về {success: true, data: [...], total: ...}
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Lấy sản phẩm nổi bật - Sử dụng API customer mới
export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/customer/products/featured`);
    // Backend trả về {success: true, data: [...], total: ...}
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    // Fallback data
    return [
      {
        id: 1,
        name: "Áo Thun Basic Local Brand Unisex ZMEN",
        price: 210000,
        oldPrice: 350000,
        image: "https://product.hstatic.net/200000690725/product/ts324-1.jpg",
        colors: ["#222", "#f8f8f8", "#bfa16c"],
        rating: 4.8,
        sold: 1250,
        discount: 40,
      },
      {
        id: 2,
        name: "Áo Khoác Len Local Brand Unisex ZMEN",
        price: 299000,
        oldPrice: 600000,
        image: "https://product.hstatic.net/200000690725/product/ak125-1.jpg",
        colors: ["#f8f8f8", "#222"],
        rating: 4.9,
        sold: 280,
        discount: 50,
      },
    ];
  }
};

// Lấy thống kê - Sử dụng API customer mới
export const getStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/customer/statistics`);
    // Backend trả về {success: true, data: {...}}
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Fallback data
    return {
      customers: 15000,
      products: 200,
      orders: 5000,
      satisfaction: 98,
    };
  }
};

// Lấy tất cả sản phẩm cho trang products - Sử dụng API customer mới
export const getAllProducts = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/customer/products`, {
      params,
    });
    // Backend trả về {success: true, data: [...], total: ...}
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

// Tìm kiếm sản phẩm - Sử dụng API customer mới
export const searchProducts = async (searchTerm) => {
  try {
    // Sử dụng API search chuyên dụng
    const response = await axios.get(`${API_URL}/customer/products/search`, {
      params: { keyword: searchTerm },
    });

    const searchData = response.data.success
      ? response.data.data
      : response.data;

    // Gộp sản phẩm theo ID sản phẩm chính
    const productMap = new Map();

    searchData.forEach((product) => {
      const productId = product.idSanPham || product.id;

      if (!productMap.has(productId)) {
        // Tạo sản phẩm mới
        const mainProduct = {
          id: productId,
          maSanPham: product.maSanPham,
          name: product.name || product.tenSanPham,
          category: product.category || product.tenDanhMuc,
          image: product.image || product.hinhAnh?.[0],
          price: product.price || product.gia,
          oldPrice: product.oldPrice || product.giaCu,
          rating: product.rating || 4.5,
          sold: product.sold || product.daBan || 0,
          description: product.description,
          variants: [],
          colors: [],
          sizes: [],
          minPrice: null,
          maxPrice: null,
          totalStock: 0,
          totalSold: 0,
        };
        productMap.set(productId, mainProduct);
      }

      const mainProduct = productMap.get(productId);

      // Thêm variant
      const variant = {
        id: product.id,
        color: product.tenMauSac,
        size: product.tenKichCo,
        price: product.price || product.gia,
        oldPrice: product.oldPrice || product.giaCu,
        stock: product.quantity || product.soLuong || 0,
        sold: product.sold || product.daBan || 0,
        image: product.image || product.hinhAnh?.[0],
      };

      mainProduct.variants.push(variant);

      // Thêm màu sắc và kích thước duy nhất
      if (variant.color && !mainProduct.colors.includes(variant.color)) {
        mainProduct.colors.push(variant.color);
      }
      if (variant.size && !mainProduct.sizes.includes(variant.size)) {
        mainProduct.sizes.push(variant.size);
      }
    });

    // Tính toán giá min/max và tổng stock/sold
    const processedProducts = Array.from(productMap.values()).map((product) => {
      const prices = product.variants.map((v) => v.price).filter(Boolean);
      const stocks = product.variants.map((v) => v.stock).filter(Boolean);
      const solds = product.variants.map((v) => v.sold).filter(Boolean);

      product.minPrice =
        prices.length > 0 ? Math.min(...prices) : product.price;
      product.maxPrice =
        prices.length > 0 ? Math.max(...prices) : product.price;
      product.totalStock = stocks.reduce((sum, stock) => sum + stock, 0);
      product.totalSold = solds.reduce((sum, sold) => sum + sold, 0);

      return product;
    });

    return processedProducts;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
