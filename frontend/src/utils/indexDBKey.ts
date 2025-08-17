import { get, set } from 'idb-keyval';
import { generateKeyPairs } from '../utils/generateKeyPair';
import { useAuthStore } from '../store/useAuthStore';
import sodium from 'libsodium-wrappers'

export const checkPrivateKeyAndGenerate = async () => {
    // Try to get from IndexedDB

    // const pKey = await get('privateKey');
    const pKey = localStorage.getItem('privateKey');

    if (pKey) {
        // Hydrate Zustand store with the base64 string from IndexedDB
        useAuthStore.setState({ privateKey: pKey as string });
        return { publicKey: '', privateKey: pKey };
    }

    try {
        const { privateKey, publicKey } = await generateKeyPairs();

        if (!privateKey || !publicKey) {
            return { publicKey: '', privateKey: '' };
        }

        const privateKeyB64 = sodium.to_base64(privateKey);
        // await set('privateKey', privateKeyB64);
        localStorage.setItem('privateKey', privateKeyB64);

        // Save privateKey to Zustand (in-memory)
        useAuthStore.setState({ privateKey });

        return { publicKey, privateKey: privateKeyB64 };

    } catch (error) {
        console.error('Error generating key:', error);

        return { publicKey: '', privateKey: '' };
    }
};
