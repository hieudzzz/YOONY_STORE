import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import JoditEditor from "jodit-react";
import { ToggleSwitch } from "flowbite-react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import { IBlog } from "../../../interfaces/IBlogs";
import { BlogContext } from "../../../contexts/BlogsContext";
import instance from "../../../instance/instance";
import slugify from "react-slugify";
import ListBlogsAdmin from "./ListBlogsAdmin";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BlogsAdmin = () => {
  const [value, setValue] = useState(0);
  const [statusBlog, setStatusBlog] = useState<boolean>(true);
  const [titleSlugBlog, setTitleSlugBlog] = useState("");
  const [errorBlog, setErrorBlog] = useState<string>("");
  const editorRef = useRef(null);
  const [content, setContent] = useState<string>("");
  const [isActive, setActive] = useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Viết Blog ...",
      uploader: {
        insertImageAsBase64URI: true,
      },
      height: 500,
    }),
    []
  );
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const {dispatch} = useContext(BlogContext)
  const { handleSubmit } = useForm<IBlog>();
  const onSubmit = async () => {
    try {
      if (titleSlugBlog !== "") {
        setErrorBlog("");
        setActive(true);
      } else {
        setErrorBlog("Thiếu thẻ tiên đề heading cho blog !");
      }
      const images = doc.querySelectorAll("img");
      const uploadImagesBlog = Array.from(images).map(async (img) => {
        const src = img.src;
        const response = await fetch(src);
        const fileBlob = await response.blob();
        const formData = new FormData();
        formData.append("file", fileBlob);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_PRESET_KEY_CLOADINARY
        );
        const responseImageCloud = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME_CLOADINARY
          }/image/upload`,
          formData
        );
        return { originalSrc: src, newSrc: responseImageCloud.data.secure_url };
      });
      const dataImagesCloud = await Promise.all(uploadImagesBlog);
      let contentNew = content;
      dataImagesCloud.forEach((img) => {
        contentNew = contentNew.replace(img.originalSrc, img.newSrc);
      });
    const {data} = await instance.post("blogs",{
      content: contentNew,
      slug: slugify(titleSlugBlog),
      user_id: 1 ,
      isActive: setActive
    });
    console.log(data);
    if(data){
      setActive(false);
    }
    toast.success(data.message);
    setValue(0);
    setContent("");
    dispatch({
      type: "ADD",
      payload: data
    });
    console.log('API Response:', data); 
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const h1Element = doc.querySelector("h1");
    if (h1Element) {
      const titleSlug = h1Element.textContent;
      setTitleSlugBlog(titleSlug!);
    } else {
      setTitleSlugBlog("");
      setErrorBlog("Thiếu thẻ tiên đề heading cho blog !");
    }
  }, [content]);
  return (
    <Box sx={{ width: "full" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Danh sách"  {...a11yProps(0)} />
          <Tab label="Thêm bài viết +" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ListBlogsAdmin />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <LoadingOverlay active={isActive} spinner>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <JoditEditor
              ref={editorRef}
              value={content}
              onChange={(newContent: any) => {
                setContent(newContent);
              }}
              config={config}
            />
            {errorBlog !== "" ? (
              <div className="my-2">
                <span className="text-sm text-red-500">{errorBlog}</span>
              </div>
            ) : (
              ""
            )}
            <div>
              <ToggleSwitch
                label="Trạng thái"
                checked={isActive}
                 onChange={setActive}
                className="my-7"           
                sizing={'sm'}
              />
            </div>
            <ButtonSubmit content="Thêm bài viết" />
          </form>
        </LoadingOverlay>
        </CustomTabPanel>
    </Box>
    
  );
};

export default BlogsAdmin;
