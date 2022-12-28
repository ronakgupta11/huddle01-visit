import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import { useState } from "react";

export default function Notification(props){

    
    let notifications;
      const [rendered,setRendered] = useState([]);
      async function getNot(){
        const signer = await props.signer(true);
      notifications = await PushAPI.user.getFeeds({
            user: `eip155:5:${await signer.getAddress()}`, // user address in CAIP
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
        const sendNotification = async() => {
            try {
    
              const signer = await props.signer(true);
              console.log("signer in send",signer)
            //   let subscriptions = await PushAPI.user.getSubscriptions({
            //     user: 'eip155:5:0xD7D98e76FcD14689F05e7fc19BAC465eC0fF4161', // user address in CAIP
            //     env: 'staging'
            //   });
            //   console.log(subscriptions)
    
    
    
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
                recipients: `eip155:5:${props.receiptent}`, // recipient address //get value from input box
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
        <div className="notification-section">

                    
        <div className="get-notif">
        <button onClick={getNot}>get Notification</button>
        
        {console.log("render before-",rendered)}
  
        {rendered}
          </div> 
        <div className="send-notif">
        <button onClick={sendNotification}>send</button>     


        </div>
        </div>
        )
}