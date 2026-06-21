/* ===================================
SHORTIFY REDIRECT.JS
Password Validation
Expiry Validation
Click Tracking
URL Redirect
=================================== */

let currentLink = null;

// =============================
// LOAD SHORT URL
// =============================

async function loadShortURL(){

 
try{

    // Example:
    // https://yourdomain.com/abc123

    const params =
new URLSearchParams(
window.location.search
);

const shortCode =
params.get("code");
    if(!shortCode){

        showNotFound();

        return;
    }

    const {
        data,
        error
    } =
  await supabaseClient
.from("urls")
.select("*")
.eq("custom_code",shortCode)
.single();
    if(error || !data){

        showNotFound();

        return;
    }

    currentLink = data;

    // =====================
    // EXPIRY CHECK
    // =====================

    if(data.expiry_date){

        const expiryDate =
        new Date(
        data.expiry_date
        );

        if(
            new Date() >
            expiryDate
        ){

            showExpired();

            return;
        }

    }

    // =====================
    // PASSWORD CHECK
    // =====================
 // =====================
// PASSWORD CHECK
// =====================

console.log("PASSWORD =", data.password);

if (
    data.password &&
    data.password.trim() !== "" &&
    data.password !== "null"
){

    document
    .getElementById("loadingSection")
    ?.classList.add("hidden");

    document
    .getElementById("passwordSection")
    ?.classList.remove("hidden");

    return;
}


redirectToURL();
return;   

    // =====================
    // DIRECT REDIRECT
    // =====================

}
catch(err){

    console.error(err);

    showNotFound();

}
 

}

// =============================
// VERIFY PASSWORD
// =============================

function verifyPassword(){

 
const enteredPassword =
document
.getElementById(
"linkPassword"
)
.value
.trim();

if(
    enteredPassword !==
    currentLink.password
){

    alert(
    "Incorrect Password"
    );

    return;
}

redirectToURL();
 

}

// =============================
// REDIRECT
// =============================
async function redirectToURL(){

    try{

        const currentClicks =
        currentLink.clicks || 0;

        await supabaseClient
        .from("urls")
        .update({
            clicks: currentClicks + 1
        })
        .eq("id", currentLink.id);

        window.location.replace(
            currentLink.long_url
        );

    }
    catch(err){

        console.error(err);

        window.location.replace(
            currentLink.long_url
        );

    }

}

// =============================
// EXPIRED UI
// =============================

function showExpired(){

 
document
.getElementById(
"loadingSection"
)
.classList.add(
"hidden"
);

document
.getElementById(
"expiredSection"
)
.classList.remove(
"hidden"
);
 

}

// =============================
// NOT FOUND UI
// =============================

function showNotFound(){

 
document
.getElementById(
"loadingSection"
)
.classList.add(
"hidden"
);

document
.getElementById(
"notFoundSection"
)
.classList.remove(
"hidden"
);
 

}

// =============================
// AUTO START
// =============================

document.addEventListener(
"DOMContentLoaded",
()=>{

 
loadShortURL();
 

});
