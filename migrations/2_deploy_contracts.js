const Inheritance = artifacts.require("Inheritance");

module.exports = function(deployer, network, accounts) {
    // Use the second account as heir
    const heir = accounts[1];
    const checkInIntervalDays = 30;
    
    deployer.deploy(Inheritance, heir, checkInIntervalDays);
};