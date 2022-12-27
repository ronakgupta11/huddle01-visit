
import { useState } from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
// import { providerOptionsIm } from "../providerOptions";


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
        }
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

    return(
        <div className="hom">
            <h1 className='heading'>Caller</h1>
            <p className='des'>decentralized wallet to wallet video calling platform.</p>
            {renderButton()}     
        </div>
    )
}