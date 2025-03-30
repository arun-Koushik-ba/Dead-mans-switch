async function increase(duration) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [duration],
            id: new Date().getTime()
        }, (err) => {
            if (err) return reject(err);
            
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
            }, (err) => {
                return err ? reject(err) : resolve();
            });
        });
    });
}

module.exports = { increase };