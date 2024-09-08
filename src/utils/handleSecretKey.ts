import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

export const encryptData = (data: string, password: string): string => {
	return CryptoJS.AES.encrypt(data, password).toString();
};

export const decryptData = (
	encryptedData: string,
	password: string
): string | null => {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedData, password);
		const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
		return decryptedData;
	} catch (e) {
		console.error('Decryption failed:', e);
		return null;
	}
};

export const validatePassword = async (
	password: string,
	hash: string
): Promise<boolean> => {
	try {
		const isValid = await bcrypt.compare(password, hash);
		return isValid;
	} catch (err) {
		console.error('Error validating password:', err);
		return false;
	}
};
