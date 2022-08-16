document.getElementById("formSubmit").addEventListener("click",function(e){
  
  e.preventDefault(); // Cancel the native event
  e.stopPropagation();// Don't bubble/capture the event any further
  
  getFormulaire();
});
async function sendUser(objectContact){
    return await fetch("http://localhost:3000/api/auth/signup",{
        method: 'POST',
        body: objectContact
      })
      .then(function(res) { 
        if (res.ok) {
          return res.json();
        }
      })
      .then(function(result) {
        return result;
      })
      .catch(function(err) {
        // Une erreur est survenue
      });
}
async function loginUser(objectContact){
  return await fetch("http://localhost:3000/api/auth/login",{
      method: 'POST',
      body: objectContact
    })
    .then(function(res) { 
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(result) {
      return result;
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
}
function getFormulaire(){
    let formData = new FormData();
    let formContact={
        email:document.getElementById("formEmail").value,
        password:document.getElementById("formPassword").value,
        name:document.getElementById("formName").value,
        prename:document.getElementById("formPrename").value
    }
    formData.append("user",JSON.stringify(formContact));
    formData.append("image",document.querySelector('#formImage').files[0]);
    sendUser(formData).then((result)=>{
      formData.delete("image");
      loginUser(formData).then((result) =>{
        window.location="main.html";
      });
    });
}