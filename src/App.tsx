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
    // <div className="App">
    //   <Sidebar></Sidebar>
    //   <SplitterLayout primaryIndex={1} secondaryInitialSize={250}>
    //     <MenuArea />
    //     <MainArea />
    //   </SplitterLayout>

    //   {/* <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <Counter />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <span>
    //       <span>Learn </span>
    //       <a
    //         className="App-link"
    //         href="https://reactjs.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux-toolkit.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux Toolkit
    //       </a>
    //       ,<span> and </span>
    //       <a
    //         className="App-link"
    //         href="https://react-redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React Redux
    //       </a>
    //     </span>
    //   </header> */}
    // </div>
  );
}

export default App;
