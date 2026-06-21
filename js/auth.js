console.log("AUTH LOADED");
console.log("supabaseClient =", typeof supabaseClient);
/* ===================================
SHORTIFY AUTH.JS
Signup + Login + Logout
=================================== */

// =============================
// DOM ELEMENTS
// =============================

const messageBox =
document.getElementById("message");

// =============================
// SHOW MESSAGE
// =============================

function showMessage(message,type){

   
if(!messageBox) return;

messageBox.className =
"message-box " + type;

messageBox.innerHTML =
message;
   

}

// =============================
// SIGNUP
// =============================

async function signup(e){

   
e.preventDefault();

const username =
document.getElementById(
"username"
).value.trim();

const email =
document.getElementById(
"email"
).value.trim();

const password =
document.getElementById(
"password"
).value;

const confirmPassword =
document.getElementById(
"confirmPassword"
).value;

// Validation

if(
    !username ||
    !email ||
    !password
){

    showMessage(
    "All fields are required",
    "error"
    );

    return;
}

if(password.length < 6){

    showMessage(
    "Password must be at least 6 characters",
    "error"
    );

    return;
}

if(
    password !==
    confirmPassword
){

    showMessage(
    "Passwords do not match",
    "error"
    );

    return;
}

try{

    const {
        data,
        error
    } =
    await supabaseClient.auth.signUp({

        email,
        password

    });

    if(error){

        showMessage(
        error.message,
        "error"
        );

        return;
    }

    const user =
    data.user;

    const { error:userError } =
    await supabaseClient
    .from("users")
    .insert([{

        id:user.id,

        username,

        email,

        created_at:
        new Date()

    }]);

    if(userError){

        showMessage(
        userError.message,
        "error"
        );

        return;
    }

    showMessage(

    "Account created successfully. Please verify your email.",

    "success"

    );

    document
    .getElementById(
    "signupForm"
    )
    .reset();

}
catch(err){

    console.error(err);

    showMessage(
    "Something went wrong",
    "error"
    );

}
   

}

// =============================
// LOGIN
// =============================

async function login(e){

   
e.preventDefault();

const email =
document.getElementById(
"email"
).value.trim();

const password =
document.getElementById(
"password"
).value;

try{

    const {
        data,
        error
    } =
    await supabaseClient
    .auth
    .signInWithPassword({

        email,
        password

    });

    if(error){

        showMessage(
        error.message,
        "error"
        );

        return;
    }

    const user =
    data.user;

    // Get User Profile

    const {
        data:profile
    } =
    await supabaseClient
    .from("users")
    .select("*")
    .eq("id",user.id)
    .single();

    // Login History

    await supabaseClient
    .from("login_history")
    .insert([{

        user_id:user.id,

        username:
        profile.username,

        login_time:
        new Date()

    }]);

    showMessage(
    "Login Successful",
    "success"
    );

    setTimeout(()=>{
window.location.href =
"/dashboard.html";

    },1000);

}
catch(err){

    console.error(err);

    showMessage(
    "Something went wrong",
    "error"
    );

}
   

}

// =============================
// LOGOUT
// =============================

async function logout(){

   
const confirmLogout =
confirm(
"Are you sure you want to logout?"
);

if(!confirmLogout)
return;

await supabaseClient
.auth
.signOut();

window.location.href =
"/login.html";
   

}

// =============================
// CHECK SESSION
// =============================

async function checkSession(){

   
const {
    data:{session}
} =
await supabaseClient
.auth
.getSession();

return session;
   

}

// =============================
// PROTECT DASHBOARD
// =============================

async function protectDashboard(){

   
const session =
await checkSession();

if(!session){

    window.location =
    "login.html";

}
   

}

// =============================
// GET CURRENT USER
// =============================

async function getCurrentUser(){

   
const {
    data:{user}
} =
await supabaseClient
.auth
.getUser();

return user;
   

}

// =============================
// AUTO DETECT PAGE
// =============================

document.addEventListener(
"DOMContentLoaded",
()=>{

   
const signupForm =
document.getElementById(
"signupForm"
);

const loginForm =
document.getElementById(
"loginForm"
);

if(signupForm){

    signupForm.addEventListener(
    "submit",
    signup
    );

}

if(loginForm){

    loginForm.addEventListener(
    "submit",
    login
    );

}
   

});
