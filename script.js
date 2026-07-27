// =====================================
// Firebase Connection
// =====================================

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { 

getFirestore, 
collection, 
onSnapshot, 
query, 
orderBy,
getDocs,
  addDoc,
serverTimestamp,
  where,
limit

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const firebaseConfig = {

apiKey: "AIzaSyCVdwVvhwDaohSisqWzPirzJr7pGsyVwuc",

authDomain: "ars-prayer-warriors-2.firebaseapp.com",

projectId: "ars-prayer-warriors-2",

storageBucket: "ars-prayer-warriors-2.firebasestorage.app",

messagingSenderId: "65956421710",

appId: "1:65956421710:web:8dd96b64409a289216a31f"

};





const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
// =====================================
// Splash Screen
// =====================================

window.addEventListener("load", () => {

    const splash = document.getElementById("splash-screen");

    if (splash) {

        setTimeout(() => {

            splash.classList.add("hide");

            setTimeout(() => {

                splash.remove();

            }, 800);

        }, 1800);

    }

});





// =====================================
// ARS Prayer Warriors Website Script
// =====================================


window.addEventListener("load", function () {

console.log("Welcome to ARS Prayer Warriors - The Home of Prayer");

});






// =====================================
// Smooth Scrolling
// =====================================


document.querySelectorAll('a[href^="#"]').forEach(link => {


link.addEventListener("click", function(e){


const target = document.querySelector(this.getAttribute("href"));


if(target){


e.preventDefault();


target.scrollIntoView({

behavior:"smooth"

});


}


});


});







// =====================================
// Homepage Only Scroll Reveal Animation
// =====================================


if(document.body.classList.contains("index-page")){


const sections = document.querySelectorAll("section");


const revealSection = () => {


sections.forEach(section => {


const position = section.getBoundingClientRect().top;


if(position < window.innerHeight - 120){


section.classList.add("show-section");


}


});


};



window.addEventListener("scroll", revealSection);


window.addEventListener("load", revealSection);


}
// =====================================
// LIVE ANNOUNCEMENTS ON HOMEPAGE
// =====================================


const announcementsContainer = document.getElementById("latestAnnouncements");


if(announcementsContainer){


const announcementsQuery = query(

collection(db,"announcements"),

orderBy("date","desc")

);



onSnapshot(announcementsQuery,(snapshot)=>{


announcementsContainer.innerHTML = "";



if(snapshot.empty){


announcementsContainer.innerHTML = `

<div class="card">

<h3>
No Announcements Yet
</h3>


<p>
New announcements will appear here automatically.
</p>


</div>

`;


return;


}




snapshot.forEach((doc)=>{


const data = doc.data();



announcementsContainer.innerHTML += `


<div class="card">


<h3>
${data.title}
</h3>


<p>
${data.message}
</p>


<small>
${data.date?.toDate ? data.date.toDate() : data.date}
</small>



</div>


`;



});


});


}






// =====================================
// LIVE SPECIAL PROGRAMS
// =====================================


const programsContainer = document.getElementById("latestPrograms");


if(programsContainer){


onSnapshot(collection(db,"programs"),(snapshot)=>{


programsContainer.innerHTML = "";



if(snapshot.empty){


programsContainer.innerHTML = `

<div class="card">

<h3>
No Upcoming Programs
</h3>


<p>
New special programs will appear here.
</p>


</div>

`;


return;


}




snapshot.forEach((doc)=>{


const data = doc.data();



programsContainer.innerHTML += `

<div class="program-card">

${data.image ? `
<img src="${data.image}" alt="${data.title}" style="width:100%;border-radius:10px;margin-bottom:15px;">
` : ""}

<h3>
${data.title}
</h3>

<p>
${data.date}
</p>

<p>
${data.description}
</p>

</div>

`;



});


});


}
// =====================================
// CHECK PRAYER REQUEST STATUS
// =====================================


const checkButton = document.getElementById("checkStatusBtn");



if(checkButton){



checkButton.addEventListener("click", async()=>{



const phone = document.getElementById("checkPhone").value.trim();


const code = document.getElementById("checkCode").value.trim();


const result = document.getElementById("prayerStatusResult");





if(phone === "" || code === ""){


result.innerHTML = `


<div class="card">


<p>
Please enter your phone number and request code.
</p>


</div>


`;



return;


}






try{



const requests = await getDocs(

collection(db,"prayerRequests")

);



let found = false;





requests.forEach((item)=>{



const data = item.data();




if(

data.contact === phone && 

data.requestCode === code

){



found = true;



result.innerHTML = `


<div class="card">


<h3>
Prayer Request Found
</h3>



<p>

<strong>Your Request:</strong><br>

${data.request}

</p>




<p>

<strong>Status:</strong><br>

${data.status}

</p>




</div>


`;



}



});






if(!found){



result.innerHTML = `



<div class="card">


<p>
No prayer request found.
Please check your phone number and request code.
</p>


</div>



`;



}





}

catch(error){


console.log(error);



result.innerHTML = `



<div class="card">


<p>
Unable to check request status at the moment.
Please try again.
</p>


</div>



`;



}





});



}
// =====================================
// TESTIMONY MODAL
// =====================================

const shareTestimonyBtn = document.getElementById("shareTestimonyBtn");

const testimonyModal = document.getElementById("testimonyModal");

const closeTestimonyModal = document.getElementById("closeTestimonyModal");



if(shareTestimonyBtn && testimonyModal){


shareTestimonyBtn.addEventListener("click",()=>{

testimonyModal.style.display = "flex";

});


}



if(closeTestimonyModal && testimonyModal){


closeTestimonyModal.addEventListener("click",()=>{

testimonyModal.style.display = "none";

});


}



// Close when clicking outside the form

window.addEventListener("click",(e)=>{


if(e.target === testimonyModal){

testimonyModal.style.display = "none";

}


});
// =====================================
// SUBMIT TESTIMONY TO FIREBASE
// =====================================

const testimonyForm = document.getElementById("testimonyForm");


if(testimonyForm){


testimonyForm.addEventListener("submit", async (e)=>{


e.preventDefault();



const name = document.getElementById("testimonyName").value.trim();

const title = document.getElementById("testimonyTitle").value.trim();

const category = document.getElementById("testimonyCategory").value;

const message = document.getElementById("testimonyMessage").value.trim();



if(name === "" || title === "" || message === ""){

alert("Please fill all required fields.");

return;

}



try{


await addDoc(collection(db,"testimonies"),{

name:name,

title:title,

category:category,

message:message,

status:"pending",

submittedAt:serverTimestamp()

});



alert("Your testimony has been submitted successfully. It will be reviewed by ARS Prayer Warriors administration before publication.");



testimonyForm.reset();

testimonyModal.style.display="none";



}

catch(error){


console.log(error);


alert("Unable to submit testimony. Please try again.");


}



});


}
// =====================================
// LATEST TESTIMONIES ON HOMEPAGE
// =====================================

const latestTestimonies = document.getElementById("latestTestimonies");

if(latestTestimonies){

const testimonyQuery = query(
    collection(db,"testimonies"),
    where("status","==","approved"),
    orderBy("submittedAt","desc"),
    limit(3)
);


onSnapshot(testimonyQuery,(snapshot)=>{

latestTestimonies.innerHTML = "";


if(snapshot.empty){

latestTestimonies.innerHTML = `

<div class="card">

<p>No approved testimonies yet.</p>

</div>

`;

return;

}



snapshot.forEach((item)=>{

const data = item.data();


latestTestimonies.innerHTML += `

<div class="card">

<h3>${data.category || "Testimony"}</h3>

<h4>${data.title || ""}</h4>

<p><strong>${data.name}</strong></p>

<p>${data.message}</p>

</div>

`;

});


});

}
// Website Maintenance Fund Toggle

const openFund = document.getElementById("openFund");
const fundDetails = document.getElementById("fundDetails");

if(openFund && fundDetails){

    openFund.addEventListener("click", function(){

        fundDetails.classList.toggle("show");

    });

}