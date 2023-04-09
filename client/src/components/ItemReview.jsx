import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faThumbsUp,
  faEye,
  faCommentAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { useRef } from "react";
import { useState } from "react";
import axios from "axios";

const ItemReview = ({ review, likes }) => {
  // 더보기 클릭을 했을 때 hidden 엘리먼트 나타내기
  const showGroup = useRef();
  // 유저 좋아요 DB 에 review 게시물 id 가 있으면 true, 없으면 false
  const bool = likes.includes(review._id);
  // 좋아요 상태 관리
  const [like, setLike] = useState(bool);
  const starArr = Array.from(Array(5), (i, idx) =>
    idx < review.score ? true : false
  );

  /** 더보기 클릭 시 hiddenGroup 가 보임 및 더보기 기능 숨기기 */
  const handleSeeMore = (event) => {
    showGroup.current.style.display = "flex";
    event.target.parentElement.style.display = "none";
  };

  /** 좋아요 클릭 */
  const onClickLike = async () => {
    const { _id } = review;
    setLike((prev) => !prev);

    await axios.get("http://localhost:4000/main/like", {
      params: { _id, like: !like },
      withCredentials: true,
    });
  };

  return (
    <>
      <ReviewBox>
        <User>
          <img src="data:image/jpeg;base64,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" />
          <div>user</div>
        </User>
        <ReviewInfo>
          <Group>
            <Category type="button">{review.category}</Category>
          </Group>
          <Group>
            <Image>
              <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFRUZGRgZGhoYHBkcHBwcGhgZGBgaGhoZGhkcIS4lHR4rHxgYJjgmKy8xNTU1GiU7QDszPy40NTEBDAwMEA8QHhISHzQsJSs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIALcBEwMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAACAwABBAUG/8QAOBAAAgECBQIDBwMDBAIDAAAAAQIRACEDBBIxQVFhInGRBRMyUoGh0UKxwRRi8AZy4fEjghUzov/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACMRAAMBAAICAgMBAQEAAAAAAAABAhEDIRIxQVETImEycRT/2gAMAwEAAhEDEQA/ANKYOImCqal0oUJ1LqZk8KtpiIhiWBBkbcTW7LYragUfUulrNeSbDxrNrHvDCkeyMF2RldtTga4kAAOzRhiZkW3kxEV1X8KM7t8IJKyPD4ZMDfaKc+TomlKk8/mMYo+ZRVbxorgAgy7gYbLqmJk4Z/8AYV2sqh1EugSPCQokOoEKVddxxBFr1ixcp/4AdOpwyYpIOk69as41cCLdgBWjN+1GXTiKjEHEKsqkEhjCxo4YNEjz63m5xlcdatN6GNUhhJsrR4RYWgTfe/WmPEDrRYedDggodQ6jxBtN54+u1Dat+F9Yc/Ov20biYDLGoEWB+hqDChdUjyp5xGdSxllFielBlcMOxmdIEkgf5FXvXZli3o1ZbNIkaUBMXPesGNiB2eLHkCRpkcGnI6jWvDQA0XHen5DLKxMm+mNQtabA9eDbvUU/F+jWV5L36OS+XDG6jwGViCWAXYk7SekbU7Bw1QswVladl0xMxqANpI37Ct5wQjHVJAvZTcTueu4t59KdngreKFVrREmR9LVm0mzVOkvo5rZgkkLckidhEbE8xt61nwMTFLEgYcliyaGI1SokFSsdTwdu87kyrE694IHAMfiqwsMIxCoFgyQBEkWsPLSPpUeL9mnlIZxmHgKOgHk0mQZEGYt05P0DLe0feqyqoBDaWLSq3spA+I8dPOrcFt3ZQSAIAkQZm/6dge01kfBcsmh/dvqOqVY6kIAJAmxtI6H7rR52XmcOFK6i7FjqbaAxgaRsAOn771zPaGOzzho0BVKu4JtaIA711MwwRSNQYGZgEadzfrIDGf7TXI0FSSulVJMk9fpc/Sl8FHNdFwRhu7M51/qN5KkDSK6SZ52BYYTAaSRrIAaOCAbVzv8AUSgqAr6ihVoCm8ncHqK2ey8NyiySwOrVN5E2j6VUv4RNT8s6mSwEw0XSqodNhFi7amPi33J9KdmsKYtJ3JtzfiuNh5TFxMUM4Qwp0yGgQQslQ5UsUm88Da9dIe0l1FGOnFA8a/DCiRrw9Q8akjid+1HXyL9vgmEgQGbCfSes1j9oZV3GLho0E4YZYtoaSFHeSrX4tXQwc0r6Ctw8+IRBAuLEzx0q8fWrTAVIbUxMHVIIAgzB/g9qGl7QS38nD9ge0WJ/p8cacZB8EiMUEWIb72P813sTCKwRBng3iZifO/pXH/1D7IGMgKeHGwxKOvUXKE73m3n63/pv2qjrodH98so6FXc6tmYnYSRNyLzTVNE1xzXs6uNhrrMCNrcE9fI1y8TNOMSV0yCoYLqJCzckkQsXO38R2vePiaV91oMtpdyvwi3woxYmYF4+lLx/ZYQB3fVIiANIaRBAuSo9adU6xIUyoTbPNI2JiM6F9CMbKoJKBGE6ABYkgGTIubXrdk8kEWSQXUyzEwXBJ+Pki8x2G1blUaywkbkjgkxfsbUSp3kkRftN/O9L8Vb2N8050y8PD0lYYKoIlV+ErvABFrniKvMMXJvAnYVRw5G5MRtcXE2P1FHAAEVvxzK7Rzc10+mc/N4FgwElTP5p2VxlfZvMcjsaPVfakf0KLqxDEsQIi89T2I/atG8MUtN2pfmFXWT+lT5fvVU+xajTgq4PwbLZv91wP29az53HQpiIdOoCFWIYllAHmSxF9uODSvZGcxHOmWOgQwKkBrA+EmOvImsGdxXfEYhEV8MhiwOprBkgkCVPjLbfpM9uN0ehM/Z2M5jhl8SE6pBULDCV+FyTfY7fSuXhAPedOMjRLHwuQhCsy8gggiIjV69pGZ0TWPEF3mZiwJMWm/EVnbKjDeCvhcRoI2KgkG/USNv0iqyqaROzKbL9mOgDDxBxOpSZZSxJHi5W5gi0CtBw6HByuGTLpcDwlYUqf2I7EEUv3LjnUOzMh9J0n7Ct5Xj0c115ds62RzIRCjLqBMxxQYOKVDabBrEdv8NZsJV0lmZljfVMCdiWFo+ta0RSliCRuSZvPbcRJqaqVpUxVJGdcNuBbrWzIGNXUDrv2piwu7Wnv03HFJxFAM+hpeXksK8HGM2LicKRN+LSbiL9ayZnNDDKalEHUoIBbSQNRJG4G425pGptxt/zxRpnGgb8b/ePtWLTXR0Kpa0dl8R2fV4VDAHSQWOwkSDG4JmNjT8fFgami/MAne89ois+AyqsqBM2GwHpQsoHieLzYibcg3pPUNZXZkziszkQyowIDoYKgqdhfmLkViwMBcLACu7tFy2qWLgyNJjxAm0R/Bo2VsIFlcDDBJAcNiMTq8IEETeABfYUOTypZ1xX0vqUlpBIRth7tZhAQYm5PNQk2y6aSMWdDuMPFh4XWvuzAbxL4iV6FFBI3mDO9P8AZMLh6SniQxoYQQhY6DeZlfTYxXUwyBYTojTpOyRa0+VIxsJfCdYVVuf7lLTBvbxAX8+tXM/ZLvroHO5ZNBhRNxA5JFY8D2kulGLqlypEfqFjfi9MzGYSAzOAl9LXAJNvrXnM17MVnVFd/dkkuCSJYyRH/FKn30OV12esbNgLKQQSBA2F77z1rJnfZC4r63CkxAkAgWgHqSDt0k9a53sjHfDwCuGshWYeMeKJn1FdjIh3QuZteSNMDp504abxk3qWoTlsimEYw1CqJJJXUQlyUw4vIJNr2FdFHRwGRgyE8ndbCY/yLSL0vFR5k+GZUg2nxCWjqAG9aiZNNYcSslgdBYBidmZRAmOT+IbloU1Lemge7TUwIZ9wBz/d5dzXls7OFnUzDoUwswNLQTAePCzTv+kwR1rvey8sqM41DSQFi6ywkSFJIIO5NthWb/U+UbEwvdLhl2c2KgnQVMhrbbRJ4J32qWmUmjopnBq92xGvkSYC6ZBW0SSJidqPM4w92R3EeKbelcD/AE37Rhv6bHRUxkWD4YOKonSwPXeetejwsEaGsYkQBA56fTaiHjFyLyl4ctSx2ik5kHQdF3JCgyIBkSQDvAmuliYahyAfCDv/ABaqzmXgCIMiARe9/oP+a35aeYjm4YXyJyaQoVB4CSQBpW5JN1idjAj60Bc8LWzLLpPiB6n0F+9oosrho2ohR8QnUdlngjb/AKqeOlKZfNDpoz5PLgkly1hbSJg9x5VmzDagwIJN4VDciJGoGI53tauvm9YYaSNyIHFh03IP81ykwAcQu0O5ADEzBAYsjRJuJIvSq2/RUcaldiDlCOhsLlze3lVUnMoUdlVMQgEwQVvN+WmpU+VfZf45+jVk8qGkSApmSxgeIkkDv4iP+qXlxh+8xBiuv/3ApfxwMJAh0bi7N6npJ14QgFWBF5H9rREgHmuScivvVxQpbEABBYmCVkSwvLAAC/zdqfLOPpEcVeS1vs9Ng44GHOGRJANxuveef85rkZxmgubkMGMXNmGoxzaaZgs/ilp1GRYDSvCW386OR0rfjT8ezn5qXliCSGG89CDYjqDTFYday+7AMrY8/KfMfyL0wYy7EBTBJ7gbleo/Iq317Ml36NqYgVDpI8VjNwByY8prm5DC+Nw5h2uggAEIFkRzEeR8q2YWGCdIIkjVEwY6kcCp7vRYiNzH+4yfU1z1HlWpnXF+E5SMr4hLGb6iLbMIX9Xe/b4qe2IUR2IZpAt8WmPlmP5NQODci/rTRinp9aJ4qXbHXPL6MOU9olxfDKKRJYm2q0KizJFyP/U2reqz0PnWdlkAE7fXmbU4oukgwZjcfzRPkk9FTltYUcwJUEqJ/uE6uABzzTcbAlRef8NcjN4eGzAums6wAYA0naeJvHWtuYc4eCQGLDTyzCYHi2PMTbpao1tdmilS1gjNI5xQEY+FYkzo1tBYFdiQOnzEVsQ6UURBAG3BA61j9kYhXBAcHDeS2gRziE2ZtviAj81vbDJO561fElrI53WJIXqnc1m9o4HvFYAwChUwLnoJkWmbd6DM4wVh8WkiSRwom4G5uB5C9q34TrKho0sQA09eTJ71VOaWGfGql6cvBys4aIV1AaiCSdRCsQpIKjSIFvpWfCyCGQ5I0sSu7Q2+4710/amYOErObgWUcsSYUDrJgVgyGXxERQ7+LxM3hBEsSSJO8T2qfxGv5kv4acrkkCM+ogN4mnYRuZNhauhh4IZUB2BLEBiAWHwnv/xSA6qmp5IuCbRBExA/20asNAJDCSGKk7EbRewsLVHi08LVpz5GwYoUAsQCAQW2BJF4BmPvXP1kC1Fi4mrellu1dES0uzj5eRVWorWeReujlJUGCJImQd97Edp371gLCKbg4OpWbUo0jY2LeXpTqdQotzWpGD2z7LGYUEEJiISUxBbS0zHdTA/ekeyv9TBSMPMH3WKlmB0hcToQWEAGJmea6GomsXtD2OmYAGrTiJdHAkgi8eRrJ8fitOiebypLDX/86gVgrgEg6gi6gsCLFFMzO8jmjPtBgC3umWWhSSNCqFAlkWTc3uBEiSK4GLmsYt7jHf3eOsaGE+7xlFiSAQG4kbwNtxXX9nKiIHDIuqPGSu8TAPOomfp51g6Z0KZaNfsvPK2GHOpdbBQSukRuCNdmHQgc83recCIMklpMwAYtbSLcTNcdPaiBMMM5cmTCAMqh2hQz7JJkC8GK6+CxJ0usEGCAwaFuAQe4H70J/DBpIzJmZXXJAIPhI/VMSD0gzWbBwwsFSQQI3O3T/OtOz6hWgNI3v3nesrPI7V0RwrNZycnO08QxnHWpSPdjpUrbxn6MPyV9sfls8G1nwkgwbWkqOu+88Un3gFgKFMNVUKosNh/n71am1hUccYv2K5eROv1DGJG9MxQViREiR5GllT1q2E7ma1MtCRx9KV7XwVxEVPEGAlZnSTI8VtoBMedOEAbVLHg1Fz5ThpxWprWZctliNDO5b5hqDKDMEwxkeEkx2611HJ0xuZ3gRArMmF/60boPm+lZcfE5es25OZVOIjNHSrDyIpZWLxTdbG4AFbnNodlHw1NQ30+poU4maT7S9o4IYqoYiAQIJmPi0x0t6GsqqZ9m0RVdo0Ml9oIPp60j2jiq7rhiQNQadxKjUik7SSNUdF70nK504qa8NWhjdnAgGb2uWIjyvvT8JNKmJP6ptJa5PkTtaLVlXfpHRGr/AE+xiYSzJErMif0hokD0puYdRJUwom5PHE1nbCmT4hJmzsZsP0mw8hVHCuLExyxJ9BsK1iVhly2/LNBbBDgGIBmDcETYkcg3NZ8h7Iwk1BGDksZRlDQsnUoY+a+ldNCBuBAggd5EfmkLm1QHwsDJ0goTqvBIixnffzjjK0pZrFeSMOdyaPmcJEVQVOsmNI0wVURySxt/tNdDEwypINiN65Xs72jil2zjoSj6V0WLBFYjDdADJuWJHe011c3msEwyOhkmRq2v0NxeavjvXhly8bS0PDwGZSZEDg9e1LwkDMNTQDzv5U/LZpLq7DSRGmRdjEWmfSozFHYadNl0k/qn4oa8XnvTqlLYRDpL6E42FoJBv0I2I6ika5G0eddHMuSlydwI5MDpzWJMExqCkgb/AIq5rVrM7jKxC0XyoGe9gfoLVvxcBHUMlo+JDuOJHUU1fZ/iEkFYm1vpR5oHxVuHLCT19a6Xs7FULoIF7z1tsf4pGZypQmPhtB6ztSBfam0qkmXUUK/1B7OTMroaFcEsj8obeI9UNpHp1ryfstzilkY6nw3gspkgyE8S7OoK2P8Adxee17TzeNpfSFFsRCLl2Hi0G4gfDJHPpVZz2OrBXRvd4iqoR0uFUKAUIPxoTe9cjhvo71cpadpgSpTQmgCBEgiBIjtNXlsUosvGqAD1JgST3se1ebwfaWKMyExA4AQghElMVQZ1qCZBHQSd966+TzGE8qWKePQA8gqDtq1cncA8EW6kyt7Cqfj+p0cHCV1Bu5Yn4YtYmG6VWFhJBUkh1vEdthwTVo4TE0IAVvr1WCEcGAZJ3gcb8VobHDMfEDZRIuYizdOTtarq2n0zKeKWv2Rj92o3xMMHoZkedqldVUbkD6/9VKPOvsf4o+jziORMkXogs1EQdKMtbius84FgBzNRT2osNJ4rQqwOKTZSWgAGOKtGPBo5EXF6HDMDijQ9BOpP/NMTKjc2rMznipqajGPV8mooJtQARsaU5PLUI86EgbHTNvx/NYsbAY2WBBZrgXJm3letS4R3O1MRKyvjVG3Hy1KzBOTwtKCSuo2twATY996eDFr0xgBUDXBkAinM+M4K68q1gvhsJttueBT0ybaSWsQJE8+nNPGGH0AmROqDJkgyCBtYxTHYhi2omZnV+nta2wFZvlfo3ngl96YE1KTwd7zYiYnt1rF/qJicPwGGdlQECJ1ysEdBqJ+nNdD2pq+NVkGBbn1riHEOLipAhEYgk2PvChi3QCb9WHSnSmkmyZdS2kjorgBVVVEDDCjwxcLAE9RH7mjZya05fBCkhhqBgSD3/wA9KS6r4gBdSADqu/XwgRyBvVS5TxE0rqdYgou2lfqon6WosHKaiAjPIMwCSCI2gzS9E8U7L4jI2pTB29aqp1ERblomYxTrgq1uYJvzIA8P1o3zGIi+GCpIOs+FYIBIAaNUxE96BMQ69RO5knvTMTMlvAQTcAyOVAYEnzrHk1TiNuLKp0/Y5DC6hDWAHXfkztsaTjYZBL+9J2OwBHWIENbgj60vEaLEjuBtfe1L0wpZVETB2F6S43S0t80y2h2axPCIIv5cWExWIqeTQ6jN6YD0FdEz4rDkuvKtBD9ATQ+y0hIeAUlALwdPw34OnQftUdjPHlSPaKOIZIuugkfHzp0g73J+1Tf6rSuL9qxg+0cvh4vuw0iWkCYdCUaGB4af8NZMw+Ll3VHcsCDKhkVcdFAsCBK4gBupMEbdKRkMlpVVZySzANddOpdROwHExN5H1rs53IJiIRBJKfrM6SLjSdxfnesNdadXUYIy2VcFWTH0I3hGFAKajJMKRIsCSFI5jv1sDMMgHvUClgDqUFlQ/wBy/EORIkeVcxMxi4BDOrYyKLQRrE28SfrIXkQbmx3GjKe10fSiMMRxc6QdJJBGojcAedqzbw1zTu5XOYZRSzqSRcqCVPkeRVUjDXCIGpFLRc6Bc/WalPH9h19HFK9SaZhhRvSQwo16xXeeShrYwiB+1AGZuaDSSaYmGBzQPsouetFq61C82sKIpbrQLCtfah0k0wM0RpoGYzcxQMJEBO9aFULtBrMD0E0wSBwKQ0PVySAq36VTof1nnbpQYbkEMCZGxq2BYksb7zzSwry6NeXyDOpYCRMb70rMYQRipFx9aHBzBUEBiAehoGckkkT35pLd7KbnOvYxMwwHaImryzgsSxv1n086zHYzEHg80BwvCWZ9LfESpgAgHk8djaseSdeo34bSWNmj2hnnVdAAbXKIflIE6nSeBJtvHFqw5b2ciBt3bQDJEnXrY61Zp03YE8X24oPZuIzl3bWwQFUcrAKaiphdyx0hiTxpHFdXFxNhBHhEzbV3gW9KlSq6RbtzrfoxPh4jBNTQgXEBRIVhquomSCYtaAJnitmFjRBv4QsN83BVuD/xSMQDvMEb9f8ABVBjF+/qdzVri7M3zLP6UcW5367U9MAshfUqxIg7k+QpEjrVBa2a6OZPvtFJq5pg72penr+9Rd6A0IxwaEyOa0ZvETSulSGA8Xc1nDjkRQga/pWuoPKqmrVyKoktcOo0cgHY36jY+dQyaGO9JpNYwTx6hSYSgyqgWi3AkmPuaPaj0jrVMYpJJeh1dV7BxDq7HhoBgHes2Nk0LjET/wAbzBdAPFI2dYgiQPzT9R7CqBqK4lRrHO59g4eOyDScLDYiZZXKqSTMhTtvUrTh5tgAAdu1XUfhZr/6Ec8uTsKaoc70zFy7KFYghW2tY1qbFQ4SqFOubt2/nj0rffo5FOezIE6m9EEFpP8ANV7oDdr9BQ6PlBpiGMw/SPrRqzdaFV+lUG4JoGgy3UmorD6+tAoJNgTTAjdIpYGlHFO0D0okRj5VCsXkUQxCewo/4Nf0a2kbtPlSmYcUJq1k2ApD3Q1Q9O1avduoBI32HPpWmPdoGMRaxIADctqJiKwZzPhcRQ8C3xWLGfhsCCZI0iAb/fGuVJnTPA89gMZ3rE5DvpglFu1/iebL5C5I6x0NdXNYL4i6j4djpUgswI3JFh9JPesuFh6QAFsOKuaVIyqHFAotyVETzPT+bU10JuTRl+1LZGNUkkKm2Kjzq9Hb1pgQ828zQtVGWAFT1ownVqWSKkztTHpbAdKmuqjtVx2oEC7UGmmMP8iqdNQgkR6UtHn2L1iYuTVEnpTDFWFPAFMnUCmJO49KIrPFWMLmqY9TQMEJF6D3oq3fyoACaMFoxnFVq6CrWIqi3lQIq/WqqpPzCrp4AwuWVQz2XYHik6xx+9IUjhTVz2pYHkaNa83qDG6WpWnqDRkdooH2SeYNGrHYAUKsvNNBFoIF/Slo0tIqtO9OwstqmCTFzEmBQ4pVSQCGj9Q2NFlcyyzptqEHa/rQ9zoaxPsXqA2vRhqAkciKtnHApgN1dYp2WggzvuN79o/zek5ZCzKogSYk10c3kCqzqBaYgVnTXo0hP/RnzJJW8Rax89gPpWE5JHVveTJJEncXGnSTdbQLWM1oXCbzoipAvasa4f6dE87+UV7OCrBVdICkLckQfPaKN3kn+KpUEVsTKnSpCg67CD96uV4kXTt9GNStRn+lbMLJkuUMAi56etBnssUMWvVeSbwz8WlpjZJpLIKezE7mkstWiWCCBxRozNZV9BNqDUaflMyyEsLEiLim/XRK99mcvTsrmArBiAQNx1pLKSZ5qFDQTrT1Ds3j62LABQeBSCtDqoh5UJZ6G229YDGmM66AunxTOuTcdIqmFBNPNFuFNJ5jtQCj+tUEoFpCB3pZYdZ8r/tTXQne/agoALT3igYVRnpVq3agCqlFqHUVdAjNqp2EhPMUjDcLuAfWrbNk2EDyoEs+TboC7tH70Bxl7msYk0xV70YPRpYHiqB8qERRBl6UAEGq57VUngUxZFjAo0eFojcLTVQjgUjWetGgng0FLB4B6gUZZvmFJUgVpwipIDfDyRvHaoZSQKM3U1C4m5Nasb3IwzpksTbsJ/Fc9QaE9KfXR0c4MEKApJbr/wB1kwsYi4MRtSzaprNCkHWj0x2B1aoNDiYjMZJmk6qIITxTxInW+iie9ASOb0w4YG7ClMRwZpoT6Iz9KisT3qtNULc0C0vQfKo471ZcHck0JamHQKAzRkmgJNCTQLS271FI4FVr7VNfQUCJiHyoEYiiM9KHX5UBoTE80BaoHqmQHvQBXEzUHXerE7CBVJhlmCzJJA6C/U0mC/hXh+WpQZoMjsvhMGLNUo1FYxCg8j70YaOlZxivG0eQEVY1VRiaPf1NZNAit0p4wz+ogUD7BRSabojdqWzDiTQqewoGaUzAHAqmeTSwKNRzSK1hBugpg1HrQK8bVZcnk0DHJhHsPrRgAbsPpWWiWlg0xxccU0YtopKYZO1af6JtOqCRtIpPPkpa/QgAnYVCsbmnhCsh4XsQZPpWZwaaYmsL19KouaGDU1UydCKHk1NA60snzoaBjDHU0JoziyoWFEcgXPmamkck0B0dDLLgBNTN4r+EbzxXPLVCwHFDr6UkhutLg9YoHJ5vU3qwo6GmIpXHSq1VZMcCr952oEAW86FiKIljU90eYoAW2Io3NKfGj4VJ+w+9aNSjz8qW7A0CZEfqIomxQBQR3qwVEzPaI3oAH3napVe9HepQSZERzwaOw3P80g6zufvRLgnzqiRzY6jY/aoHB6mrVI4FEJ7Uii0B6D60ZY9B6UAPU1NQ60ANDgd6sEm4FImTvbpFMBPE0hob9DUDmg1GoDQA5XHSfrRjFPAApI8qJQaB6OOMetaR7QYJoBhfv61mVByatmA4+ppNJlKmvkjOTf7m9AXNU2ITQyaYtLvV1FIm5ntUa5sPpQATIIF78jp+aERzFEME82oWAFADkccAedUVPzClInarJH/VLB6UVPnViOY9aHVv360zDXhVWfK/rR2HQTT2oC080WPlnUwwIPSkkEUIH0FAqmxKGTQE0xBHENAzHrUqytAgaiAef+b1Rft9qjOOKBFlKUygbn0q2JodPcUxaSV+U+oqVNA+apSGCuQxfk//AEv5ov6LF6H1X81KlGiSRY9nP8v3H5o/6DE6H1X81KlLWPxRS5LE+T1K/mjGQxPl+6/mpUo1hiCGTf5fuPzRjJ4nT7j81KlMeFrkn5X7j80wZTE4X7r+alSkNJEGTf5fuPzR/wBIw4/b81dSgeIE5V/l+4/NT+kflfuPzV1KWjSRX9K/C/cfmrGRxOR9x+alSmGIsZJ/l+4/NEMFxwY8xP71KlAYgXyryYUx3Kz+9JGUcn4ewuPXepUqW30NJdjky2IJgRO9xf71QyT/AC/cfmrqVQsREyjEwFknuB/NbRhrogYbDEjfUIkHzqVKllLo0pmREtgam5JYHYd6yZkB5PudJ/tYARFredSpSS7Lb6MRyWJ0+4/NWMm3y/cfmpUqjLEC2UfhY+q/mlvlH6H1H5qVKQYhRymJ8v3H5qf0T/L9x+alSqROIn9G3y/cfmqOWf5PuPzUqUxYgP6XE+T7r+alSpS1hh//2Q==" />
            </Image>
            <ProductInfo>
              <div>{review.brand}</div>
              <div>{review.product}</div>
              <div>
                {starArr.map((star, idx) => {
                  return (
                    <span key={idx}>
                      <FontAwesomeIcon
                        icon={faStar}
                        color={star ? "#FFDAB9" : "gray"}
                      />
                    </span>
                  );
                })}
              </div>
            </ProductInfo>
          </Group>
          <Group>
            <KeywordsBox>
              {review.keywords.map((keyword, idx) => {
                return <button key={idx}>{keyword}</button>;
              })}
            </KeywordsBox>
          </Group>
          <Group>
            <Motivation>
              <div>구매동기</div>
              <div>{review.motivation}</div>
              <div
                onClick={handleSeeMore}
                style={{ width: "50px", cursor: "pointer" }}
              >
                <span>더보기</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </Motivation>
          </Group>
          <HiddenGroup ref={showGroup}>
            <Group>
              <Adventages>
                <div>장점</div>
                <div>{review.adventages}</div>
              </Adventages>
            </Group>
            <Group>
              <DisAdventages>
                <div>아쉬운점</div>
                <div>{review.disadventages}</div>
              </DisAdventages>
            </Group>
          </HiddenGroup>
          <Group>
            <LikeButton onClick={onClickLike}>
              <span>좋아요</span>
            </LikeButton>
          </Group>
        </ReviewInfo>
        <Eval>
          <div>
            <FontAwesomeIcon icon={faEye} />
            <span>0</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{like ? 1 : 0}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faCommentAlt} />
            <span>0</span>
          </div>
        </Eval>
      </ReviewBox>
    </>
  );
};

export default ItemReview;

const ReviewBox = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  overflow: hidden;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 15px;
    object-fit: cover;
  }
`;

const ReviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: max-content;
  padding: 15px;
  box-sizing: border-box;
`;

const Group = styled.div`
  display: flex;
`;

const HiddenGroup = styled.div`
  display: none;
  flex-direction: column;
  gap: 15px;
`;

const Category = styled.button`
  font-weight: bold;
  cursor: pointer;
`;

const Image = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  margin-left: 15px;
  div {
    margin-bottom: 5px;
    &:first-child {
      font-size: 12px;
      color: gray;
    }

    &:nth-child(2) {
      font-weight: bold;
    }
  }
`;

const KeywordsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Motivation = styled.div`
  width: 100%;
  div {
    // 구매동기
    &:first-child {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    // 구매동기 입력란
    &:nth-child(2) {
      font-size: 12px;
      color: gray;
      margin-bottom: 5px;
    }

    // 더보기
    &:last-child {
      font-size: 12px;
      font-weight: bold;
      margin-top: 15px;
    }
  }
`;

const Adventages = styled.div`
  width: 100%;
  div {
    // 장점
    &:first-child {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    // 장점 입력란
    &:last-child {
      font-size: 12px;
      color: gray;
    }
  }
`;

const DisAdventages = styled(Adventages)`
  div {
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const LikeButton = styled.button`
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  background-color: #f0ecfc;
  background-image: linear-gradient(315deg, #f0ecfc 0%, #c797eb 74%);
  line-height: 42px;
  padding: 0;
  border: none;

  span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  &:before,
  &:after {
    position: absolute;
    content: "";
    right: 0;
    bottom: 0;
    background: #c797eb;
    /*box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.5),
    inset 4px 4px 6px 0 rgba(116, 125, 136, .3);*/
    transition: all 0.3s ease;
  }

  &:before {
    height: 0%;
    width: 2px;
  }

  &:after {
    width: 0%;
    height: 2px;
  }

  &:hover:before {
    height: 100%;
  }

  &:hover:after {
    width: 100%;
  }

  &:hover {
    background: transparent;
  }

  & span:hover {
    color: #c797eb;
  }

  & span:before,
  & span:after {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    background: #c797eb;
    /*box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.5),
    inset 4px 4px 6px 0 rgba(116, 125, 136, .3);*/
    transition: all 0.3s ease;
  }

  & span:before {
    width: 2px;
    height: 0%;
  }

  & span:after {
    height: 2px;
    width: 0%;
  }

  & span:hover:before {
    height: 100%;
  }

  & span:hover:after {
    width: 100%;
  }
`;

const Eval = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  div {
    margin-right: 30px;

    svg {
      margin-right: 10px;
    }
  }
`;

/* label 글자 일정 수 넘으면 ... 표시
const Label = styled.label`
  display: inline-block;
  font-size: 0.8rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
*/
