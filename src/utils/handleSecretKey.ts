import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

export const encryptMnemonic = (mnemonic: string, password: string): string => {
	return CryptoJS.AES.encrypt(mnemonic, password).toString();
};

export const decryptMnemonic = (
	encryptedMnemonic: string,
	password: string
): string | null => {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
		const decryptedMnemonic = bytes.toString(CryptoJS.enc.Utf8);
		return decryptedMnemonic;
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
