import sodium from "libsodium-wrappers";

export const generateKeyPairs = async (): Promise<{ publicKey: string; privateKey: string }> => {
  await sodium.ready;
  try {
    const { publicKey, privateKey } = sodium.crypto_box_keypair();


    return {
      publicKey: sodium.to_base64(publicKey),
      privateKey: sodium.to_base64(privateKey),
    };
  } catch (error) {
    console.error("Error generating keypair:", error);
    throw error; 
  }
};
