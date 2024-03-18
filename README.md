# Counter Application README

## Overview of Implementation Approach

The implementation of this counter application is divided into two main parts: the smart contract developed to manage counter operations and the frontend interface that interacts with the smart contract. 

### Smart Contract

The smart contract is built with [Sway](https://docs.fuel.network/docs/sway/), to provide a secure and decentralized way to manage a counter with basic arithmetic operations. It allows users to increment, decrement, multiply, and reset the counter value. The counter value is stored on the blockchain, ensuring that the operation history and current value are transparent and immutable.

#### Key Features:

- **Increment:** Increases the counter value by 1.
- **Decrement:** Decreases the counter value by 1, with a validation to prevent it from going below 0.
- **Multiply:** Multiplies the current counter value by a specified number.
- **Reset:** Resets the counter value to zero.

### Frontend Interface

The frontend is designed to provide a user-friendly interface for interacting with the smart contract. It is developed using React and TypeScript and integrates the Fuel Wallet for blockchain interactions. 

#### Key Functionalities:

- **Connect Wallet:** Allows users to connect their Fuel wallet to interact with the contract.
- **Disconnect Wallet:** Allows users to disconnect their Fuel wallet from interacting with the contract.
- **Counter Display:** Shows the current value of the counter.
- **Increment/Decrement/Multiply/Reset Buttons:** Allows users to perform the different counter operation.
- **Feedback Messages:** Displays success or error messages based on the outcome of the operation.

## Significant Decisions and Justifications

### Smart Contract

- **Decrement Operation Validation:** Implemented a check to prevent the counter from going below zero, ensuring the counter value remains valid and preventing potential underflow errors.
  
- **Use of u64 for Counter:** Chose a 64-bit unsigned integer for the counter to ensure a wide range of positive values, balancing the need for a large range with the importance of efficient storage on the blockchain.

### Frontend

- **State Management for Multiply Value:** Introduced a separate state to manage the multiply value, allowing users to specify a multiplier for the counter. This decision provides flexibility for users to interact more dynamically with the counter.
  
- **Feedback Mechanism:** Designed to give users immediate and clear feedback on their actions' outcomes. Success messages confirm correct operations, while error messages help users understand what went wrong, improving user experience.
  
- **Disconnect Wallet Functionality:** Added a disconnect button to allow users to securely disconnect their wallets when they are done interacting with the application, enhancing privacy and security. This also allows a user to connect with a different wallet.


### Additional Information 
You can find a deployed version of the  application [here](https://fuel-quickstart-ui.netlify.app/).