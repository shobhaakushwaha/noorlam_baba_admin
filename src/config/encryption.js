 
import CryptoJS from "crypto-js";
 
const FIXED_KEY =
  import.meta.env.VITE_ENCRYPTION_FIXED_KEY ||
  import.meta.env.VITE_CRYPTO_SECRET_KEY;
const FIXED_IV = import.meta.env.VITE_ENCRYPTION_FIXED_IV;
export const isEncryptionEnabled =
  String(import.meta.env.VITE_ENCRYPTION_STATUS).toLowerCase() === "true";

const validateCryptoConfig = () => {
  if (!FIXED_KEY || !FIXED_IV) {
    throw new Error("Encryption key or IV is missing");
  }
};
 
export const encryptData = (text) => {
  try {
    validateCryptoConfig();
    const key = CryptoJS.enc.Utf8.parse(FIXED_KEY);
    const iv = CryptoJS.enc.Utf8.parse(FIXED_IV);
 
    const textToEncrypt =
      typeof text === "string" ? text : JSON.stringify(text);
 
    const encrypted = CryptoJS.AES.encrypt(textToEncrypt, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
 

    // Method 2: Clean the standard toString() output
    return encrypted.toString().replace(/\s+/g, "");
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};
 
export const decryptData = (cipherText) => {
  try {
    if (!cipherText || typeof cipherText !== "string") {
      return null;
    }
 
    validateCryptoConfig();

    // Clean the cipher text by removing any whitespace
    const cleanedCipherText = cipherText.replace(/\s+/g, "");
 
    const key = CryptoJS.enc.Utf8.parse(FIXED_KEY);
    const iv = CryptoJS.enc.Utf8.parse(FIXED_IV);
 
    const decrypted = CryptoJS.AES.decrypt(cleanedCipherText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
 
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
 
    if (!decryptedText) {
      console.error("Decryption failed - empty result");
      return null;
    }
 
    try {
      return JSON.parse(decryptedText);
    } catch (parseError) {
      return decryptedText;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
 
export function queryStringToJSON(query) {
  if (!query) return {};
  return Object.fromEntries(new URLSearchParams(query));
}
 
 
