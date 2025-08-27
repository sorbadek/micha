# Peerverse 

## About
Peerverse is a decentralized education platform where students become teachers, breaking down traditional barriers to education. Our platform enables peer-to-peer learning, making quality education accessible to everyone, regardless of their background or location.

For a complete overview of the project, please read our [detailed documentation](https://drive.google.com/file/d/1jFuBynWe-ZkqxAayp-GyqVqC1Ht1QyTZ/view).

## Live Demo
A demo is available at [peerverses.netlify.app](https://peerverses.netlify.app). 

**Note:** For the full functionality, please run the project locally as described below, as the demo version has limited features due to canisters not being deployed to the mainnet.

## Local Development Setup

### Prerequisites
- Node.js (v14 or later)
- DFINITY Canister SDK (DFX)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sorbadek/micha
   cd micha
   ```

2. Set up the backend:
   ```bash
   cd src/micha_backend
   dfx start --background
   dfx deploy
   ```
   
   After deployment, note down the canister IDs from the output.

3. Set up the frontend:
   ```bash
   # In a new terminal
   cd src/micha_frontend
   npm install
   ```

4. Configure canister IDs:
   - Navigate to `src/micha_frontend/lib`
   - Update the respective files with the canister IDs obtained from the backend deployment

5. Deploy the frontend:
   ```bash
   dfx deploy
   ```

6. Start the development server:
   ```bash
   npm start
   ```

Your local instance of Peerverse should now be running at `http://localhost:3000`

## Features

### Learn & Teach
Every user can be both a student and a teacher. Share your knowledge in coding, design, math, career advice, or any other subject through micro-classes, learning content, or discussion threads.

### Decentralized System
Built on decentralized technology principles, Peerverse ensures no central authority, no censorship, and open accessibility that scales globally.

### Reputation & Incentives
Earn reputation points and on-chain credentials as you contribute. The platform explores token incentives, NFT certifications, and profit-sharing models.

## Business Model

- **Freemium Model**: Basic content is free, with premium tiers for exclusive content and verified tutors
- **Tokenized Ecosystem**: Native token for earning, tipping, and transactions within Peerverse
- **Institutional Partnerships**: Integration with schools, bootcamps, and NGOs
- **Data Insights**: Anonymized learning data to improve recommendations and AI tutors

## Vision
We believe in making knowledge accessible, inclusive, and peer-powered. Peerverse is building a future where learning flows freely, and every student can become a changemaker.

