/* ===================================
dashboard.js
SHORTIFY DASHBOARD LOGIC
=================================== */

// =============================
// CONFIG
// =============================

const BASE_URL =
window.location.origin;

// =============================
// GENERATE RANDOM CODE
// =============================

function generateRandomCode(length = 6){


const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

let result = "";

for(let i = 0; i < length; i++){

    result += chars.charAt(
        Math.floor(
            Math.random() * chars.length
        )
    );

}

return result;


}

// =============================
// VALIDATE URL
// =============================

function validateURL(url){


try{

    new URL(url);

    return true;

}
catch{

    return false;

}


}

// =============================
// AUTO HTTPS
// =============================

function formatURL(url){


url = url.trim();

if(
    !url.startsWith("http://") &&
    !url.startsWith("https://")
){

    url =
    "https://" + url;

}

return url;


}

// =============================
// CREATE SHORT URL
// =============================

async function createShortURL(){
const {
    data:{user}
} =
await supabaseClient
.auth
.getUser();

console.log("USER =", user);


let longUrl =
document.getElementById(
    "longUrl"
).value;

let customCode =
document.getElementById(
    "customCode"
).value.trim();

const password =
document.getElementById(
    "password"
).value.trim();

const expiryDate =
document.getElementById(
    "expiryDate"
).value;

longUrl =
formatURL(longUrl);

if(!validateURL(longUrl)){

    alert(
        "Please enter a valid URL"
    );

    return;

}

if(!customCode){

    customCode =
    generateRandomCode();

}
const { data: existing } =
await supabaseClient
.from("urls")
.select("id")
.eq("custom_code", customCode)
.maybeSingle();

if(existing){
    alert("Custom code already exists. Try another one.");
    return;
}

const shortUrl =
`${BASE_URL}/redirect.html?code=${customCode}`;

try{

    const {
        data:{user}
    } =
    await supabaseClient
    .auth
    .getUser();

    console.log({
        user_id:user?.id,
        long_url:longUrl,
        custom_code:customCode,
        short_url:shortUrl,
        password,
        expiryDate
    });

 const { data: profile } =
await supabaseClient
.from("users")
.select("username")
.eq("id", user.id)
.single();

const { error } =
await supabaseClient
.from("urls")
.insert([{
    user_id: user.id,
    username: profile.username,
    long_url: longUrl,
    custom_code: customCode,
    short_url: shortUrl,
    password: password || null,
    expiry_date: expiryDate || null
}]);

    if(error){

        console.error(error);

        alert(
            error.message
        );

        return;

    }

    alert(
        "Short URL Created Successfully"
    );

    loadURLs();

    clearForm();

}
catch(err){

    console.error(err);

    alert(
        "Something went wrong"
    );

}


}

// =============================
// CLEAR FORM
// =============================

function clearForm(){


document.getElementById(
    "longUrl"
).value = "";

document.getElementById(
    "customCode"
).value = "";

document.getElementById(
    "password"
).value = "";

document.getElementById(
    "expiryDate"
).value = "";


}

// =============================
// LOAD URLS
// =============================

async function loadURLs(){


const table =
document.getElementById(
    "urlTable"
);

table.innerHTML = "";

try{

    const {
        data:{user}
    } =
    await supabaseClient
    .auth
    .getUser();

    const { data, error } =
    await supabaseClient
    .from("urls")
    .select("*")
    .eq("user_id",user.id)
    .order(
        "created_at",
        { ascending:false }
    );

    if(error){

        console.error(error);

        return;

    }

    data.forEach(url=>{

    let status =
`<span class="badge badge-active">
Active
</span>`;

        if(
            url.expiry_date &&
            new Date() >
            new Date(url.expiry_date)
        ){

            status =
`<span class="badge badge-expired">
Expired
</span>`;

        }

        table.innerHTML += `

        <tr>

        <td>
    shortify/${url.custom_code}
</td>
            <td>
                ${url.long_url}
            </td>

            <td>
                ${status}
            </td>

            <td>
                ${url.clicks || 0}
            </td>

            <td>

                <button
                class="action-btn copy-btn"
                onclick="copyURL(
                '${url.short_url}'
                )">

                Copy

                </button>

                <button
                class="action-btn delete-btn"
                  onclick="deleteURL('${url.id}')">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

    updateAnalytics(
        data
    );

}
catch(err){

    console.error(err);

}


}

// =============================
// COPY URL
// =============================

function copyURL(url){


navigator.clipboard
.writeText(url);

alert(
    "URL Copied"
);


}

// =============================
// DELETE URL
// =============================

async function deleteURL(id){


const confirmDelete =
confirm(
    "Delete this URL?"
);

if(!confirmDelete)
return;

const { error } =
await supabaseClient
.from("urls")
.delete()
.eq("id",id);

if(error){

    alert(
        error.message
    );

    return;

}

loadURLs();


}

// =============================
// ANALYTICS
// =============================

function updateAnalytics(data){


const total =
data.length;

let active = 0;

let expired = 0;

let protectedLinks = 0;

data.forEach(item=>{

    if(item.password){

        protectedLinks++;

    }

    if(
        item.expiry_date &&
        new Date() >
        new Date(item.expiry_date)
    ){

        expired++;

    }
    else{

        active++;

    }

});

document.getElementById(
    "totalUrls"
).textContent =
total;

document.getElementById(
    "activeUrls"
).textContent =
active;

document.getElementById(
    "expiredUrls"
).textContent =
expired;

document.getElementById(
    "protectedUrls"
).textContent =
protectedLinks;


}

// =============================
// LOGOUT
// =============================

async function logout(){


await supabaseClient
.auth
.signOut();

window.location =
"login.html";


}

// =============================
// INIT
// =============================

document
.addEventListener(
"DOMContentLoaded",
()=>{


loadURLs();

const generateBtn =
document.querySelector(
    ".generate-btn"
);

if(generateBtn){

    generateBtn
    .addEventListener(
        "click",
        createShortURL
    );

}


});
