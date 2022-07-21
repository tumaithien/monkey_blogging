import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Table } from "../../components/table";
import { db } from "../../firebase-app/firebase-config";
import { Button } from "../../components/button";
import { categoryStatus, userRole } from "../../utils/contants";
import DashboardHeading from "../dashboard/DashboardHeading";
import LabelStatus from "../../components/label/LabelStatus";
import ActionEdit from "../../components/action/ActionEdit";
import ActionView from "../../components/action/ActionView";
import ActionDelete from "../../components/action/ActionDelete";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useAuth } from "../../context/auth-context";

const CATEGORY_PER_PAGE = 5;
const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const [fillter, setFillter] = useState(undefined);
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);
  //Loadmore list category
  const handleLoadMoreCategory = async () => {
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDoc || 0),
      limit(CATEGORY_PER_PAGE)
    );

    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryList([...categoryList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  //get data category in firebase in real time
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const newRef = fillter
        ? query(
            colRef,
            where("name", ">=", fillter),
            where("name", "<=", fillter + "utf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(results);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [fillter]);
  const handleDeleteCategory = async (docId) => {
    const colRef = doc(db, "categories", docId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const handleInputFillter = debounce((e) => {
    setFillter(e.target.value);
  }, 500);
  const { userInfo } = useAuth();
  console.log(userInfo);
  if (userInfo.role !== userRole.ADMIN) {
    return <h3 className="text-center">You do not have access to this item</h3>;
  }
  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button to="/manage/add-category" type="button" kind="ghost">
          Add new Category
        </Button>
      </DashboardHeading>
      <div className="flex justify-end mb-10">
        <input
          type="text"
          placeholder="Search category..."
          className="py-4 px-5 border border-gray-300 rounded-lg"
          onChange={handleInputFillter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td className="italic text-gray-400">{item.slug}</td>
                <td>
                  {Number(item.status) === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {Number(item.status) === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex gap-x-3 items-center">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${item.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > categoryList.length && (
        <div className="mt-10">
          <Button onClick={handleLoadMoreCategory} className="mx-auto">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
