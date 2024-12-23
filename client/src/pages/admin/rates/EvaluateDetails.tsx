// import { useParams } from "react-router-dom"
// import RatingProduct from "../../../components/User/Show/RatingProduct"
// import { useEffect, useState } from "react";
// import instance from "../../../instance/instance";
// import { Irates } from "../../../interfaces/IRates";

// const RatingProductAdmin = () => {
//     const { slug } = useParams();
//     const [rates, setRates] = useState<Irates[]>([]);

//     useEffect(() => {
//         // Giả sử bạn có một API để lấy thông tin sản phẩm
//         const fetchProduct = async () => {
//             try {
//                 const response = await instance.get(`ratings`);
//                 setRates(response.data); // Lưu tên sản phẩm vào state
//             } catch (error) {
//                 console.error("Failed to fetch product:", error);
//             }
//         };

//         fetchProduct();
//     }, []);
//     return (
//         <>
//             <div className="w-full bg-white p-4 mb-4">
//                 {rates.map((value, index) => {
//                     return (
//                         <p className="text-lg font-bold" key={index}>
//                             SẢN PHẨM : {value.product}
//                         </p>
//                     )
//                 })}


//             </div>
//             <div>
//                 <RatingProduct slugProd={slug} />
//             </div>
//         </>

//     )
// }
// export default RatingProductAdmin  
import { useParams } from "react-router-dom";
import RatingProduct from "../../../components/User/Show/RatingProduct";
import { useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { Irates } from "../../../interfaces/IRates";

const RatingProductAdmin = () => {
    const { slug } = useParams();
    const [rates, setRates] = useState<Irates[]>([]);
    const [productName, setProductName] = useState<string>("");

    useEffect(() => {
        // Lấy thông tin sản phẩm từ API
        const fetchProduct = async () => {
            try {
                const response = await instance.get(`/product/${slug}`); // Giả sử API trả về thông tin sản phẩm
                const product = response.data;
                console.log("data",product)
                setProductName(product.name); // Cập nhật tên sản phẩm
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [slug]);

    useEffect(() => {
        // Lấy thông tin đánh giá sản phẩm (giả sử API trả về đánh giá của sản phẩm)
        const fetchRatings = async () => {
            try {
                const response = await instance.get(`/ratings`);
                setRates(response.data);
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        fetchRatings();
    }, [slug]);

    return (
        <>
            <div className="w-full bg-white p-4 mb-4">
                <p className="text-lg font-medium">
                    SẢN PHẨM :
                    <span className="font-normal ml-2">{productName || "Đang tải..."}</span>
                </p>
            </div>
            <div>
                <RatingProduct slugProd={slug} rates={rates} />
            </div>
        </>
    );
};

export default RatingProductAdmin;
