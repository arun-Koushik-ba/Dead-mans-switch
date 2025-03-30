// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Inheritance {
    address public owner;
    address public heir;
    uint public lastCheckIn;
    uint public checkInInterval;
    uint public balance;

    event Deposited(address from, uint amount);
    event Withdrawn(address to, uint amount);
    event HeirChanged(address newHeir);
    event CheckIn(address owner);

    constructor(address _heir, uint _checkInIntervalDays) {
        owner = msg.sender;
        heir = _heir;
        checkInInterval = _checkInIntervalDays * 1 days;
        lastCheckIn = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyHeir() {
        require(msg.sender == heir, "Only heir can call this");
        _;
    }

    function checkIn() public onlyOwner {
        lastCheckIn = block.timestamp;
        emit CheckIn(msg.sender);
    }

    function changeHeir(address newHeir) public onlyOwner {
        heir = newHeir;
        emit HeirChanged(newHeir);
    }

    function withdraw() public onlyHeir {
        require(block.timestamp > lastCheckIn + checkInInterval, "Owner still active");
        payable(heir).transfer(address(this).balance);
        emit Withdrawn(heir, address(this).balance);
    }

    function deposit() public payable {
        balance += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    receive() external payable {
        deposit();
    }
}