import React from "react";


export default function Main(props){
    const handleJoin = async () => {
        try {
          await props.client.join("dev", {
            address: props.address,
            wallet: "",
            ens: "",
          });
    
          console.log("joined");
        } catch (error) {
          console.log({ error });
        }
      };
    
    return(
    <div className="main">
        <p>enter wallet address to make call to:</p>
        <input type = "text" placeholder= "enter wallet address"></input>
        <button >request a video call</button>
        <button onClick={() => props.client.enableWebcam()}>enable cam</button>
        <button onClick={() => props.client.disableWebcam()}>disable cam</button>
        <button onClick={handleJoin}>join room</button>
    </div>)
}