if(!isNewTransaction()){
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function findTransactionByUid(uid){
    showLoading();
    transactionServices.findByUid(uid)
        .then(transaction => {
            hideLoading();
                fillTransactionScream(transaction);
                toggleSaveButton();
    })
    .catch(() => {
        hideLoading();
        alert("Erro ao recuperar documento!");
        window.location.href = "../home.home.html";
    })
}

function fillTransactionScream(transaction){
    if(transaction.type == "expense"){
        form.typeExpense().checked = true;
    } else {
        form.typeIncome().checked = true;
    }

    form.date().value = transaction.date;
    
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactioType().value = transaction.transactionType;
    if(transaction.description) {
        form.description().value = transaction.description;
    }

}

function getTransactionUid(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction(){
    return getTransactionUid() ? false : true;
}

function onChangeDate(){
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

    toggleSaveButton()
}

function onChangeValue(){
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? "block" : "none";

    if(value){;
        form.valueInvalidError().style.display = value <= 0 ? "block" : "none";
    }else{
        form.valueInvalidError().style.display = "none";
    }

    toggleSaveButton();
}

function onChangeTransactionType(){
    const transactionType = form.transactioType().value;
    form.transactionTypeError().style.display = transactionType ? "none" : "block";
    toggleSaveButton()
}

function toggleSaveButton(){
    form.saveButton().disabled = !isFormValid();
}

function isFormValid(){
    const date = form.date().value;
    if(!date)
        return false;

    const value = form.value().value;
    if(!value || value <= 0){
        return false;
    }

    const transactionType = form.transactioType().value;
    if(!transactionType)
        return false

    return true;
}

function saveTransaction(){
    const transaction = createTransaction();
    showLoading();    

    if(isNewTransaction()){
        save(transaction);
    }else{
        update(transaction);
    }
} 

function update(transaction){
    showLoading();
    transactionServices.update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html"
        }).catch(() => {
            hideLoading();
            alert("Erro ao atualizar transação!");
        })
}

function save(transaction){
    transactionServices.save(transaction)
    .then(() => {
        hideLoading();
        window.location.href = "../home/home.html"
    }).catch(() => {
        hideLoading();
        alert("Erro ao salvar transação!");
    })
}


function createTransaction(){
    return {
        type: form.typeExpense().checked ? "expense" : "income",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactioType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    }
}

function cancelTransaction(){
    window.location.href = "../home/home.html";
}

function logout(){
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html"
    }).catch(() => {
        alert("Erro ao fazer logout")
    })
}

const form ={
    date: () => document.getElementById("date"),
    description: () => document.getElementById("description"),
    currency: () => document.getElementById("currency"),
    typeExpense: () => document.getElementById("expense"),
    typeIncome: () => document.getElementById("income"),
    saveButton: () => document.getElementById("save-button"),
    dateRequiredError: () => document.getElementById("date-required-error"),
    dateInvalidError: () => document.getElementById("date-invalid-error"),
    valueRequiredError: () => document.getElementById("value-required-error"),
    valueInvalidError: () => document.getElementById("value-invalid-error"),
    value: () => document.getElementById("value"),
    transactioType: () => document.getElementById("transactionType"),
    transactionTypeError: () => document.getElementById("transactionType-required-error")
}

