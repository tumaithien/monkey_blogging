import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../../components/button/Button";
import Radio from "../../components/checkbox/Radio";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import Label from "../../components/label/Label";
import { postStatus } from "../../utils/contants";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImage from "../../hook/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import { db } from "../../firebase-app/firebase-config";
import { Dropdown } from "../../components/dropdown";
import { useAuth } from "../../context/auth-context";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import DashboardHeading from "../dashboard/DashboardHeading";
import axios from "axios";

Quill.register("modules/imageUploader", ImageUploader);
var slugify = require("slugify");
const schema = yup.object({
  title: yup.string().required("Please enter post title"),
  // content: yup.string().required("Please enter content post"),
});
const PostAddNewsStyles = styled.div``;
const PostAddNews = () => {
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [fillterCategory, setFillterCategory] = useState("");
  const [userValue, setUserValue] = useState({});
  const [contentPost, setContentPost] = useState("");
  const { userInfo } = useAuth();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: postStatus.PENDING,
      hot: false,
      image: "",
      category: {},
      user: {},
    },
    resolver: yupResolver(schema),
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const {
    image,
    progress,
    handleResetUpload,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.email) return;
      // const colRef = doc(db, "users", userInfo.uid);
      const queries = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(queries);
      querySnapshot.forEach((doc) => {
        setUserValue({
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);
  const addPostHandler = async (values) => {
    setLoading(true);
    try {
      const cloneValue = { ...values };
      cloneValue.slug = slugify(cloneValue.title || cloneValue.slug, {
        lower: true,
        locale: "vi",
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      });
      cloneValue.status = Number(cloneValue.status);
      // cloneValue.content = contentPost;
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValue,
        image,
        categoryId: cloneValue.category.id,
        userId: userValue.id,
        content: contentPost,
        user: userValue,
        createAt: serverTimestamp(),
        // title: cloneValue.title,
        // slug: cloneValue.slug,
        // categoryId: cloneValue.categoryId,
        // hot: cloneValue.hot,
        // status: cloneValue.status,
      });
      toast.success("Create new post successfully!");
      reset({
        title: "",
        slug: "",
        status: postStatus.PENDING,
        category: {},
        hot: false,
        image: "",
        user: {},
      });
      handleResetUpload();
      setSelectCategory(null);
      setContentPost("");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  //get data category where status active in firebase
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getData();
  }, []);
  useEffect(() => {
    document.title = "Monkey Blogging - Add News Post";
  }, []);
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
    setFillterCategory("");
  };
  const handleSearchOption = debounce((e) => {
    setFillterCategory(e.target.value);
  }, 500);
  //Custom modules react quill
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: "https://api.imgbb.com/1/upload?key=8cdbe4cec7ae6f5d83147a2c17b60b98",
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );
  console.log(errors);
  return (
    <PostAddNewsStyles>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="form-layout">
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label htmlFor="slug">Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              className="h-[300px]"
              name="image"
              onChange={handleSelectImage}
              progress={progress}
              handleDeleteImage={handleDeleteImage}
              image={image}
            ></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={`${selectCategory?.name || "Select category"}`}
              ></Dropdown.Select>
              <Dropdown.List>
                <Dropdown.Search
                  onChange={handleSearchOption}
                ></Dropdown.Search>
                {categories.length > 0 && !fillterCategory
                  ? categories.map((item) => (
                      <Dropdown.Options
                        key={item.id}
                        onClick={() => handleClickOption(item)}
                      >
                        {item.name}
                      </Dropdown.Options>
                    ))
                  : categories
                      .filter((item) => {
                        const searchTerm = fillterCategory.toLowerCase();
                        const itemName = item.name.toLowerCase();
                        return (
                          (searchTerm &&
                            itemName.startsWith(searchTerm) &&
                            itemName !== searchTerm) ||
                          itemName === searchTerm
                        );
                      })
                      .map((item) => (
                        <Dropdown.Options
                          key={item.id}
                          onClick={() => handleClickOption(item)}
                        >
                          {item.name}
                        </Dropdown.Options>
                      ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium inline-block">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>
        <div className="mb-10">
          <Label>Content</Label>
          <div className="w-full entry-content">
            <ReactQuill
              modules={modules}
              theme="snow"
              value={contentPost}
              onChange={setContentPost}
            />
          </div>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fearture Post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          isLoading={loading}
          disabled={loading}
          type="submit"
          className="mx-auto w-[250px]"
        >
          Add new post
        </Button>
      </form>
    </PostAddNewsStyles>
  );
};

export default PostAddNews;
