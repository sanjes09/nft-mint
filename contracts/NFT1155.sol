//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155Burnable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract NFT1155 is ERC1155Burnable, AccessControl{

    uint private id = 1;
    string private _baseUri;
    string private _contractUri;

    // save all NFT IPFS hashes
    mapping (uint => string) public ipfsHashes;

    //EVENTS
    event newNFT(address creator, uint amount, uint id);
    event burnNFT(address creator, uint amount, uint id);

    //MODIFIERS
    modifier onlyOwner(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only owner can access");
        _;
    }

    constructor(string memory contractUri) ERC1155(""){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _baseUri = "ipfs://";
        _contractUri = string(abi.encodePacked("ipfs://", contractUri));
    }

    function contractURI() public view returns (string memory) {
        return _contractUri;
    }

    function owner() public virtual returns (address){
        return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }

    /**
     * @dev user creates new NFTs Lazy mint
     */
    function mint(uint256 _optionId, address _toAddress) public {
        _mint(_toAddress, _optionId, 1, "");
        emit newNFT(_toAddress, 1, _optionId);
    }

    /**
     * @dev user creates new NFTs
     */
    function mintNew(uint amount, string memory ipfshash) public onlyOwner returns (uint){
        _mint(msg.sender, id, amount, "");
        ipfsHashes[id] = ipfshash;
        emit newNFT(msg.sender, amount, id);
        id++;
        return(id-1);
    }

    /**
     * @dev user burns his NFTs
     */
    function burnIt(uint tokenId, uint amount) public onlyOwner{
        burn(msg.sender, tokenId, amount);
        emit burnNFT(msg.sender, amount, tokenId);
    }

    /**
     * @dev returns the ipfs uri to get token data
     */
    function uri(uint256 tokenId) external view override returns (string memory) {
        return string(abi.encodePacked(_baseUri, ipfsHashes[tokenId]));
    }

}