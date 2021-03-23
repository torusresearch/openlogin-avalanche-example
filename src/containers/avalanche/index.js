/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { Avalanche, BinTools } from "avalanche"
import { PageHeader, Button } from "antd";
import { useHistory } from "react-router";
import { verifiers } from "../../utils/config";
import "./style.scss";

const bintools = BinTools.getInstance();



function Ethereum() {
  const [loading, setLoading] = useState(false);
  const [sdk, setSdk] = useState(undefined);
  const [accountInfo, setUserAccountInfo] = useState(null);
  
  const history = useHistory();
  useEffect(() => {
    async function initializeOpenlogin() {
      setLoading(true)
      const sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
      await sdkInstance.init();
      if (!sdkInstance.privKey) {
        await sdkInstance.login({
          loginProvider: "google",
          redirectUrl: `${window.origin}/avalanche`,
        });
      }
      const myNetworkID = 5; 
      const avalanche = new Avalanche("api.avax-test.network", 443, "https", myNetworkID);
      const xchain = avalanche.XChain(); //returns a reference to the X-Chain used by AvalancheJS
      const myKeychain = xchain.keyChain();
      const importedAccount = myKeychain.importKey(Buffer.from(sdkInstance.privKey,"hex")); // returns an instance of the KeyPair class
      let address = importedAccount.getAddressString()
      const myAddresses = xchain.keyChain().getAddressStrings(); 
      const u = await xchain.getUTXOs(myAddresses);
      const utxos = u.utxos
      const assetid = "8pfG5CTyL5KBVaKrEnCvNJR95dUWAKc1hrffcVxfgi8qGhqjm"; // random cb58 string
      const mybalance = utxos.getBalance(myAddresses, assetid);
      console.log(mybalance,"bal")
      setUserAccountInfo({balance: mybalance, address});
      setSdk(sdkInstance);
      setLoading(false)
    }
    initializeOpenlogin();
  }, []);


  const handleLogout = async () => {
    await sdk.logout();
    history.push("/");
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Openlogin x Avalanche (Fuji testnet)"
        extra={[
          <Button key="1" type="primary" onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      />

      {
          loading ?
          <div className="container">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
               <h1>....loading</h1>
               </div>
               </div>
               : 
               <div className="container">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
            <div style={{margin:20}}>
              Wallet address: <i>{accountInfo?.address}</i>
            </div>
            <div style={{margin:20}}>
              Balance: <i>{accountInfo?.balance?.toNumber()}</i>
            </div>
            <div style={{margin:20}}>
              Private key: <i>{(sdk && sdk.privKey)}</i>
            </div>
          </div>
        </div>
      }
   
        
    </div>
  );
}

export default Ethereum;
