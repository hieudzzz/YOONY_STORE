import BannerFixedChild from "../../components/User/Banner/BannerFixedChild";
import BannerHome from "../../components/User/Banner/BannerHome";
import BlogHome from "../../components/User/Blogs/BlogsHome";
import BlogPage from "../../components/User/Blogs/BlogsPage";
import CategorysList from "../../components/User/Categorys/CategorysList";
import ProductClothes from "../../components/User/Products/ProductClothes";
import ProductFeature from "../../components/User/Products/ProductFeature";
import ProductGlasses from "../../components/User/Products/ProductGlasses";
import ProductUniForm from "../../components/User/Products/ProductUniForm";
// import CardPolicyList from "../../components/User/Banner/CardPolicyList";
import VoucherList from "../../components/User/Voucher/VoucherList";

const MainContentUser = () => {
  return (
    <>
      <div className="mt-5 mb-4 flex flex-col lg:flex-row gap-4" id="banner">
          <BannerHome />
          <BannerFixedChild />
      </div>
      <VoucherList />
      <CategorysList />
      <ProductFeature />
      <ProductClothes />
      <ProductUniForm />
      <ProductGlasses />
      <BlogHome/>
    </>
  );
};

export default MainContentUser;
