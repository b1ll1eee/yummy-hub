import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl,secretKey } from "../../env/utils";
import { LoginUser } from "../../Model/User";
import CryptoJS from "crypto-js";

function encrypt(data:string) {
    const key = CryptoJS.enc.Base64.parse(secretKey);
    const encryptedData = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encryptedData.toString();
}

const userLoginMFA = createAsyncThunk('login', async (user:LoginUser) => {
    
    const encryptedUsername = encrypt(user.userId);
    const encryptedPassword = encrypt(user.password);

    const data = {
        username:encryptedUsername,
        password:encryptedPassword,
        secretcode:user.secretcode
    }
    
    // console.log(data);
    
    const response = await axios.post(`${baseUrl}/login/totp`, data);
    return response.data;
});

export { userLoginMFA }