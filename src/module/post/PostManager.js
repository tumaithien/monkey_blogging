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
import { debounce } from "lodash";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import ActionDelete from "../../components/action/ActionDelete";
import ActionEdit from "../../components/action/ActionEdit";
import ActionView from "../../components/action/ActionView";
import { Button } from "../../components/button";
import { Dropdown } from "../../components/dropdown";
// import Pagination from "../../components/pagination/Pagination";
import { Table } from "../../components/table";
import { db } from "../../firebase-app/firebase-config";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useNavigate } from "react-router-dom";
import { LabelStatus } from "../../components/label";
import { postStatus, userRole } from "../../utils/contants";
import { useAuth } from "../../context/auth-context";

const POST_PER_PAGE = 5;
const PostManager = () => {
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState(undefined);
  const [filterCategory, setFilterCategory] = useState(undefined);
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const handleLoadMorePost = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(lastDoc || 0),
      limit(POST_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList([...postList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  //Find post by title
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8"),
            where("user.id", "==", userInfo.uid)
          )
        : query(
            colRef,
            limit(POST_PER_PAGE),
            where("user.id", "==", userInfo.uid)
          );
      const adRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
          )
        : query(colRef, limit(POST_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      if (userInfo.role === userRole.ADMIN) {
        onSnapshot(adRef, (snapshot) => {
          let results = [];
          snapshot.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setTotal(snapshot.size);
          setPostList(results);
        });
      } else {
        onSnapshot(newRef, (snapshot) => {
          let results = [];
          snapshot.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setTotal(snapshot.size);
          setPostList(results);
        });
      }
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter, userInfo.role, userInfo.uid]);
  //Get data category from firebase to dropdown
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(results);
    }
    getData();
  }, []);
  //Find post by category
  useEffect(() => {
    async function fetchDataCategory() {
      const colRef = collection(db, "posts");
      const newRef = filterCategory
        ? query(
            colRef,
            where("category.name", ">=", filterCategory),
            where("category.name", "<=", filterCategory + "utf8")
          )
        : query(colRef);
      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(results);
      });
    }
    fetchDataCategory();
  }, [filterCategory]);
  const handleDeletePost = async (docId) => {
    const colRef = doc(db, "posts", docId);
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
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };
  const handleClickOption = async (item) => {
    setSelectCategory(item.name);
    setFilterCategory(item.name);
  };
  const handleClickCategory = () => {
    setSelectCategory("Select category");
    setFilterCategory(undefined);
  };
  const handleInputFillter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Active</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case postStatus.REJECTED:
        return <LabelStatus type="danger">Reject</LabelStatus>;

      default:
        break;
    }
  };
  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end gap-5">
        <input
          type="text"
          placeholder="Search title..."
          className="py-3 px-5 border border-gray-300 rounded-lg"
          onChange={handleInputFillter}
        />
        <div className="w-full max-w-[300px]">
          <Dropdown>
            <Dropdown.Select
              className="h-full"
              placeholder={`${selectCategory || "Select category"}`}
            ></Dropdown.Select>
            <Dropdown.List>
              <Dropdown.Options onClick={handleClickCategory}>
                Select category
              </Dropdown.Options>
              {categories.length > 0 &&
                categories.map((item) => (
                  <Dropdown.Options
                    key={item.id}
                    onClick={() => handleClickOption(item)}
                  >
                    {item.name}
                  </Dropdown.Options>
                ))}
            </Dropdown.List>
          </Dropdown>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 ? (
            postList.map((post) => {
              return (
                <tr key={post.id}>
                  <td title={post.id}>{post.id.slice(0, 5) + "..."}</td>
                  <td>
                    <div className="flex items-center gap-x-3">
                      <img
                        src={post?.image}
                        alt={post?.image_name}
                        className="w-[66px] h-[55px] rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{post?.title}</h3>
                        <time className="text-sm text-gray-500">
                          Date:{" "}
                          {new Date(
                            post?.createAt?.seconds * 1000
                          ).toLocaleDateString("vi")}
                        </time>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-500">{post?.category.name}</span>
                  </td>
                  <td>
                    <span className="text-gray-500">{post?.user.username}</span>
                  </td>
                  <td>{renderPostStatus(post.status)}</td>
                  <td>
                    <div className="flex items-center gap-x-3 text-gray-500">
                      <ActionView
                        onClick={() => navigate(`/${post.slug}`)}
                      ></ActionView>
                      <ActionEdit
                        onClick={() =>
                          navigate(`/manage/update-post?id=${post.id}`)
                        }
                      ></ActionEdit>
                      <ActionDelete
                        onClick={() => handleDeletePost(post.id)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">
                <div className="text-center">No results</div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="mt-10 text-center">
        {/* <Pagination></Pagination> */}
        {total > postList.length && !filter && !filterCategory && (
          <div className="mt-10">
            <Button
              onClick={handleLoadMorePost}
              kind="ghost"
              className="mx-auto w-[200px]"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManager;
