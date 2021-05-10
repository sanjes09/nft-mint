const { ethers, upgrades } = require("hardhat");
const ipfsClient = require("ipfs-http-client");

const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

async function main() {
  try {
    const schema = {
      name: "NFT Creator",
      description: "NFT Creator machine",
      image: "https://nft-minter.tk/logo.png",
      external_link: "https://nft-minter.tk",
    }
  
    const contractUri = await ipfs.add(JSON.stringify(schema));
  
    const NFT1155 = await ethers.getContractFactory("NFT1155");
    const nft1155 = await NFT1155.deploy(contractUri.path);
    console.log("nft1155 deployed to:", nft1155.address);   
  
    // await nft1155.transferOwnership("0x0A6200f1445189deD98914Fb995352Ddc2f5051a");
  } catch (error) {
    console.log(`error`, error)
  }

}

main();