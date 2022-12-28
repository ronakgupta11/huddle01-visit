import logo from './logo.svg';
import './App.css';
// import Home from './components/home';
import Main from './components/main';
import {HuddleClientProvider, getHuddleClient } from '@huddle01/huddle01-client';
import MeVideoElem from './components/MeVideoElem';
import PeerVideoAudioElem from './components/PeerVideoAudioElem';
import { useState } from 'react';
import { useHuddleStore } from "@huddle01/huddle01-client/store";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import * as PushAPI from "@pushprotocol/restapi";

import Notification from './components/Notification';


function App() {

  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const [address, setAddress] = useState("");
  const huddleClient = getHuddleClient("702b03a76c58010686023dac1caeb63696b04b1c069ef14405b4ede34ed1586b");
  
  const [walletConnected, setWalletConnected] = useState(false);
  const web3Modal = new Web3Modal({
        network: "goerli",
        providerOptions : {},
        disableInjectedProvider: false,
      });

    let signer;
    let provider; 

    let instance;

    async function connectWallet(){

        instance = await web3Modal.connect();
        provider = new ethers.providers.Web3Provider(instance);
        signer = provider.getSigner();
        setAddress(await signer.getAddress());
        setWalletConnected(true);
        console.log(signer);
        }
    console.log(signer);
    async function disconnect(){
        await web3Modal.clearCachedProvider();
        provider = null;
        signer = null;
        setWalletConnected(false);
        renderButton();
        setAddress("");
    }
    function renderButton(){
        if(walletConnected){
            return(
                <div>

                <p>wallet address = {address}</p>
                <button onClick={disconnect}>disconnect wallet</button>
                </div>
            )
        }
        else{
            return(
                <button onClick={connectWallet}>Connect Wallet</button>
            )
        }
    }
  
  return (
    <HuddleClientProvider client = {huddleClient} >

    <div className="App">
    <div className="hom">
            <h1 className='heading'>Caller</h1>
            <p className='des'>decentralized wallet to wallet video calling platform.</p>
            {renderButton()}
            {/* <button onClick={sendNotification}>send</button>      */}
        </div>
      {/* <Home address = {address} set = {setAddress}/> */}
      <Main address = {address} client = {huddleClient}/>
      <Notification connect = {connectWallet} signer = {signer}/>
      <MeVideoElem/>
      <div className='peer-section'>

      <p>---------peer section------------</p>
      {lobbyPeers[0] && <h2>Lobby Peers</h2>}
          <div>
          {lobbyPeers.map((peer) => (
            <div>{peer.peerId}</div>
            ))}
            </div>
            
            {peersKeys[0] && <h2>Peers</h2>}
            
            <div className="peers-grid">
            {peersKeys.map((key) => (
              <PeerVideoAudioElem key={`peerId-${key}`} peerIdAtIndex={key} />
              ))}
            </div>
            </div>
    </div>
    </HuddleClientProvider>
    
  );
}

export default App;
