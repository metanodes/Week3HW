import { createPublicClient, http, createWalletClient,parseEther, formatEther } from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";
import { toHex, hexToString} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

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


    console.log("\nDeploying Ballot contract");
    const hash = await deployer.deployContract({
      abi,
      bytecode: bytecode as `0x${string}`,
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Ballot contract deployed to:", receipt.contractAddress);

    if (!receipt.contractAddress) throw new Error("Contract not deployed"); 

}
      
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
