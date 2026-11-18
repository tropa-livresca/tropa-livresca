import pb from "./pocketbase.js";

export async function loginComGoogle() {
  try {
    const authData = await pb.collection("users").authWithOAuth2({
      provider: "google",
    });

    return authData;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
}
