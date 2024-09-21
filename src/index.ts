import { ethers } from "ethers";
import "./styles.css";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { pbkdf2Sync } from "crypto";

// Create the UI
document.getElementById("app").innerHTML = `
  <h1>Solana Wallet Generator</h1>
  <form id="wallet-form">
    <label for="uid">Telegram UID:</label>
    <input type="text" id="uid" value="D_peace" required><br><br>
    <label for="password">Password:</label>
    <input type="password" id="password" required><br><br>
    <button type="submit">Generate Wallet</button>
  </form>
  <div id="result" style="margin-top: 20px;"></div>
`;

// Add event listener to the form
document.getElementById("wallet-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const uid = (document.getElementById("uid") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const walletKeys = generateSolanaWallet(uid, password);

  document.getElementById("result").innerHTML = `
    <h2>Generated Wallet Keys:</h2>
    <p><strong>Public Key:</strong> ${walletKeys.publicKey}</p>
    <p><strong>Private Key:</strong> ${walletKeys.privateKey}</p>
  `;
});

interface SolanaWalletKeys {
  privateKey: string;
  publicKey: string;
}

function generateSolanaWallet(uid: string, password: string): SolanaWalletKeys {
  // This can be done differently but the idea still remains the same
  const combinedSeed = `${uid}:${password}`;
  const salt = "solana_wallet_salt";

  const seedBuffer = pbkdf2Sync(combinedSeed, salt, 100000, 32, "sha512");

  const mnemonic = bip39.entropyToMnemonic(seedBuffer);

  const wallet = ethers.Wallet.fromPhrase(mnemonic);

  return {
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
  };
}
