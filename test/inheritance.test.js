const Inheritance = artifacts.require("Inheritance");

contract("Inheritance", (accounts) => {
    let inheritance;
    const owner = accounts[0];
    const heir = accounts[1];
    const stranger = accounts[2];
    const checkInIntervalDays = 30;
    const oneDayInSeconds = 86400;

    before(async () => {
        inheritance = await Inheritance.new(heir, checkInIntervalDays, { from: owner });
    });

    it("should set the correct owner and heir", async () => {
        const contractOwner = await inheritance.owner();
        const contractHeir = await inheritance.heir();
        assert.equal(contractOwner, owner, "Owner is not set correctly");
        assert.equal(contractHeir, heir, "Heir is not set correctly");
    });

    it("should allow owner to check in", async () => {
        const initialCheckIn = (await inheritance.lastCheckIn()).toNumber();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await inheritance.checkIn({ from: owner });
        const newCheckIn = (await inheritance.lastCheckIn()).toNumber();
        assert.isAbove(newCheckIn, initialCheckIn, "Check-in time not updated");
    });

    it("should prevent non-owner from checking in", async () => {
        try {
            await inheritance.checkIn({ from: stranger });
            assert.fail("Non-owner was able to check in");
        } catch (err) {
            assert.include(err.message, "Only owner can call this", "Error message doesn't match");
        }
    });

    it("should allow heir to withdraw after interval", async () => {
        // Deposit some ETH first
        await web3.eth.sendTransaction({
            from: owner,
            to: inheritance.address,
            value: web3.utils.toWei("1", "ether")
        });

        // Fast forward time
        await new Promise((resolve) => {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [checkInIntervalDays * oneDayInSeconds + 1],
                id: new Date().getTime()
            }, resolve);
        });

        // Mine new block
        await new Promise((resolve) => {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
            }, resolve);
        });

        await inheritance.withdraw({ from: heir });
        const balance = await web3.eth.getBalance(inheritance.address);
        assert.equal(balance, 0, "Funds not withdrawn");
    });

    it("should prevent heir from withdrawing before interval", async () => {
        // Create a fresh contract instance for this test
        const newContract = await Inheritance.new(heir, checkInIntervalDays, { from: owner });
        
        try {
            await newContract.withdraw({ from: heir });
            assert.fail("Heir was able to withdraw before interval");
        } catch (err) {
            assert.include(
                err.message, 
                "Owner still active", 
                `Expected "Owner still active" but got: ${err.message}`
            );
        }
    });
});