import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { message, Rate } from "antd";
import instance from "../../../../instance/instance";
import { IRatingOrder } from "../../../../interfaces/IRating";
import { IAttributeValue } from "../../../../interfaces/IAttributeValue";

// Constants
const RATING_DATA = [
  { value: 1, text: "Tệ", color: "#FF9900" },
  { value: 2, text: "Không hài lòng", color: "#FFA940" },
  { value: 3, text: "Bình thường", color: "#FAAD14" },
  { value: 4, text: "Hài lòng 👍", color: "#52C41A" },
  { value: 5, text: "Tuyệt vời 🎉", color: "#28A745" },
] as const;

// Types
interface ProductRatingData {
  productId: number;
  rating: number;
  content: string;
}

interface RatingItemProps {
  image: string;
  name: string;
  categorySlug?: string;
  productSlug: string;
  productId: number;
  attribute_values: IAttributeValue[];
  onRatingChange: (productId: number, rating: number, content: string) => void;
}

const ProductRatingItem = ({
  image,
  name,
  categorySlug,
  productSlug,
  productId,
  attribute_values,
  onRatingChange,
}: RatingItemProps) => {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");

  const handleRatingChange = (newValue: number) => {
    setRating(newValue);
    onRatingChange(productId, newValue, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onRatingChange(productId, rating || 0, e.target.value);
  };

  return (
    <div className="border border-[#f1f1f1] rounded-md p-3 space-y-3">
      <div className="flex gap-3 items-center w-fit">
        <img
          src={image}
          alt={name}
          className="h-14 w-14 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between gap-1">
          <Link
            to={`/${categorySlug}/${productSlug}`}
            className="line-clamp-1 hover:text-primary"
          >
            {name}
          </Link>
          <p className="text-[13px] line-clamp-1 text-secondary/50">
            {attribute_values.length > 0 &&
              Object.entries(
                attribute_values.reduce<Record<string, string[]>>(
                  (acc, attr) => {
                    const attrName = attr.attribute.name;
                    const value = attr.value;
                    if (!acc[attrName]) {
                      acc[attrName] = [];
                    }
                    acc[attrName].push(value!);
                    return acc;
                  },
                  {}
                )
              )
                .reduce<string[][]>((result, [key, values]) => {
                  if (values.length > 0) {
                    values.forEach((value, index) => {
                      if (!result[index]) {
                        result[index] = [];
                      }
                      result[index].push(value);
                    });
                  }
                  return result;
                }, [])
                .map((group) => group.join(", "))
                .join(" | ")}
          </p>
        </div>
      </div>
      <div>
        <Rate value={rating} onChange={handleRatingChange} allowClear={false} />
        {rating && rating !== 0 ? (
          <span
            className="ml-2"
            style={{ color: RATING_DATA[rating - 1].color }}
          >
            {RATING_DATA[rating - 1].text}
          </span>
        ) : (
          ""
        )}
      </div>
      <div>
        <textarea
          className="w-full placeholder:text-sm p-2 border border-gray-200 rounded-md min-h-[100px] focus:outline-none focus:border-primary resize-none"
          placeholder="Chia sẻ đánh giá của bạn về sản phẩm..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};

const useRatingDetail = (codeOrder: string) => {
  const [ratingDetail, setRatingDetail] = useState<IRatingOrder>();
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const hasNavigated = useRef(false); 

  useEffect(() => {
    const fetchRatingDetail = async () => {
      try {
        const { data } = await instance.get(
          `orders/detail-reviews/${codeOrder}`
        );
        if (data && data.items.length >= 1) {
          setRatingDetail(data);
        } else if (!hasNavigated.current) {
          hasNavigated.current = true; 
          message.warning("Bạn đã đánh giá đơn hàng này rồi");
          navigate('/user-manager/user-ratings');
        }
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchRatingDetail();
  }, [codeOrder, navigate]);

  return { ratingDetail, error };
};



const RatingDetailOrder = () => {
  const { code_order } = useParams<{ code_order: string }>();
  const { ratingDetail, error } = useRatingDetail(code_order!);
  const [productRatings, setProductRatings] = useState<
    Map<number, ProductRatingData>
  >(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (error) return <div>Error: {error.message}</div>;
  if (!ratingDetail) return <div>Dữ liệu rỗng</div>;

  const handleRatingChange = (
    productId: number,
    rating: number,
    content: string
  ) => {
    setProductRatings((prev) => {
      const newMap = new Map(prev);
      newMap.set(productId, { productId, rating, content });
      return newMap;
    });
  };

  const handleSubmitAllRatings = async () => {
    const ratings = Array.from(productRatings.values());
    const finalRatings =
      ratings.length === 0
        ? ratingDetail.items.map((item) => {
            const productId = item.variant_lists[0].variant
              ? item.variant_lists[0].variant.product.id
              : item.product.id;
            return {
              product_id: productId,
              rating: 5,
              content: "",
            };
          })
        : ratings.map((r) => ({
            product_id: r.productId,
            rating: r.rating || 5,
            content: r.content || "",
          }));

    setIsSubmitting(true);
    try {
      await instance.post(`ratings/review`, {
        order_id: ratingDetail.order_id,
        review: finalRatings,
      });
      navigate('/user-manager/user-ratings')
      message.success("Đánh giá thành công!");
    } catch (error) {
      console.error("Error submitting ratings:", error);
      message.error("Có lỗi xảy ra khi gửi đánh giá!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-util border border-[#f1f1f1] rounded-md p-4 min-h-screen space-y-5">
      <div className="flex justify-between items-center border-b pb-4 border-[#f1f1f1]">
        <h3 className="uppercase font-medium text-sm">
          Đánh giá đơn hàng <span className="text-primary">#{code_order}</span>
        </h3>
        <div>
          <button
            className={`py-1.5 px-3 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleSubmitAllRatings}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Đánh giá"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ratingDetail.items.map((item, index) => {
          const isMultipleVariants = item.variant_lists.length !== 1;
          // console.log(item);
          if (isMultipleVariants) {
            return (
              <ProductRatingItem
                key={`product-${index}`}
                image={item.product.images[0]}
                name={item.product.name}
                categorySlug={item.product.category?.slug}
                productSlug={item.product.slug}
                productId={item.product.id}
                onRatingChange={handleRatingChange}
                attribute_values={item.variant_lists.flatMap(
                  (variant_list) => variant_list.variant.attribute_values || []
                )}
              />
            );
          }

          const variant = item.variant_lists[0].variant;
          return (
            <ProductRatingItem
              key={`variant-${index}`}
              image={variant.image || variant.product.images[0]}
              name={variant.product.name}
              categorySlug={variant.product.category?.slug}
              productSlug={variant.product.slug}
              productId={variant.product.id}
              attribute_values={variant.attribute_values || []}
              onRatingChange={handleRatingChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RatingDetailOrder;
