import React, { useState, useEffect } from "react";

import ReactPaginate from "react-paginate";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import "./style.css";

const Dashboard = () => {
  useEffect(() => {
    console.log(localStorage.getItem("token"));
    axios.defaults.baseURL = "http://localhost:8000/";

    axios.defaults.headers.common = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  }, []);

  //for list
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    let result = await fetch("http://127.0.0.1:8000/auth/postlist");
    result = await result.json();
    setData(result);
  }

  //for pagination
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(4);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let result = await fetch("http://127.0.0.1:8000/auth/postlist");
      result = await result.json();
      setPageCount(Math.ceil(result.length / perPage));
      setData(result.slice(offset, offset + perPage));
    };
    fetchData();
  }, [offset]);
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage * perPage);
  };

  return (
    <div class="dashbg">
      <h1 class="dashder"> All Posts</h1>
      {data.map((item) => (
        <div class="rowr">
          <div class="columnr">
            <div class="cardr">
              <img
                style={{ width: 400, height: 300 }}
                src={"http://127.0.0.1:8000/posts/" + item.file_path}
                alt="food"
              />
              <div class="containerr">
                <Link to={"details/" + item.id}>
                  <a href="http://localhost:3000/details/:id" class="details">
                    {item.name}
                  </a>
                </Link>
                <br />
              </div>
            </div>
          </div>
        </div>
      ))}
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default Dashboard;
