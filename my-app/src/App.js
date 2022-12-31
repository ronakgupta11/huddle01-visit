
import './App.css';

// import Main from './components/main';
import {HuddleClientProvider, getHuddleClient } from '@huddle01/huddle01-client';
import MeVideoElem from './components/MeVideoElem';
import PeerVideoAudioElem from './components/PeerVideoAudioElem';
import { useState } from 'react';
import { useHuddleStore } from "@huddle01/huddle01-client/store";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
// import * as PushAPI from "@pushprotocol/restapi";
import { HuddleIframe, huddleIframeApp, HuddleAppEvent  } from "@huddle01/huddle01-iframe";




function App() {

  const huddleClient = getHuddleClient("702b03a76c58010686023dac1caeb63696b04b1c069ef14405b4ede34ed1586b");
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const isJoined = useHuddleStore((state) => state.roomState.joined);

  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [rendered,setRendered] = useState([]);

  
  const [notifications,setNotifications] = useState([]);
  const [recptAddress,setRecptAddress] = useState("");

  const [message,setMessage] = useState("")
  const [iframe,setIframe]= useState(false);
  const [incall,setIncall] = useState(false);
  


  
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

    async function connectWalleta(){


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
                <div>

                <p>wallet address = {address}</p>
                <button onClick={disconnect}>disconnect wallet</button>
                </div>
            )
        }
        else{
            return(
                <button onClick={connectWalleta}>Connect Wallet</button>
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
              {/* <button  onClick={handleJoin}>Join Room</button> */}
              <button onClick={() => huddleClient.enableWebcam()}>
                Enable Webcam
              </button>
              <button onClick={() => huddleClient.disableWebcam()}>
                Disable Webcam
              </button>
              <button onClick={() => huddleClient.disableMic()}>
                Mute
              </button>
              <button onClick={() => huddleClient.enableMic()}>
                Unmute
              </button>
              <button onClick={() => huddleClient.enableMic()}>
                Exit
              </button>

              {/* <button onClick={handleToggleRoomLock}>Toogle Room Lock</button> */}
            </div>
          </HuddleClientProvider>
        </div>
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

          <NotificationItem
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
              />
              <button onClick={()=>joinFromNotificaton()}>join Now</button>
              </div>
            );
          });
        setRendered(rendered_not);
        }
        const sendNotification = async() => {
            try {
              connectWalleta();
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
        huddleIframeApp.methods.connectWallet(address)
        huddleIframeApp.on("me-left", ()=>{setIframe(false)});
  return (


    <div className="App">
      <div className="home">
            <h1 className='heading'>Caller</h1>
            <p className='des'>decentralized wallet to wallet video calling platform.</p>
            {renderButton()}
      </div>

      <div className="notification-section">
          <div className="send-notif">
            
            <input type="text" onChange = {handleInputChange} placeholder ="enter wallet address"></input>
            <input type="text" onChange = {handleMsgChange} placeholder ="enter call msg"></input>
            <button onClick={sendNotification}>request Call</button>     
          </div>
          <div className="get-notif">
            <button onClick={getNot}>get Notification</button>
            {rendered[0]}
          </div> 
      </div>
      {incall && renderMeetContainer()}
          
      {(iframe === true) && <HuddleIframe config={iframeConfig} />}
      {/* <button onClick={renderIframe}>get Iframe</button> */}

    </div>

    
  );
}

export default App;
