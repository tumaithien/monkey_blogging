import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus } from "../../utils/contants";
import DashboardHeading from "../dashboard/DashboardHeading";
var slugify = require("slugify");
const CategoryAddNew = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: categoryStatus.APPROVED,
      createAt: new Date(),
    },
  });
  const watchStatus = watch("status");
  const handleAddNewCategory = async (values) => {
    if (!isValid) return;
    const newValues = { ...values };
    newValues.slug = slugify(newValues.name || newValues.slug, {
      lower: true,
    });
    newValues.status = Number(newValues.status);
    const colRef = collection(db, "categories");
    try {
      await addDoc(colRef, {
        ...newValues,
        createAt: serverTimestamp(),
      });
      toast.success("Add new category successfully!!!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset({
        name: "",
        slug: "",
        status: categoryStatus.APPROVED,
        createAt: new Date(),
      });
    }

    console.log(newValues);
  };
  useEffect(() => {
    document.title = "Monkey Blogging - Add News Category";
  }, []);
  return (
    <div>
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddNewCategory)}>
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              name="slug"
              control={control}
              placeholder="Enter your category"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <div className="flex flex-wrap gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.APPROVED}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </div>
          </Field>
        </div>
        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
        >
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
