import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase-app/firebase-config";

const Footer = () => {
  const [categories, setCategories] = useState([]);

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
  return (
    <footer className="border-t border-cyan-500 mt-7">
      <div className="container">
        <div className="footer py-8 h-[280px]">
          <div className="grid grid-cols-3 h-full gap-3">
            <div className="flex flex-col">
              <p className="flex items-center">
                <img
                  srcSet="/images/logo-monkey.png 2x"
                  className="logo w-[60px] mb-5 mr-3"
                  alt="monkey-blogging"
                />
                <span className="hidden lg:inline-block text-2xl font-semibold">
                  Monkey Blogging
                </span>
              </p>
              <p className="mb-5">© 2020, All Rights Reserved.</p>
              <p>Created by TMT</p>
            </div>
            <div className="">
              <h3 className="font-semibold text-xl mb-5">Category</h3>
              <ul>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <li key={item.id} className="mb-5">
                      <Link to={`category/${item.slug}`}>{item.name}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-5">Contact</h3>
              <p className="mb-5">
                219/78 Trần Văn Đang - Quận 10 - Thành phố Hồ chí Minh
              </p>
              <p>Phone: 0347541730</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
