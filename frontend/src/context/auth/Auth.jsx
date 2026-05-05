import { supabase } from "../../ lib/supabaseClient";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return error.message;
  };

  const signup = async (email, password, telefone, nome) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
            nome,
            telefone,
        },
      },
    });

    if (error) return error.message;



/*    const user = data.user;

    if (user) {
      const { error: errorProfile } = await supabase
        .from("users_profile")
        .insert([
          {
            id: user.id,
            nome,
            telefone,
          },
        ]);

      if (errorProfile) return errorProfile.message;
}*/    
  };

  const signout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
