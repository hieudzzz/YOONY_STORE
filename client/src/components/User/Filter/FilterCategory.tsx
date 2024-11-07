import React, { useEffect, useState } from "react";
import axios from 'axios';
import CardProductAll from "../Products/CardProductAll";
import instance from "../../../instance/instance"; // Sử dụng instance Axios của bạn

// Định nghĩa kiểu dữ liệu cho sản phẩm
type Product = {
  id_Product: number;
  imageProduct: string;
  nameProduct: string;
  colorVariantsImages: { representativeImage: string }[];
  variants: { price: number; sale_price?: number }[];
  is_featured: boolean;
  is_good_deal: boolean;
  category: string;
};

const ProductFilters = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [loading, setLoading] = useState(true); // State để theo dõi quá trình tải
  const [error, setError] = useState<string | null>(null); // State để lưu lỗi

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await instance.get('products/filter'); 
        console.log("Dữ liệu sản phẩm:", response.data); // Ghi log dữ liệu trả về

        // Kiểm tra xem dữ liệu có đúng dạng không
        if (Array.isArray(response.data)) {
          setProducts(response.data); // Cập nhật state với dữ liệu sản phẩm
        } else {
          throw new Error("Dữ liệu không đúng định dạng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setError("Không thể lấy dữ liệu sản phẩm. Vui lòng thử lại."); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Đặt loading thành false khi hoàn thành
      }
    };

    fetchProducts();
  }, []); // Chạy một lần khi component được mount

  // Hàm xử lý sự thay đổi trong chọn lọc
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (keyword === selectedColor) setSelectedColor(null);
    if (keyword === selectedSize) setSelectedSize(null);
    if (keyword === `${priceRange[0]} - ${priceRange[1]}`) setPriceRange([0, 100]);
    setSelectedCategory((prev) => prev.filter((item) => item !== keyword));
  };

  const filteredProducts = products.filter(product => {
    const isInCategory = selectedCategory.length === 0 || selectedCategory.includes(product.category);
    const isInColor = selectedColor === null || product.colorVariantsImages.some(color => color.representativeImage === selectedColor);
    const isInSize = selectedSize === null; // Giả sử tất cả sản phẩm đều có kích thước
    const isInPriceRange = product.variants.some(variant => 
      variant.sale_price ? (variant.sale_price >= priceRange[0] && variant.sale_price <= priceRange[1]) 
                         : (variant.price >= priceRange[0] && variant.price <= priceRange[1])
    );

    return (selectedCategory.length === 0 && selectedColor === null && selectedSize === null && priceRange[1] === 100) 
      || (isInCategory && isInColor && isInSize && isInPriceRange);
  });

  // Render
  return (
    <div className="product-filters-wrapper flex">
      <aside className="filter-sidebar w-1/4 p-4 bg-gray-100 border-r border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>

        {(selectedColor || selectedSize || selectedCategory.length > 0 || priceRange[1] < 100) && (
          <div className="filter-option mb-4">
            <h4 className="font-semibold mb-2">Từ khóa</h4>
            <div className="flex gap-2 flex-wrap">
              {selectedColor && (
                <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {selectedColor} 
                  <button className="ml-2" onClick={() => handleRemoveKeyword(selectedColor)}> x</button>
                </span>
              )}
              {selectedSize && (
                <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {selectedSize} 
                  <button className="ml-2" onClick={() => handleRemoveKeyword(selectedSize)}> x</button>
                </span>
              )}
              {selectedCategory.map((category) => (
                <span key={category} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {category} 
                  <button className="ml-2" onClick={() => handleRemoveKeyword(category)}> x</button>
                </span>
              ))}
              {priceRange[1] < 100 && (
                <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  Giá: {priceRange[0]} - {priceRange[1]}
                  <button className="ml-2" onClick={() => handleRemoveKeyword(`${priceRange[0]} - ${priceRange[1]}`)}> x</button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="filter-option mb-4">
          <h4 className="font-semibold mb-2">Danh mục</h4>
          <ul>
            {["Label", "Description", "Label2"].map((category) => (
              <li key={category}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategory.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="filter-option mb-4">
          <h4 className="font-semibold mb-2">Màu sắc</h4>
          <div className="flex gap-2">
            {["#f00", "#00f", "#0f0"].map((color) => (
              <span
                key={color}
                className={`w-6 h-6 rounded-full cursor-pointer border ${selectedColor === color ? 'border-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
              ></span>
            ))}
          </div>
        </div>

        <div className="filter-option mb-4">
          <h4 className="font-semibold mb-2">Kích thước</h4>
          <ul>
            {["S", "M", "L"].map((size) => (
              <li key={size}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === size}
                    onChange={() => setSelectedSize(size === selectedSize ? null : size)}
                    className="mr-2"
                  />
                  {size}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="filter-option mb-4">
          <h4 className="font-semibold mb-2">Khoảng giá</h4>
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, +e.target.value])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </aside>

      <main className="product-display flex-1 p-4">
        {loading ? ( // Kiểm tra trạng thái loading
          <div className="text-center">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : error ? ( // Kiểm tra xem có lỗi không
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="sorting-bar flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white" onClick={() => setSortOption("asc")}>Giá: Thấp đến Cao</button>
                <button className="px-3 py-1 bg-blue-500 text-white" onClick={() => setSortOption("desc")}>Giá: Cao đến Thấp</button>
              </div>
              <select value={sortOption} onChange={handleSortChange} className="border p-1">
                <option value="default">Sắp xếp theo</option>
                <option value="asc">Giá: Thấp đến Cao</option>
                <option value="desc">Giá: Cao đến Thấp</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <CardProductAll key={product.id_Product} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductFilters;
