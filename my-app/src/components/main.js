import React from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import { useState } from "react";


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
      let notifications;
      const [rendered,setRendered] = useState([]);
      async function getNot(){
      notifications = await PushAPI.user.getFeeds({
            user: 'eip155:5:0x294d985B6BC5dA375b571B5fDE228334343f4EdF', // user address in CAIP
            env: 'staging'
          });
        console.log(notifications)
      
      // getNot();
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
            );
          });
          setRendered(rendered_not);
          // console.log("rendered-notif",rendered);
          // return(
          //   <div>{rendered}</div>
          // );
        }
        // setInterval(getNot(),10000);
    
    return(
    <div className="main">
        <p>enter wallet address to make call to:</p>
        <input type = "text" placeholder= "enter wallet address"></input>
        <button >request a video call</button>
        <button onClick={() => props.client.enableWebcam()}>enable cam</button>
        <button onClick={() => props.client.disableWebcam()}>disable cam</button>
        <button onClick={handleJoin}>join room</button>
        <button onClick={getNot}>get Notification</button>
        
        <div>
      {console.log("render before-",rendered)}

      {rendered}
        </div> 

        
    </div>)
}