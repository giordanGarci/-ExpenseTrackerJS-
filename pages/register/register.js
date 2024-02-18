firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "../home/home.html";
    }
})
function onChangeEmail(){
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";

    if(form.emailRequiredError().style.display == "none"){
        form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
    }else{
        form.emailInvalidError().style.display = "none";
    }
    toggleResgisterButtonDisable();
}

function onChangePassword(){
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";

    if(form.passwordRequiredError().style.display == "none"){
        form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block";
    }else {
        form.passwordMinLengthError().style.display = "none";
    }
    validatePasswords();
    toggleResgisterButtonDisable();
}

function onChangeConfirmPassword(){
    validatePasswords();
    toggleResgisterButtonDisable();

}

function validatePasswords(){
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value;
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    form.confirmPasswordDoesntMatchError().style.display = 
        password === confirmPassword ? "none" : "block";
}


function register(){
    showLoading();
    const email = form.email().value;
    const password = form.password().value;

    firebase.auth().createUserWithEmailAndPassword(
        email, password
        ).then(() => {
            hideLoading();
            window.location.href = "../../pages/home/home.html";
        }).catch(error => {
            hideLoading();
            alert(getErrorMessage(error));
        })
}

function getErrorMessage(error){
    if(error.code == "auth/email-already-in-use"){
        return "Email já existente"
    }
    return error.message;
}

function toggleResgisterButtonDisable(){
    form.registerButton().disabled = !isFormValid();
}

function isFormValid(){
    const email = form.email().value;
    if(!email || !validateEmail(email)) return false;
    const password = form.password().value;
    if(!password || password.length < 6) return false;
    const confirmPassword = form.confirmPassword().value;
    if(password != confirmPassword) return false;
    return true;
}

const form = {
    confirmPassword: () => document.getElementById("confirmPassword"),
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    passwordMinLengthError: () => document.getElementById("password-min-length-error"),
    password: () => document.getElementById("password"),
    confirmPasswordDoesntMatchError: () => document.getElementById("password-doesnt-match-error"),
    registerButton: () => document.getElementById("register-button")
}