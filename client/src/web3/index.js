import React, { useReducer, useCallback, createContext, useEffect } from "react";

import { Web3Reducer } from "./reducer";

// WEB3 CONNECTION PACKAGES
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import { OpenSeaPort, Network } from 'opensea-js'

import NFT1155 from '../utils/abi/NFT1155.json';
import {CONTRACT_ADDRESS, CURRENT_NETWORK} from './constants';

let web3 = null;

const initialState = {
  loading: true,
  connected: false,
  account: null,
  contracts: {},
  networkId: null,
  chainId: null,
  seaport: null,
};

export const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const setAccount = (account) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    });
  };

  const setNetworkId = (networkId) => {
    dispatch({
      type: "SET_NETWORK_ID",
      payload: networkId,
    });
  };

  const setContracts = (contracts) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  const setSeaport = (seaport) => {
    dispatch({
      type: "SET_SEAPORT",
      payload: seaport,
    });
  };

  const logout = () => {
    setAccount(null);
    localStorage.setItem("defaultWallet", null);
  };

  const connectWeb3 = useCallback(async () => {
    // Web3 Modal
    let host;
    let network;
    let networkName;
    if(CURRENT_NETWORK === 'Rinkeby'){
      host = "https://rinkeby.infura.io/v3/203d5c0b362148819014f26057fb0d90";
      network = "rinkeby";
      networkName = Network.Rinkeby;
    }else{
      host = "https://mainnet.infura.io/v3/203d5c0b362148819014f26057fb0d90";
      network = "mainnet";
      networkName = Network.Main;
    }

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "203d5c0b362148819014f26057fb0d90", // required
        },
      },
      torus: {
        package: Torus, // required
        options: {
          networkParams: {
            host, // optional
            networkId: 1, // optional
          },
          config: {
            buildEnv: "production", // optional
          },
        },
      },
      authereum: {
        package: Authereum,
      },
    };

    try {
      const web3Modal = new Web3Modal({
        network,
        cacheProvider: true, // optional
        providerOptions, // required
        theme: "light",
      });
      const provider = await web3Modal.connect();

      web3 = new Web3(provider);
      window.web3 = web3;

      const nft1155 = new web3.eth.Contract(NFT1155.abi, CONTRACT_ADDRESS);
      setContracts({...state.contracts, nft1155});
      window.nft1155 = nft1155;

      const networkId = await web3.givenProvider.networkVersion;
      setNetworkId(networkId);
      const seaport = new OpenSeaPort(window.ethereum, {
        networkName
      })
      setSeaport(seaport);
      
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
      console.log("Connected Account: ", acc[0]);

    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWeb3Lite = useCallback(async () => {
    // Web3 Modal
    let host;
    let networkName;
    if(CURRENT_NETWORK === 'Rinkeby'){
      host = "https://rinkeby.infura.io/v3/203d5c0b362148819014f26057fb0d90";
      networkName = Network.Rinkeby;
    }else{
      host = "https://mainnet.infura.io/v3/203d5c0b362148819014f26057fb0d90";
      networkName = Network.Main;
    }

    try {

      web3 = new Web3(host);
      window.web3 = web3;

      const nft1155 = new web3.eth.Contract(NFT1155.abi, CONTRACT_ADDRESS);
      setContracts({...state.contracts, nft1155});
      window.nft1155 = nft1155;
      const networkId = await web3.givenProvider.networkVersion;
      setNetworkId(networkId);

      const seaport = new OpenSeaPort(window.ethereum, {
        networkName
      })
      setSeaport(seaport);

    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mintToken = async (tokenAmount, schemaHash) => {
    if(state.account){
      const tx = await state.contracts.nft1155.methods.mintNew(tokenAmount, schemaHash).send({from: state.account});
      return tx.events.newNFT.returnValues.id
    }
  }

  const newOwner = async (address) => {
    if(state.account){
      await state.contracts.nft1155.methods.grantRole("0x00", address).send({from: state.account});
    }
  }

  const removeOwner = async (address) => {
    if(state.account){
      await state.contracts.nft1155.methods.revokeRole("0x00", address).send({from: state.account});
    }
  }

  const isOwner = async() => {
    if(state.account){
      return await state.contracts.nft1155.methods.hasRole("0x00",state.account).call();
      // let x = await state.contracts.nft1155.methods.owner().call();
      // return x === state.account;
    }
  }

  const itemOwner = async (id) => {
    if(state.account){
      let x =  await state.contracts.nft1155.methods.balanceOf(state.account, id).call();
      return x > 0;
    }
  }

  const transferItem = async (toAddress, id, amount) => {
    await state.contracts.nft1155.methods.safeTransferFrom(state.account, toAddress, id, amount, "0x").send({from: state.account});
  }

  useEffect(() => {
    if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
      connectWeb3();
    }else{
      connectWeb3Lite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Web3Context.Provider
      value={{
        ...state,
        web3,
        connectWeb3,
        logout,
        mintToken,
        isOwner,
        newOwner,
        removeOwner,
        itemOwner,
        transferItem
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
