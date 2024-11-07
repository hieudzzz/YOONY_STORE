const Varriant = () => {
    return (
        <div className="max-w-md mx-auto bg-white p-6 mt-24 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Thêm Biến Thể</h2>
            <form action="#">
                {/* Tên biến thể */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Tên biến thể
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên biến thể"
                    />
                </div>
                {/* Slug */}
                <div className="mb-4">
                    <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">
                        Slug
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập slug"
                    />
                </div>
                {/* Loại (Select Option) */}
                <div className="mb-6">
                    <label
                        htmlFor="category"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Loại
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        
                        <option value="type1">Color</option>
                        <option value="type2">Button</option>
                        <option value="type3">Radio</option>
                    </select>
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-2/5 bg-primary text-white py-2 rounded-md hover:bg-primary transition-all"
                >
                    Thêm biến thể
                </button>
            </form>
        </div>


    )
}
export default Varriant