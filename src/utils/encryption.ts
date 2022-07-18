export const AES_ENCRYPTION_SALT = "qaszxswedcvfrtgbnhyujmkik";
import DeviceInfo from "react-native-device-info";
import CryptoJS from "react-native-crypto-js";
import { iv, keyutf } from "./earthid_account";
import { IUser } from "../typings/AccountCreation/IUser";
import { isArray } from "lodash";
export const encrptedEmail = (email: string): string => {
  return CryptoJS.AES.encrypt(
    email.toString().trim(),
    AES_ENCRYPTION_SALT
  ).toString();
};
export const getDeviceId = async () => {
  const deviceToken = await DeviceInfo.getDeviceToken();
  return deviceToken;
};
export const getEncrptedUserDetais = (data: any): string[] => {
  var dataArray = [
    data.fullName,
    data.mobileNumber,
    data.email,
    data.dateOfBirth,
  ];
  return dataArray.map((element) => {
    let encryptedData = CryptoJS.AES.encrypt(element, keyutf, { iv: iv });
    return encryptedData.toString();
  });
};
export const decryption = (encryptedString: string): any => {
  return CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encryptedString) },
    keyutf,
    {
      iv: iv,
    }
  );
};

export const getUserDetails = (response: string[]): IUser => {
  var bytes,
    name,
    mobile,
    email,
    dob = "",
    earthId,
    mobileApproved,
    emailApproved,
    score,
    rewardPoint;
  console.log("response", response);

  let responseArray = response[0].split("<=>%");
  bytes = decryption(responseArray[0]);
  name = bytes.toString(CryptoJS.enc.Utf8);

  bytes = decryption(responseArray[1]);
  mobile = bytes.toString(CryptoJS.enc.Utf8);

  bytes = decryption(responseArray[2]);
  email = bytes.toString(CryptoJS.enc.Utf8);

  earthId = response[1];

  dob = "";

  mobileApproved = parseInt(response[1]) === 1 ? true : false;
  emailApproved = parseInt(response[2]) === 1 ? true : false;
  score = "23";
  rewardPoint = "33";

  return {
    name,
    mobile,
    email,
    dob,
    earthId,
    mobileApproved,
    emailApproved,
    score,
    rewardPoint,
  };
};