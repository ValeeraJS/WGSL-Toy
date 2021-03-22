import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import './App.css';
import Sidebar from './framework/sidebar/Sidebar';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import MenuArea from './framework/menuarea/MenuArea';
import MainArea from './framework/mainarea/MainArea';
import ConsoleBar from './framework/ConsoleBar/ConsoleBar';
import RightSide from './framework/rightside/RightSide';


function App() {
  return (
    <SplitterLayout primaryIndex={1} secondaryInitialSize={250}>
      <div style={{
        display: 'flex',
        height: '100vh'
      }}>
        <Sidebar />
        <MenuArea />
      </div>
      <SplitterLayout secondaryInitialSize={250}>
        <SplitterLayout vertical secondaryInitialSize={250}>
          <div style={{
            height: '100%',
            overflow: 'hidden'
          }}>
            <MainArea />
          </div>
          <ConsoleBar />
        </SplitterLayout>
        <RightSide/>
      </SplitterLayout>
    </SplitterLayout>
  );
}

export default App;
