import { deleteUser } from "firebase/auth";
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ActionDelete from "../../components/action/ActionDelete";
import ActionEdit from "../../components/action/ActionEdit";
import { Button } from "../../components/button";
import LabelStatus from "../../components/label/LabelStatus";
import { Table } from "../../components/table";
import { db } from "../../firebase-app/firebase-config";
import { userRole, userStatus } from "../../utils/contants";

const USER_PER_PAGE = 5;
const UserTable = () => {
  const [filter, setFilter] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [userList, setUserList] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  //Load more list data user
  const handleLoadMoreUser = async () => {
    const nextRef = query(
      collection(db, "users"),
      startAfter(lastDoc || 0),
      limit(USER_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList([...userList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  //Get data user List and filter from firebase
  useEffect(() => {
    async function fetchUserData() {
      const colRef = collection(db, "users");
      const newRef = filter
        ? query(
            colRef,
            where("username", ">=", filter),
            where("username", "<=", filter + "utf8")
          )
        : query(colRef, limit(USER_PER_PAGE));
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
        setUserList(results);
      });
      setLastDoc(lastVisible);
    }
    fetchUserData();
  }, [filter]);
  const handleFilterUser = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const navigate = useNavigate();
  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case userStatus.BANNED:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        break;
    }
  };
  const renderRoleLabel = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MOD:
        return "Mod";
      case userRole.USER:
        return "User";
      default:
        break;
    }
  };
  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);
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
        await deleteUser(user);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const renderUserList = (user) => {
    return (
      <tr key={user.id}>
        <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
        <td className="whitespace-nowrap">
          <div className="flex gap-x-5 items-center">
            <img
              src={user?.avatar}
              alt=""
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3>{user?.fullname}</h3>
              <time className="text-sm text-gray-400">
                {new Date(user?.createAt?.seconds * 1000).toLocaleDateString(
                  "vi"
                )}
              </time>
            </div>
          </div>
        </td>
        <td>{user?.username}</td>
        <td>{user?.email}</td>
        <td>{renderLabelStatus(Number(user?.status))}</td>
        <td>{renderRoleLabel(Number(user?.role))}</td>
        <td>
          <div className="flex gap-x-3 items-center">
            <ActionEdit
              onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
            ></ActionEdit>
            <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
          </div>
        </td>
      </tr>
    );
  };
  return (
    <>
      <div className="flex justify-end mb-10">
        <input
          type="text"
          placeholder="Search user..."
          className="py-4 px-5 border border-gray-300 rounded-lg"
          onChange={handleFilterUser}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 && userList.map((user) => renderUserList(user))}
        </tbody>
      </Table>
      {total > userList.length && !filter && (
        <div className="mt-10">
          <Button onClick={handleLoadMoreUser} className="mx-auto">
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default UserTable;
