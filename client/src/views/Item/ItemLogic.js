import { useState, useEffect, useContext } from "react";
import {useParams } from 'react-router-dom';
import { Web3Context } from "../../web3";
// import Swal from 'sweetalert2'
import {CONTRACT_ADDRESS, DEPLOY_BLOCK, CURRENT_NETWORK} from '../../web3/constants';
import axios from "axios";
// import ipfs from "../../utils/ipfs";
const { OrderSide } = require("opensea-js/lib/types");

const ItemLogic = () => {
  const { contracts, account, seaport, web3, connectWeb3, itemOwner, transferItem} = useContext(Web3Context);
  const { id } = useParams();

  //state
  const [item, setItem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalTransfer, setShowModalTransfer] = useState(false);
  const [isItemOwner, setIsItemOwner] = useState(false);
  const [sellAmount, setSellAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellOffers, setSellOffers] = useState([]);
  // const [buyOffers, setBuyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingSell, setLoadingSell] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);

  const getData = async () => {
    if(web3){
      let search = await contracts.nft1155.getPastEvents('newNFT', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'})
      for (const element of search) {
        if(element.returnValues.id === id){
          let x = await contracts.nft1155.methods.uri(id).call();
          let resp = await axios.get(`https://ipfs.io/ipfs/${x.split("ipfs://").join("")}`);
          resp.data.image = `https://ipfs.io/ipfs/${resp.data.image.split("ipfs://").join("")}`
          setItem({
            ...element.returnValues, 
            data: resp.data,
            url: `https://${CURRENT_NETWORK!=="Mainnet"?"testnets.":''}opensea.io/assets/${CONTRACT_ADDRESS}/${id}`, 
          });
        }
      }
      getOrders();
      setLoading(false)
    }
  }

  const getOrders = async () => {
    try {
      if(web3 && seaport){
        const sellOrders = await seaport.api.getOrders({
          asset_contract_address: CONTRACT_ADDRESS,
          token_id: id,
        side: OrderSide.Sell
        }, 1)
        setSellOffers(sellOrders.orders)
        // console.log(`sellOrders.orders`, sellOrders.orders)
        // const buyOrders = await seaport.api.getOrders({
          //   asset_contract_address: CONTRACT_ADDRESS,
          //   token_id: id,
          //   side: OrderSide.Buy,
        // });
        // console.log(`buyOrders`, buyOrders)
        // setBuyOffers(buyOrders.orders)
        // console.log(`buyOrders.orders`, buyOrders.orders)
      }
    } catch (error) {
      console.log(`error`, error)
    }
  }

  const buy = async (order) => {
    if(account && seaport){
      setLoadingBuy(true);
      // const asset = {
      //   tokenAddress: CONTRACT_ADDRESS,
      //   tokenId: id,
      //   schemaName: "ERC1155",
      // };

      const transactionHash = await seaport.fulfillOrder({
        order,
        accountAddress: account,
      });
    
      console.log(transactionHash);

      setLoadingBuy(false);
      getOrders();
    }else{
      connectWeb3();
    }
  }

  const sell = async () => {
    if(account && seaport){
      setLoadingSell(true);
      const asset = {
        tokenAddress: CONTRACT_ADDRESS,
        tokenId: id,
        schemaName: "ERC1155",
      };

      // const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)

      const transactionHash = await seaport.createSellOrder({
        asset,
        accountAddress: account,
        startAmount: sellPrice,
        quantity: sellAmount
        // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
        // endAmount: 0.1,
        // expirationTime,
      })
    
      console.log(transactionHash);
      setSellAmount("");
      setSellPrice("");
      setLoadingSell(false);
      setShowModal(false);
      getOrders();
    }
  }

  const transfer = async () => {
    if(account){
      setLoadingTransfer(true);
      await transferItem(transferTo, id, transferAmount);
      setTransferTo("");
      setTransferAmount("");
      setLoadingTransfer(false);
      setShowModalTransfer(false);
    }
  }

  const view = () => {
    window.open(`https://${CURRENT_NETWORK!=="Mainnet"?"testnets.":''}opensea.io/assets/${CONTRACT_ADDRESS}/${id}`)
  }

  useEffect(() => {
    getData();
    itemOwner(id).then(resp => {
      setIsItemOwner(resp)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3, account])

  useEffect(() => {
    if(seaport) getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seaport])

  return {
    buy,
    sell,
    setSellAmount,
    setSellPrice,
    setShowModal,
    view,
    setShowModalTransfer,
    setTransferTo,
    setTransferAmount,
    transfer,
    showModalTransfer,
    transferTo,
    transferAmount,
    account,
    showModal,
    loadingBuy,
    loadingSell,
    loading,
    isItemOwner,
    item,
    sellOffers,
    sellPrice,
    sellAmount,
    loadingTransfer,
    // buyOffers,
  }
}

export default ItemLogic;