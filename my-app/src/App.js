import logo from './logo.svg';
import './App.css';
import Home from './components/home';
import Main from './components/main';
import {HuddleClientProvider, getHuddleClient } from '@huddle01/huddle01-client';
import MeVideoElem from './components/MeVideoElem';
import PeerVideoAudioElem from './components/PeerVideoAudioElem';
import { useState } from 'react';
import { useHuddleStore } from "@huddle01/huddle01-client/store";


function App() {
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const [address, setAddress] = useState("")

  const huddleClient = getHuddleClient("702b03a76c58010686023dac1caeb63696b04b1c069ef14405b4ede34ed1586b");
  return (
    <HuddleClientProvider client = {huddleClient} >

    <div className="App">
      <Home address = {address} set = {setAddress}/>
      <Main address = {address} client = {huddleClient}/>
      <MeVideoElem/>
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
    </div>
    </HuddleClientProvider>
    
  );
}

export default App;
