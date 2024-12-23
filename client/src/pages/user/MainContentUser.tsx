import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import BannerFixedChild from "../../components/User/Banner/BannerFixedChild";
import BannerHome from "../../components/User/Banner/BannerHome";
import BlogHome from "../../components/User/Blogs/BlogsHome";
import CategorysList from "../../components/User/Categorys/CategorysList";
import ProductClothes from "../../components/User/Products/ProductClothes";
import ProductFeature from "../../components/User/Products/ProductFeature";
import ProductGlasses from "../../components/User/Products/ProductGlasses";
import ProductUniForm from "../../components/User/Products/ProductUniForm";
// import ProductSneaker from "../../components/User/Products/ProductSneaker";
import VoucherList from "../../components/User/Voucher/VoucherList";
import instance from "../../instance/instance";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";

const LoadingSpinner = () => (
  <LoadingOverlay
    active={true}
    spinner
    styles={{
      overlay: (base) => ({
        ...base,
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(4px)",
      }),
      spinner: (base) => ({
        ...base,
        width: "40px",
        "& svg circle": {
          stroke: "rgba(255, 153, 0,5)",
          strokeWidth: "3px",
        },
      }),
    }}
  />
);

const LazyLoadSection = ({ children, onVisible, loading }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      onVisible();
    }
  }, [inView, onVisible]);

  return (
    <div ref={ref}>
      {loading ? <LoadingSpinner /> : children}
    </div>
  );
};

const MainContentUser = () => {
  // Khởi tạo state với giá trị mặc định là mảng rỗng hoặc object rỗng
  const [bannerData, setBannerData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productFeatureData, setProductFeatureData] = useState([]);
  const [productClothesData, setProductClothesData] = useState([]);
  const [productUniformData, setProductUniformData] = useState([]);
  const [productGlassesData, setProductGlassesData] = useState([]);
  const [productSneakers, setProductSneakers] = useState([]);
  const [blogData, setBlogData] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    banner: true, 
    voucher: true,
    category: false,
    feature: false,
    clothes: false,
    uniform: false,
    glasses: false,
    sneakers: false,
    blog: false,
  });

  const setLoading = (section, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [section]: isLoading }));
  };

  const fetchBannerData = useCallback(async () => {
    setLoading('banner', true);
    const response = await instance.get("bannerHome");
    setBannerData(response?.data?.data || []);
    setLoading('banner', false);
  }, []);

  const fetchVoucherData = useCallback(async () => {
    setLoading('voucher', true);
    const response = await instance.get("coupon-home");
    setVoucherData(response?.data?.data || []);
    setLoading('voucher', false);
  }, []);

  const fetchCategoryData = useCallback(async () => {
    setLoading('category', true);
    const response = await instance.get("products/filter");
    setCategoryData(response?.data?.categories || []);
    setLoading('category', false);
  }, []);

  const fetchProductFeatureData = useCallback(async () => {
    setLoading('feature', true);
    const response = await instance.get('home/products/featured');
    setProductFeatureData(response?.data || []);
    setLoading('feature', false);
  }, []);

  const fetchProductClothesData = useCallback(async () => {
    setLoading('clothes', true);
    const response = await instance.get('home/product/category/ao-nam');
    console.log(response);
    setProductClothesData(response?.data?.data || []);
    setLoading('clothes', false);
  }, []);

  const fetchProductUniformData = useCallback(async () => {
    setLoading('uniform', true);
    const response = await instance.get('home/product/category/4');
    setProductUniformData(response?.data?.data || []);
    setLoading('uniform', false);
  }, []);

  const fetchProductGlassesData = useCallback(async () => {
    setLoading('glasses', true);
    const response = await instance.get('home/product/category/2');
    setProductGlassesData(response?.data?.data || []);
    setLoading('glasses', false);
  }, []);

  const fetchProductSneakersData = useCallback(async () => {
    setLoading('sneakers', true);
    const response = await instance.get('home/product/category/3');
    setProductSneakers(response?.data?.data || []);
    setLoading('sneakers', false);
  }, []);

  const fetchBlogData = useCallback(async () => {
    setLoading('blog', true);
    const response = await instance.get('list-blogs');
    setBlogData(response?.data?.data || []);
    setLoading('blog', false);
  }, []);

  useEffect(() => {
    fetchBannerData();
    fetchVoucherData();
  }, [fetchBannerData, fetchVoucherData]);

  return (
    <>
      {/* Banner Section */}
      <div className="mt-5 mb-4 flex flex-col lg:flex-row gap-4" id="banner">
        {loadingStates.banner ? (
          <LoadingSpinner />
        ) : (
          <>
            <BannerHome banners={bannerData} />
            <BannerFixedChild banners={bannerData} />
          </>
        )}
      </div>

      {/* Voucher Section */}
      {loadingStates.voucher ? (
        <LoadingSpinner />
      ) : (
        <VoucherList vouchers={voucherData} />
      )}

      {/* Category Section */}
      <LazyLoadSection onVisible={fetchCategoryData} loading={loadingStates.category}>
        <CategorysList categoryLists={categoryData} />
      </LazyLoadSection>

      {/* Product Feature Section */}
      <LazyLoadSection onVisible={fetchProductFeatureData} loading={loadingStates.feature}>
        <ProductFeature productFeatures={productFeatureData} />
      </LazyLoadSection>

      {/* Product Clothes Section */}
      <LazyLoadSection onVisible={fetchProductClothesData} loading={loadingStates.clothes}>
        <ProductClothes productClothes={productClothesData} />
      </LazyLoadSection>

      {/* Product Uniform Section */}
      {/* <LazyLoadSection onVisible={fetchProductUniformData} loading={loadingStates.uniform}>
        <ProductUniForm productUniForms={productUniformData} />
      </LazyLoadSection> */}

      {/* Product Glasses Section */}
      {/* <LazyLoadSection onVisible={fetchProductGlassesData} loading={loadingStates.glasses}>
        <ProductGlasses productGlasses={productGlassesData} />
      </LazyLoadSection> */}

      {/* <LazyLoadSection onVisible={fetchProductSneakersData} loading={loadingStates.sneakers}>
        <ProductSneaker productSneakers={productSneakers} />
      </LazyLoadSection> */}

      {/* Blog Section */}
      <LazyLoadSection onVisible={fetchBlogData} loading={loadingStates.blog}>
        <BlogHome blogs={blogData} />
      </LazyLoadSection>
    </>
  );
};

export default MainContentUser;