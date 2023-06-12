import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const HeaderMenu = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [searchOpen, setSearchOpen] = useState(false);

  const onValid = (data) => {
    navigate(`/search?keyword=${data.search}`);
  };

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  return (
    <Header>
      <h1>리챗</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <FontBox>
          <Search>
            <FontAwesomeIcon
              icon={faSearch}
              onClick={toggleSearch}
              style={{ cursor: "pointer" }}
            />
            <Input
              {...register("search", {
                required: "한 글자 이상 입력해주세요.",
              })}
              animate={{ scaleX: searchOpen ? 1 : 0 }}
              placeholder={errors ? errors?.search?.message : ""}
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
  border-bottom: 2px solid #aaaaaa;
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

  &::placeholder {
    font-size: 10px;
    font-weight: bold;
    color: red;
  }
`;
