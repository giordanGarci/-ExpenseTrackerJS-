firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "../home/home.html";
    }
})
 function onChangeEmail(){
        toggleButtonsDisable();
        toggleEmailErrors();
    }

    function onChangePassword(){
        toggleButtonsDisable();
        togglePasswordErrors();
    }

    function isPasswordValid(){
        const password = form.password().value;
        if(!password){
            return false;
        }
        return true;
    }

    function toggleEmailErrors(){
        const email = form.email().value;
        form.emailRequiredError().style.display = email ? "none" : "block";

        if(email){
            form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block"
        }else{
            form.emailInvalidError().style.display = "none"
        }
    }

    function togglePasswordErrors(){
        const password = form.password().value;
        form.passwordRequiredError().style.display = password ? "none" : "block";
    }
    
     

    function toggleButtonsDisable(){
        const emailValid = isEmailValid();
        form.recoverPassword().disabled = !emailValid;

        const passwordValid = isPasswordValid();
        form.loginButton().disabled = !emailValid || !passwordValid;
    }


    function isEmailValid(){
        const email = form.email().value;
        if(!email){
            return false;
        }
        return validateEmail(email);
    }

    const form = {
        email: () => document.getElementById("email"),
        password: () => document.getElementById("password"),
        emailInvalidError:() => document.getElementById("email-invalid-error"),
        emailRequiredError: () => document.getElementById("email-required-error"),
        loginButton: () => document.getElementById("login-button"),
        recoverPassword: () => document.getElementById("recover-password-button"),
        passwordRequiredError: () => document.getElementById("password-required-error")
    }

    function login(){
        showLoading();
        firebase.auth().signInWithEmailAndPassword(
            form.email().value, form.password().value
        ).then(response => {
            hideLoading();
            window.location.href = "pages/home/home.html"
        }).catch(error => {
            hideLoading();
            console.log(error.code)
            alert(getErrorMessage(error));
            console.log("error", error)
        })
        
    }

    function recoverPassword(){
        showLoading();
        firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
            hideLoading();
            alert("Email enviado com sucesso!");
        }).catch(error => {
            hideLoading();
            alert(getErrorMessage(error))
        });
    }

    function register(){
        window.location.href = "pages/register/register.html"
    }
    
    function getErrorMessage(error){
        if (error.code == "auth/invalid-credential"){
            return "Usuário não encontrado"
        }
        return error.message;
    }
