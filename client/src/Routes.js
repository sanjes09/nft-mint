import React, { useState, useEffect, useContext} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateNFT from "./views/CreateNFT/CreateNFT";
import Dashboard from "./views/Dashboard/Dashboard";
import Item from './views/Item/Item';
import { Web3Context } from "./web3";

const Routes = () => {
  const { account, isOwner } = useContext(Web3Context);

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    isOwner().then(resp => {
      setAuth(resp)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <>
      <BrowserRouter>
        <Switch> 
          {auth && <Route exact path="/mint-nft" component={CreateNFT}/>}

          <Route exact path="/item/:id" component={Item}/>
          <Route exact path="/" component={Dashboard}/>
          
          <Route exact component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Routes;
