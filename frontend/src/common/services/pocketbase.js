import PocketBase from "pocketbase";

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL;

export const pb = new PocketBase(pocketbaseUrl);

export default pb;
