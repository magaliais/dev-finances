const Modal = {
    open() {
        // Abrir modal
        // Adicionar a classe active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        // Fechar modal
        // Remover a classe active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    },
}


const Storage = {       // Configura o armazenamento em navegador
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", 
        JSON.stringify(transactions))
    },
}


// 1) Criar uma Classe e um Array de Objetos (temporário, para manipular os dados)

const Transaction = {
    all: Storage.get(),
    
    // [
    //     {
    //         description: 'Luz',
    //         amount: -50000,
    //         date: '23/01/2021',
    //     },
    
    //     {
    //         description: 'Website',
    //         amount: 500000,
    //         date: '23/01/2021',
    //     },
    
    //     {
    //         description: 'Internet',
    //         amount: -20000,
    //         date: '23/01/2021',
    //     },
    
    //     {
    //         description: 'App',
    //         amount: 200000,
    //         date: '23/01/2021',
    //     },
    // ],                               Esse Array foi usado para fazer a aplicação antes de passar para localStorage

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)           // remove um elemento do array
        App.reload()
    },

    incomes() {
        // somar as entradas
        let income = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0)
                income += transaction.amount;
        })
        return income;
    },

    expenses() {
        // somar as saídas
        let expense = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0)
                expense += transaction.amount;
        })
        return expense;
    },

    total() {
        // entradas - saídas
        let total = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0)
                total += transaction.amount
            else
                total += transaction.amount
        })
        return total;
    },
}


// 2) pegar as transações do objeto ('transactions', no caso) no JavaScript e colocar no HTML

const DOM = {                                                               // modela os dados de HTML para JavaScript
    transactionsContainer: document.querySelector('#data-table tbody'),     // busca o tbody (elemento que serve de container para os dados)

    addTransaction(transaction, index) {                                    // 2.b) Cria um objeto para conter o tr (uma linha da tabela)
        
        const tr = document.createElement('tr')                     // O método 'createElement()' cria o elemento HTML especificado (div, tr, td, span, etc)
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)          // O método 'innerHTML' define ou obtém a sintaxe HTML ou XML
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
        
    },

    innerHTMLTransaction(transaction, index) {            // 2.a) constroi o HTML interno de uma transação (transforma as informações para um molde a ser exibido no código HTML)
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `
        return html
    },
    
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes(transaction))
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses(transaction))
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total(transaction))
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    },
    
}


const Utils = {
    formatCurrency(value) {                             // passa a informação para o fomato de moeda
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        value = signal + value
        return value
    },

    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return (`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`)
    },

}


const Form = {

    desciption: document.querySelector('input#description'),

    amount: document.querySelector('input#amount'),

    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.desciption.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description: description,
            amount: amount,
            date: date,
        }
    },

    clearFields() {
        Form.desciption.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            // verificar se as informações foram preenchidas
            Form.validateFields()

            // formatar os dados para salvar
            const transaction = Form.formatValues()
            
            // salvar
            Transaction.add(transaction)

            // apagar os dados do formulário
            Form.clearFields()

            // modal feche
            Modal.close()

            // Atualizar a aplicação
            // no Transaction.add() já há um App.reload()

        } catch (error) {
            alert(error.message)
        }
    },
}


const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}


App.init()