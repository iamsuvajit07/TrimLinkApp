import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function login({ email, password }) {
    //making call to the database
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw new Error(error.message);
    return data;
}


//
export async function signup({ name, email, password, profile_pic }) {
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;//math.random used if two users have the same name for that situation

    //upload the profile_pic
    const {error: storageError } = await supabase.storage
        .from("profile_pic")
        .upload(fileName, profile_pic);

    if (storageError) throw new Error(storageError.message);

    //Again make an api call
    const { data, error } = await supabase.auth.signUp({//create a new user
        email,
        password,
        options: {
            data: {
                name,
                profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
            },
        },
    });

    if (error) throw new Error(error.message);

    return data;
}


//fetch it from our local storage and show to us
export async function getCurrentUser() {
    const { data: session, error } = await supabase.auth.getSession();
    if (!session.session) return null;

    // const {data, error} = await supabase.auth.getUser();

    if (error) throw new Error(error.message);
    return session.session?.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}