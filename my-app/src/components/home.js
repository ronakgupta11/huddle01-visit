
import { useState } from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
// import { providerOptionsIm } from "../providerOptions";
import * as PushAPI from "@pushprotocol/restapi";




export default function Home(props){
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
        props.set(await signer.getAddress());
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
        props.set("");
    }
    function renderButton(){
        if(walletConnected){
            return(
                <div>

                <p>wallet address = {props.address}</p>
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
    const sendNotification = async() => {
        try {

          connectWallet()
          console.log("signer in send",signer)
          let subscriptions = await PushAPI.user.getSubscriptions({
            user: 'eip155:5:0xD7D98e76FcD14689F05e7fc19BAC465eC0fF4161', // user address in CAIP
            env: 'staging'
          });
          console.log(subscriptions)



          const apiResponse = await PushAPI.payloads.sendNotification({
            signer,
            type: 3, // target
            identityType: 2, // direct payload
            notification: {
              title: `[SDK-TEST] notification TITLE: test`,
              body: `[sdk-test] notification BODY Testing notification`
            },
            payload: {
              title: `call requested from ${await signer.getAddress()}`,
              body: `to join call go to bellow link`,
              cta: 'www.about.com',
              img: ''
            },
            recipients: 'eip155:5:0x294d985B6BC5dA375b571B5fDE228334343f4EdF', // recipient address
            channel: 'eip155:5:0xD7D98e76FcD14689F05e7fc19BAC465eC0fF4161', // your channel address
            env: 'staging'
          });
          
          // apiResponse?.status === 204, if sent successfully!
          console.log('API repsonse: ', apiResponse);
        } catch (err) {
          console.error('Error: ', err);
        }
      }
    return(
        <div className="hom">
            <h1 className='heading'>Caller</h1>
            <p className='des'>decentralized wallet to wallet video calling platform.</p>
            {renderButton()}
            <button onClick={sendNotification}>send</button>     
        </div>
    )
}