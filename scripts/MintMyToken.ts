import { createPublicClient, http, createWalletClient,parseEther, formatEther } from "viem";
import { abi, bytecode } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { toHex, hexToString} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

const MINT_VALUE  = 100;

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number:", blockNumber);

    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
      account,
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });


    // Mint initial set of tokens
    const hash2 = await deployer.writeContract({
      address: receipt.contractAddress,
      abi,
      functionName: "mint",
      args: [deployer.account.address, MINT_VALUE],
    });

    console.log("Mint Transaction hash:", hash2);
    console.log("Waiting for confirmations...");
    await publicClient.waitForTransactionReceipt({hash});
    console.log("Mint Transaction confirmed");
    console.log(
      `Minted ${MINT_VALUE} decimal units to account ${deployer.account.address}`
    );

    // Read balance
    const balance: bigint = (await publicClient.readContract({
      address: receipt.contractAddress,
      abi,
      functionName: "balanceOf",
      args: [deployer.account.address],
    })) as bigint;
    console.log(
      `Account ${deployer.account.address} has ${formatEther(balance)} decimal units of MyToken`
    );

    /*
    console.log("Deployer address:", deployer.account.address);
    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });
    console.log(
      "Deployer balance:",
      formatEther(balance),
      deployer.chain.nativeCurrency.symbol
    );

    const hash2 = await deployer.writeContract({
      address: receipt.contractAddress,
      abi,
      functionName: "mint",
      args: [receipt.contractAddress, MINT_VALUE],
    });

    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed");

    const balance1 = (await publicClient.readContract({
      address: receipt.contractAddress,
      abi,
      functionName: "balanceOf",
      args: [receipt.contractAddress],
    }))  as `0x${string}`;
    console.log("Balance is", balance1);

    */
  }
      
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
