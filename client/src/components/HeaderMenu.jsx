import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const HeaderMenu = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError } = useForm();
  const [searchOpen, setSearchOpen] = useState(false);

  const onValid = (data) => {
    // navigate(`/search?keyword=${data.search}`)
    // URLsearchparams 로 keyword 추출
  };

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  return (
    <Header>
      <h1>리뷰앱</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <FontBox>
          <Search>
            <FontAwesomeIcon
              icon={faSearch}
              onClick={toggleSearch}
              style={{ cursor: "pointer" }}
            />
            <Input
              {...register("search", { maxLength: 2 })}
              animate={{ scaleX: searchOpen ? 1 : 0 }}
            />
          </Search>
          <div>
            <FontAwesomeIcon icon={faBell} style={{ cursor: "pointer" }} />
          </div>
        </FontBox>
      </form>
    </Header>
  );
};

export default HeaderMenu;

const Header = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 15px;
  box-sizing: border-box;
  background-color: white;
  z-index: 5;
`;

const FontBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Search = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const Input = styled(motion.input)`
  position: absolute;
  left: -180px;
  transform-origin: right center;
`;
