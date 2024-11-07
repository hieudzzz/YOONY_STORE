import React from 'react';

// Định nghĩa kiểu dữ liệu cho props
type FilterCategoryProps = {
  data: {
    categories: string[]; // Mảng các danh mục
    attributes: string[]; // Mảng các thuộc tính
  };
};

const FilterCategory: React.FC<FilterCategoryProps> = ({ data }) => {
  const { categories, attributes } = data; // Destructure để lấy mảng

  return (
    <div>
      <h2>Danh Mục</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>

      <h2>Thuộc Tính</h2>
      <ul>
        {attributes.map((attribute, index) => (
          <li key={index}>{attribute}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilterCategory;
