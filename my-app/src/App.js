
import './App.css';

// import Main from './components/main';
import {HuddleClientProvider, getHuddleClient } from '@huddle01/huddle01-client';
import MeVideoElem from './components/MeVideoElem';
import PeerVideoAudioElem from './components/PeerVideoAudioElem';
import { useState } from 'react';
import { useHuddleStore } from "@huddle01/huddle01-client/store";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
// import * as PushAPI from "@pushprotocol/restapi";

import Notification from './components/Notification';


function App() {

  const huddleClient = getHuddleClient("702b03a76c58010686023dac1caeb63696b04b1c069ef14405b4ede34ed1586b");
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const isJoined = useHuddleStore((state) => state.roomState.joined);

  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("");

  const [recptAddress,setRecptAddress] = useState("");
  
  const web3Modal = new Web3Modal({
        network: "goerli",
        providerOptions : {},
        disableInjectedProvider: false,
      });

    ;

    const getProviderOrSigner = async(needSigner = false) => {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      if(needSigner){
        const signer = provider.getSigner();
        return signer;

      }
      return provider;
    }

    async function connectWallet(){


        const signer = await getProviderOrSigner(true);
        setAddress(await signer.getAddress());
        setWalletConnected(true);
        console.log(signer);
        }
    // console.log(signer);
    async function disconnect(){
        await web3Modal.clearCachedProvider();
        // provider = null;
        // signer = null;
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

    const handleJoin = async () => {
      try {
        await huddleClient.join("dev", {
          address: address,
          wallet: "",
          ens: "",
        });
  
        console.log("joined");
        console.log(isJoined);
      } catch (error) {
        console.log({ error });
      }
    };

    const handleToggleRoomLock = async () => {
      if (!huddleClient) {
        console.error('huddleClient is not initialized');
  
        return;
      }
      if(isJoined){


      await huddleClient.toggleRoomLock();
      console.log("toogled room lock")}
      else{
      console.log("is joined",isJoined)
      console.log("cant toogle host not joined")}
    };


    const renderMeetContainer = () =>{
      return (
        <div>
          <HuddleClientProvider value={huddleClient}>
            
            <div className="">
              <div className="">
                <MeVideoElem />
              </div>
  
              <div className="">
                <div className="">
                  {peersKeys.map((key) => (
                    <PeerVideoAudioElem key={`peerId-${key}`} peerIdAtIndex={key} />
                  ))}
                </div>
              </div>
            </div>
            <div className="">
              <button onClick={handleJoin}>Join Room</button>
              <button onClick={() => huddleClient.enableWebcam()}>
                Enable Webcam
              </button>
              <button onClick={() => huddleClient.disableWebcam()}>
                Disable Webcam
              </button>
              {/* <button onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}>
                allowAllLobbyPeersToJoinRoom()
              </button> */}
              {/* <button onClick={() => setStatus(false) }>
                Exit
              </button> */}
              <button onClick={handleToggleRoomLock}>Toogle Room Lock</button>
            </div>
          </HuddleClientProvider>
        </div>
      );
    }
  
  return (
    // <HuddleClientProvider client = {huddleClient} >

    <div className="App">
      <div className="hom">
            <h1 className='heading'>Caller</h1>
            <p className='des'>decentralized wallet to wallet video calling platform.</p>
            {renderButton()}

      </div>
      <div className='input-sec'>
              <p>enter wallet address to make call to:</p>
              <input type = "text" placeholder= "enter wallet address"></input>
              <button >request a video call</button>
        {//use setRecptAddress to set recipents address
}
      </div>
            {/* <button onClick={sendNotification}>send</button>      */}
      {/* <Home address = {address} set = {setAddress}/> */}
      {/* <Main  setRecpt = {setRecptAddress} address = {address} client = {huddleClient}/> */}
      <Notification  receiptent = {recptAddress} signer = {getProviderOrSigner}/>
      {renderMeetContainer()}
      {/* <MeVideoElem/> */}
      {/* <div className='peer-section'>

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
            </div> */}
    </div>
    // </HuddleClientProvider>
    
  );
}

export default App;
