// src/app.js

let inheritanceContract;
let web3;
let accounts = [];
let contractInstance;

window.addEventListener('load', async () => {
    // Modern dapp browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            initApp();
        } catch (error) {
            console.error("User denied account access");
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
        accounts = await web3.eth.getAccounts();
        initApp();
    }
    // Non-dapp browsers
    else {
        console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
    }
});

async function initApp() {
    // Get network ID and deployed contract address
    const networkId = await web3.eth.net.getId();
    
    // Replace with your contract's ABI and network data
    const contractData = InheritanceContract.networks[networkId];
    
    if (contractData) {
        contractInstance = new web3.eth.Contract(
            InheritanceContract.abi,
            contractData.address
        );
        updateUI();
    } else {
        console.error('Contract not deployed to detected network');
    }
}

async function updateUI() {
    if (!contractInstance) return;

    // Get contract data
    const owner = await contractInstance.methods.owner().call();
    const heir = await contractInstance.methods.heir().call();
    const lastCheckIn = await contractInstance.methods.lastCheckIn().call();
    const checkInInterval = await contractInstance.methods.checkInInterval().call();
    const balance = await web3.eth.getBalance(contractInstance.options.address);

    // Update UI elements
    document.getElementById('owner').textContent = owner;
    document.getElementById('heir').textContent = heir;
    document.getElementById('lastCheckIn').textContent = new Date(lastCheckIn * 1000).toLocaleString();
    document.getElementById('checkInInterval').textContent = checkInInterval / (60 * 60 * 24) + ' days';
    document.getElementById('balance').textContent = web3.utils.fromWei(balance, 'ether') + ' ETH';

    // Enable/disable buttons based on account
    const isOwner = accounts[0] && accounts[0].toLowerCase() === owner.toLowerCase();
    const isHeir = accounts[0] && accounts[0].toLowerCase() === heir.toLowerCase();

    document.getElementById('checkInBtn').disabled = !isOwner;
    document.getElementById('changeHeirBtn').disabled = !isOwner;
    document.getElementById('depositBtn').disabled = !isOwner;
    document.getElementById('withdrawBtn').disabled = !isHeir;
}

// Event listeners
document.getElementById('checkInBtn').addEventListener('click', async () => {
    try {
        await contractInstance.methods.checkIn().send({ from: accounts[0] });
        updateUI();
    } catch (error) {
        console.error("Check-in failed:", error);
    }
});

document.getElementById('changeHeirBtn').addEventListener('click', async () => {
    const newHeir = document.getElementById('newHeirInput').value;
    if (!web3.utils.isAddress(newHeir)) {
        alert('Invalid Ethereum address!');
        return;
    }
    
    try {
        await contractInstance.methods.changeHeir(newHeir).send({ from: accounts[0] });
        updateUI();
    } catch (error) {
        console.error("Changing heir failed:", error);
    }
});

document.getElementById('depositBtn').addEventListener('click', async () => {
    const amount = document.getElementById('depositAmount').value;
    if (!amount || isNaN(amount)) {
        alert('Please enter a valid ETH amount');
        return;
    }
    
    try {
        const weiAmount = web3.utils.toWei(amount, 'ether');
        await contractInstance.methods.deposit().send({
            from: accounts[0],
            value: weiAmount
        });
        updateUI();
    } catch (error) {
        console.error("Deposit failed:", error);
    }
});

document.getElementById('withdrawBtn').addEventListener('click', async () => {
    try {
        await contractInstance.methods.withdraw().send({ from: accounts[0] });
        updateUI();
    } catch (error) {
        console.error("Withdrawal failed:", error);
    }
});

const InheritanceContract = {
    abi: [
      {"inputs":[{"internalType":"address","name":"_heir","type":"address"},[
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_heir",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_checkInIntervalDays",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "CheckIn",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Deposited",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "newHeir",
              "type": "address"
            }
          ],
          "name": "HeirChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Withdrawn",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "balance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "checkInInterval",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "heir",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "lastCheckIn",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "stateMutability": "payable",
          "type": "receive",
          "payable": true
        },
        {
          "inputs": [],
          "name": "checkIn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newHeir",
              "type": "address"
            }
          ],
          "name": "changeHeir",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
          "payable": true
        }
      ]],
      // PASTE THE ENTIRE ABI ARRAY FROM Inheritance.json
}
],
    networks: {
      "1743349705529": {
      "events": {},
      "links": {},
      "address": "0x18BE3862Fda358b4dA7a4d0B8F8322B321C19e00",
      "transactionHash": "0x78756fcc393482d29df2ca4bf5926ece5f72be4d13028c4911ec33e1c46d5ea0"
        }
      }
    }
      
    console.log("Network ID:", await web3.eth.net.getId());
console.log("Contract data:", InheritanceContract.networks);

