const Web3 = require("web3")

let ethereum = new Web3('http://191.168.1.1:8545')

let BSC = new Web3('https://bsc-dataseed1.binance.org:443')

let createAccountBsc = async () => {
    const account = await BSC.eth.accounts.create();
    return account
}

let createAccountEthereum = async () => {
    const account = await ethereum.eth.accounts.create();
    return account
}


module.exports = () => {
    return new Promise((resolve, reject) => {
        // Promise.all([createAccountBsc() , createAccountEthereum() ])
        Promise.all([createAccountEthereum() ])
            // .then(accounts => resolve({ bsc : accounts[0] , eth : accounts[1] }))
            .then(accounts => resolve({ eth : accounts[0] }))
            .catch(err => reject(err))
    })
}
