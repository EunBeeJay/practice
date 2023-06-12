import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useEffect } from "react";

const Filter = () => {
  const filterRef = useRef();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [searchBtn, setSearchBtn] = useState("");
  const categoryArr = [
    "전체",
    "디지털기기",
    "생활가전",
    "가구/인테리어",
    "육아/유아동",
    "생활/주방용품",
    "의류/가방/지갑/잡화",
  ];

  useEffect(() => {}, [searchBtn, filter]);

  /** 필터 버튼 클릭 시 검색 */
  const onClickSearch = (event) => {
    const {
      target: { value },
    } = event;

    setSearchBtn(value);
    navigate(`/search?keyword=${value}`);
  };

  /** 초기화 클릭 시 홈 화면으로 */
  const onClickHome = () => {
    navigate("/");
  };

  /** 필터 클릭 시 필터 메뉴 숨기기 */
  const onClickFilter = () => {
    setFilter((filter) => !filter);

    // filter 카테고리 버튼 숨기기 이거 때문에 변경안되는 중
    if (!filter) {
      filterRef.current.style.display = "flex";
    } else {
      filterRef.current.style.display = "none";
    }
  };
  return (
    <FilterBox>
      <FilterSelector>
        <FilterBtn>
          <div onClick={onClickFilter}>
            <FontAwesomeIcon icon={faBars} />
            <span>제품 필터</span>
          </div>
          {searchBtn ? <button>{searchBtn}</button> : null}
        </FilterBtn>
        <div onClick={onClickHome}>초기화</div>
      </FilterSelector>
      <FilterCategory ref={filterRef}>
        {categoryArr.map((category, idx) => {
          return (
            <button key={idx} value={category} onClick={onClickSearch}>
              {category}
            </button>
          );
        })}
      </FilterCategory>
    </FilterBox>
  );
};

export default Filter;

const FilterBox = styled.div`
  margin-top: 50px;
  overflow: hidden;
`;

const FilterSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  div {
    cursor: pointer;
  }
`;

const FilterBtn = styled.div`
  display: flex;
  align-items: center;

  div {
    cursor: pointer;

    span {
      margin-left: 10px;
    }
  }

  button {
    margin-left: 10px;
    font-size: 10px;
    border-radius: 15px;
    border-color: gray;
    color: #5ba4e7;
    font-weight: bold;
    border: 1px solid gray;
    background-color: #fffaf4;
  }
`;

const FilterCategory = styled.div`
  display: none;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;

  button {
    font-size: 10px;
    border-radius: 15px;
    border-color: gray;
    color: #5ba4e7;
    font-weight: bold;
    border: 1px solid gray;
    background-color: #fffaf4;
  }
`;
