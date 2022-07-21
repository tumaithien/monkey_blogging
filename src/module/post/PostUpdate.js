import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field, FieldCheckboxes } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import Toggle from "../../components/toggle/Toggle";
import { db } from "../../firebase-app/firebase-config";
import useFirebaseImage from "../../hook/useFirebaseImage";
import { postStatus } from "../../utils/contants";
import DashboardHeading from "../dashboard/DashboardHeading";
import { toast } from "react-toastify";
import { useMemo } from "react";
import axios from "axios";

Quill.register("modules/imageUploader", ImageUploader);
const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fillterCategory, setFillterCategory] = useState("");
  const [selectCategory, setSelectCategory] = useState();
  const [content, setContent] = useState("");
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });
  const imageUrl = getValues("image");
  const imageName = getValues("image_name");
  const { image, progress, setImage, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deletePostImage);
  async function deletePostImage() {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, {
      image: "",
    });
  }
  //Set image-url to show display choose image
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);
  const watchHot = watch("hot");
  const watchStatus = watch("status");
  //Get data post from firebase
  useEffect(() => {
    async function fetchDataPost() {
      if (!postId) return;
      const docRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.data()) {
        if (docSnapshot.data()) {
          reset(docSnapshot.data());
          setSelectCategory(docSnapshot.data()?.category || "");
          setContent(docSnapshot.data()?.content || "");
        }
      }
    }
    fetchDataPost();
  }, [postId, reset]);
  //Get data category from db categories firebase
  useEffect(() => {
    async function getDataCategories() {
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
    getDataCategories();
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
  const updatePostHandler = async (values) => {
    if (!isValid) return;
    const docRef = doc(db, "posts", postId);
    setLoading(true);
    try {
      await updateDoc(docRef, {
        ...values,
        content,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
    toast.success("Update post successfully!!");
  };
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
  if (!postId) return null;
  return (
    <>
      <DashboardHeading
        title="Update post"
        desc="Update post content"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(updatePostHandler)}>
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
              value={content}
              onChange={setContent}
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
          Update content post
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
