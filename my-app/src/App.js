import "./App.css"
import "./default.css"

// import Main from './components/main';
import {HuddleClientProvider, getHuddleClient } from '@huddle01/huddle01-client';
import MeVideoElem from './components/MeVideoElem';
import PeerVideoAudioElem from './components/PeerVideoAudioElem';
import { useState } from 'react';
import { useHuddleStore } from "@huddle01/huddle01-client/store";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import * as PushAPI from "@pushprotocol/restapi";
// import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
// import * as PushAPI from "@pushprotocol/restapi";
// import { HuddleIframe, huddleIframeApp, HuddleAppEvent  } from "@huddle01/huddle01-iframe";
import Features from "./components/features";
import Notification from "./components/Notification";



function App() {

  const huddleClient = getHuddleClient("702b03a76c58010686023dac1caeb63696b04b1c069ef14405b4ede34ed1586b");
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  // const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const isJoined = useHuddleStore((state) => state.roomState.joined);

  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [rendered,setRendered] = useState([]);

  
  const [notifications,setNotifications] = useState([]);
  const [recptAddress,setRecptAddress] = useState("");

  const [message,setMessage] = useState("")
  // const [iframe,setIframe]= useState(false);
  const [incall,setIncall] = useState(false);
  
const [peerMessage,setPeermessage] = useState("Waiting for user to Join in...")

  
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

    async function disconnect(){
        await web3Modal.clearCachedProvider();

        setWalletConnected(false);
        renderButton();
        setAddress("");
    }
    function renderButton(){
        if(walletConnected){
            return(
                <div className="wallet-ctn">

                <p className="wallet-add">{address}</p>
                <button className = "btn-mod btn-dis"onClick={disconnect}>disconnect wallet</button>
                </div>
            )
        }
        else{
            return(
              <div>

                <button className="btn-mod" onClick={connectWallet}>Connect Wallet</button>
              </div>
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
      } catch (error) {
        console.log({ error });
      }
    };

    function joinFromNotificaton(){
      handleJoin();
      setIncall(true)
  
    }

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
        <HuddleClientProvider value={huddleClient}>
            <div className="meet-container">
            
            <div className="me">
              <div className="me-video">
                <MeVideoElem />
              </div>
              <div className="vid-btn">
              
              <button  className=" btn-sm-mod" onClick={() => huddleClient.enableWebcam()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#629110" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              </button>
              <button className="btn-sm-mod" onClick={() => huddleClient.disableWebcam()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#629110" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-video-off"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
              <button  className=" btn-sm-mod"onClick={() => huddleClient.unmuteMic()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#629110" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              </button>
              <button className=" btn-sm-mod" onClick={() => huddleClient.muteMic()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#629110" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-mic-off"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              </button>
              <button className=" btn-sm-mod" onClick={() => exit()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#911710" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-phone-off"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
              </button>
            </div>
  
                  </div>
              <div className="peer">
                {!peersKeys[0] && <h3>{peerMessage}</h3>}
                {peersKeys[0] && <div className="me-video">
                  {peersKeys.map((key) => (
                    <PeerVideoAudioElem key={`peerId-${key}`} peerIdAtIndex={key} />
                  ))}
                </div>}
              </div>
  
        </div>
          </HuddleClientProvider>
      );
    }



  async function getNot(){
        // window.location.reload(false)
        const signer = await getProviderOrSigner(true);
        const notificationsFromApi = await PushAPI.user.getFeeds({
            user: `eip155:5:${await signer.getAddress()}`, // user address in CAIP
            env: 'staging'
          });
        setNotifications(notificationsFromApi);
        console.log("notification: ",notifications)
      const rendered_not = notifications.map((oneNotification, i) => {
        const { 
            cta,
            title,
            message,
            app,
            icon,
            image,
            url,
            blockchain,
            notification
        } = oneNotification;
    
        return (
          <div>

          {/* <NotificationItem
              key={`notif-${i}`} // any unique id
              notificationTitle={title}
              notificationBody={message}
              cta={cta}
              app={app}
              icon={icon}
              image={image}
              url={url}
              theme="light"
              chainName={blockchain}
              // chainName={blockchain as chainNameType} // if using Typescript
              /> */}
              {/* <button onClick={()=>joinFromNotificaton()}>join Now</button> */}
              <Notification
              key = {`notif-${i}`}
              title = {title}
              body = {message}
              join = {joinFromNotificaton}
              exit = {setPeermessage}
              />
              </div>
            );
          });
        setRendered(rendered_not);
        }
        const sendNotification = async() => {
            try {
              connectWallet();
              const signer = await getProviderOrSigner(true);
              const apiResponse = await PushAPI.payloads.sendNotification({
                signer,
                type: 3, // target
                identityType: 2, // direct payload
                notification: {
                  title: `[SDK-TEST] notification TITLE: test`,
                  body: `[sdk-test] notification BODY Testing notification`
                },
                payload: {
                  title: `8. call requested from ${await signer.getAddress()}`,
                  body: `${message} [u:#join]`,
                  cta: "https://iframe.huddle01.com/123",
                  img: ''
                },
                recipients: `eip155:5:${recptAddress}`, // recipient address //get value from input box
                channel: 'eip155:5:0xD7D98e76FcD14689F05e7fc19BAC465eC0fF4161', // your channel address
                env: 'staging'
              });
              
              // apiResponse?.status === 204, if sent successfully!
              console.log('API repsonse: ', apiResponse);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
              // for Iframe
              // setIframe(true);
              // setTimeout(connectWalleta,5000)
////////////////////////////////////////////////////////////////////////////////////////////////////////////
              setIncall(true)
              handleJoin();
              console.log(isJoined)
              setTimeout(()=>huddleClient.toggleRoomLock(),10000);
              

            } catch (err) {
              console.error('Error: ', err);
            }
            
          }
          function handleInputChange(event){
            console.log(event.target.value);
            setRecptAddress(event.target.value)
          }
        
          function handleMsgChange(event){
            setMessage(event.target.value);
          }
          // const url = window.location.href;
          // console.log("url:",url)
          // const urlParam = url.split("=");
          // console.log(urlParam[1])
          // if(urlParam[1]===true){
          //   huddleClient.enableWebcam();
          // }

          const iframeConfig = {
            roomUrl: "https://iframe.huddle01.com/123",
            height: "600px",
            width: "80%",
            noBorder: false, // false by default
          };
        // function renderIframe(){
        //   // connectWalleta()
        //   setIframe(true);
          
        // }
        // huddleIframeApp.methods.connectWallet(address)
        // huddleIframeApp.on("me-left", ()=>{setIframe(false)});
        function exit(){
          setIncall(false)
          huddleClient.closeRoomForEverybody()
          huddleClient.close();}
        function exitFromNotification(){
          setPeermessage("User declined the call..");
        }

      
  return (


    <div className= "main">
      <div className= "head">
            <h1 className= "head-h1">Caller</h1>
            <p className="head-p">A decentralized wallet to wallet video calling platform made using huddle01 and Push protocol</p>
            {renderButton()}
      </div>

      {!incall && <div className="notification-section">
      <div className="get-notif">
            <p>Incoming calls..</p>
            <button onClick={getNot}>get Notification</button>
            {rendered[0]}
          </div> 
          <div className="form">
            <h2 className="input-head">start by making a call</h2>
            <input className="input-form" type="text" onChange = {handleInputChange} placeholder ="enter wallet address"></input>
            <input className="input-form" type="text" onChange = {handleMsgChange} placeholder ="enter call msg"></input>
            <button className="btn-mod" onClick={sendNotification}>request Call</button>     
          </div>
          
    </div>}
      {incall && renderMeetContainer()}
          
      {/* {(iframe === true) && <HuddleIframe config={iframeConfig} />} */}
      {/* <button onClick={renderIframe}>get Iframe</button> */}
    {!incall && <Features/>}
    </div>


    
  );
}

export default App;
