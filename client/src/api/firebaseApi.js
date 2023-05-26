import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { storageService } from "../firebase";

// firebase 에서 이미지 불러오기
export const loadProfileImg = async (user) => {
  if (user.profileImg) {
    const fileRef = ref(storageService, `${user._id}/${user.profileImg}`);
    const attachmentUrl = await getDownloadURL(fileRef);

    return attachmentUrl;
  }
};
