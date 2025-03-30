# Dead Man's Switch - Smart Inheritance System

![App Screenshot](./screenshot.png)

A decentralized solution to prevent crypto asset loss when owners become inactive.

## Features

- Automatic asset transfer after inactivity period
- Owner can change beneficiaries anytime
- Regular check-ins prove account activity
- Fully transparent smart contract logic

## How It Works

1. **Owner** deploys contract specifying:
   - Heir address
   - Check-in interval (e.g., 30 days)
2. **Owner** deposits crypto assets
3. **Owner** must check in periodically
4. If owner misses check-in:
   - **Heir** can claim assets after interval passes

## Tech Stack

- Smart Contracts: Solidity (0.8.0)
- Frontend: HTML/CSS/JavaScript
- Blockchain: Ethereum (Ganache for local dev)
- Web3: MetaMask integration

## Installation

1. Clone repo:
   ```bash
   git clone https://github.com/yourusername/dead-mans-switch.git
   cd dead-mans-switch