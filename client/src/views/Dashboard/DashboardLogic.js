import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../web3";
import {CONTRACT_ADDRESS, CURRENT_NETWORK, DEPLOY_BLOCK} from '../../web3/constants';
import axios from "axios";

const DashboardLogic = () => {
  const { contracts, account, seaport, connectWeb3, web3 } = useContext(Web3Context);

  //state
  const [allNFTs, setAllNFTs] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    if(web3){
      let search = await contracts.nft1155.getPastEvents('newNFT', {fromBlock: DEPLOY_BLOCK, toBlock: 'latest'})
      let allEvents = [];
      let filter = [];
      for (const element of search) {
        let x = await contracts.nft1155.methods.uri(element.returnValues.id).call();
        let resp = await axios.get(`https://ipfs.io/ipfs/${x.split("ipfs://").join("")}`);
        let tieneCat = false;
        resp.data.attributes.forEach(element => {
          if(element.trait_type === "Category"){
            if(!filter.includes(element.value)){
              filter.push(element.value);
              tieneCat = true;
            } 
          }
        });
        if(!tieneCat){
          if(!filter.includes("Unknown")){
            filter.push("Unknown");
          } 
        }
        resp.data.image = `https://ipfs.io/ipfs/${resp.data.image.split("ipfs://").join("")}`
  
        // const sellOrders = await seaport.api.getOrders({
        //   asset_contract_address: CONTRACT_ADDRESS,
        //   token_id: element.returnValues.id,
        //   side: OrderSide.Sell
        // }, 1)
        // let mayor = 0;
        // sellOrders.orders.forEach(element => {
        //   let x = parseFloat(((Number(element.currentPrice)/(10**18))/Number(element.quantity)).toFixed(2))
        //   if (x > mayor) mayor = x;
        // });
  
        allEvents.push({
          // price: mayor,
          ...element.returnValues, 
          data: resp.data,
          url: `https://${CURRENT_NETWORK!=="Mainnet"?"testnets.":''}opensea.io/assets/${CONTRACT_ADDRESS}/${element.returnValues.id}`, 
        });
      }
      
      setFilters(filter)
      setMyNFTs(allEvents);
      setAllNFTs(allEvents);
    }
  }

  const doSearch = (e) => {
    setSearch(e.target.value);
    if(e.target.value === ""){
      setMyNFTs(allNFTs);
    }else{
      let nuevo = []
      allNFTs.forEach(element => {
        if(element.data.name.toLowerCase().includes(e.target.value.toLowerCase()) || element.data.description.toLowerCase().includes(e.target.value.toLowerCase())){
          nuevo.push(element)
        }
      });
      setMyNFTs(nuevo);
    }
  }

  useEffect(() => {
    if(web3) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, seaport, web3])

  return {
    getData,
    doSearch,
    connectWeb3,
    search,
    myNFTs,
    filters,
    account
  }
}

export default DashboardLogic;