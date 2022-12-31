import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import { useEffect, useState } from "react";

export default function Notification(props){
  
  
  let repeat;
  const [notifications,setNotifications] = useState([]);
  const [recptAddress,setRecptAddress] = useState("");

  const [message,setMessage] = useState("")

  async function getNot(){
        // window.location.reload(false)
        const signer = await props.signer(true);
        const notificationsFromApi = await PushAPI.user.getFeeds({
            user: `eip155:5:${await signer.getAddress()}`, // user address in CAIP
            env: 'staging'
          });
        setNotifications(notificationsFromApi);
        console.log("notificatio ",notifications)
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
                <button onClick={()=>handleJoin()}>join Now</button>
                </div>
            );
          });
        props.renderNot(rendered_not);
        console.log(window.location.href)
        // console.log(rendered);
        // repeat = setInterval(getNot,15000);
        }
        const sendNotification = async() => {
            try {
    
              const signer = await props.signer(true);
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
                  cta: "google.com/?join=true",
                  img: ''
                },
                recipients: `eip155:5:${recptAddress}`, // recipient address //get value from input box
                channel: 'eip155:5:0xD7D98e76FcD14689F05e7fc19BAC465eC0fF4161', // your channel address
                env: 'staging'
              });
              
              // apiResponse?.status === 204, if sent successfully!
              console.log('API repsonse: ', apiResponse);
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
            // console.log(event.target.value);
            // console.log(message);
          }
          const url = window.location.href;
          const urlParam = url.split("=");
          if(urlParam[1]===true){
            
          }

        return(
        <div className="notification-section">
          <div className="send-notif">
            
            <input type="text" onChange = {handleInputChange} placeholder ="enter wallet address"></input>
            <input type="text" onChange = {handleMsgChange} placeholder ="enter call msg"></input>
            <button onClick={sendNotification}>request Call</button>     
          </div>
          <div className="get-notif">
            <button onClick={getNot}>get Notification</button>
            {props.notification[0]}
          </div> 
        </div>
        )
}