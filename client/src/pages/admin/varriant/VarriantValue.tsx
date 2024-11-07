const VarriantValue = () => {
    return (
        <div className="max-w-md mx-auto bg-white p-8 mt-24 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Giá Trị Biến Thể</h2>
            <form action="#">
                {/* Loại (Select Option) */}
                <div className="mb-6">
                    <label
                        htmlFor="category"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Chọn biến thể
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn loại</option>
                        <option value="type1">Loại 1</option>
                        <option value="type2">Loại 2</option>
                        <option value="type3">Loại 3</option>
                    </select>
                </div>
                {/* Submit Button */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Giá trị
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD:Đỏ,vàng,...."
                    />
                </div>
                <button
                    type="submit"
                    className="w-1/3 bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition-all"
                >
                    Thêm giá trị
                </button>
            </form>
        </div>
    )
}
export default VarriantValue