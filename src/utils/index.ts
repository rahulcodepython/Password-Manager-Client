import * as crypto from 'crypto';

// Original encryption key (less than 32 bytes)
const ENCRYPTION_KEY = "x9#D@r3!Lw2E9vP&j8Qy7zF"; // 23 characters

// Hash the original key to make sure it's 32 bytes
const hashedKey = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

// IV Length (16 bytes for AES)
const IV_LENGTH = 16; // AES block size in bytes

// Function to encrypt the text
export function encrypt(text: string): string {
	const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV (Initialization Vector)
	const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv);
	
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	
	// Combine the IV and the encrypted text to return both
	return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt the text
export function decrypt(encryptedText: string): string {
	const [ivHex, encrypted] = encryptedText.split(':');
	const iv = Buffer.from(ivHex, 'hex');
	const decipher = crypto.createDecipheriv('aes-256-cbc', hashedKey, iv);
	
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	
	return decrypted;
}

// Example usage
// const textToEncrypt = "Hello, world! 1234#@!";
// const encrypted = encrypt(textToEncrypt);
// console.log("Encrypted:", encrypted);
//
// const decrypted = decrypt(encrypted);
// console.log("Decrypted:", decrypted);
