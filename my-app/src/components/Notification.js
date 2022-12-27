import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";

export default function Notification(){
    async function getNot(){
    const notifications = await PushAPI.user.getFeeds({
        user: 'eip155:5:0x294d985B6BC5dA375b571B5fDE228334343f4EdF', // user address in CAIP
        env: 'staging'
      });

{notifications.map((oneNotification, i) => {
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
            key= {i} // any unique id
            notificationTitle={title}
            notificationBody={message}
            cta={cta}
            app={app}
            icon={icon}
            image={image}
            url={url}
            theme="dark"
            chainName={blockchain}
            // chainName={blockchain as chainNameType} // if using Typescript
        />
        );
    })}
}
return(
    <button onClick={getNot}>get Notification</button>
)

}