const CryptoJS = require('crypto-js');

const secretKey = '4Pz+k9qSJBujdyz8Wk+TtN1jbZeesp2vRCbzgdehkt4='; // Should match the key used for decryption

function encrypt(data) {
    const key = CryptoJS.enc.Base64.parse(secretKey);
    const encryptedData = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB, // Use the same mode as in Java
        padding: CryptoJS.pad.Pkcs7, // Use the same padding mode as in Java
    });

    return encryptedData.toString();
}

const plaintextData = 'sensitive data';
const encryptedData = encrypt(plaintextData);
console.log('Encrypted Data: ' + encryptedData);