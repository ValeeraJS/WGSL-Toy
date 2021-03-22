import { Tabs, Menu, Dropdown } from "antd";
import React, { Component } from "react";
import CodePage from "./CodePage";
import { CaretRightOutlined } from "@ant-design/icons";
import IconButton from "./IconButton";
import styles from "./Tabs.module.css";
import BlobDownloader from "@valeera/blobdownloader";
import Dropzone from "react-dropzone";
import ShaderTypeSelect from "./ShaderTypeSelect";
import { updateMaterialShader, wgslShaders } from "../rightside/RenderingAreaWebGPU";

const { TabPane } = Tabs;

interface TabTitleProps {
  name: string;
  keyId: string | number;
  onDel?: any;
  onSaveCode?: any;
  onCopyPage?: any;
  onCloseOther?: any;
  onCloseRight?: any;
}

interface TabTitleState {
  name: string;
  isEdit: boolean;
}

class TabTitle extends Component<TabTitleProps, TabTitleState> {
  state = {
    name: this.props.name,
    isEdit: false,
  };

  inputRef = React.createRef() as any;

  rename = () => {
    this.setState(
      {
        isEdit: true,
      },
      () => {
        this.inputRef?.current?.select();
      }
    );
  };

  finishEdit = () => {
    this.setState({
      isEdit: false,
    });
  };

  changeName = (e: any) => {
    this.setState({
      name: e.target.value,
    });
  };

  textSelect = (e: any) => {
    e.stopPropagation();
  };

  onDel = () => {
    this.props.onDel?.(this.props.keyId);
  };

  onSaveCode = () => {
    this.props.onSaveCode?.(this.props.keyId, this.state.name);
  };

  onCopyPage = () => {
    this.props.onCopyPage?.(this.props.keyId, this.state.name);
  };

  onCloseOther = () => {
    this.props.onCloseOther?.(this.props.keyId);
  };

  onCloseRight = () => {
    this.props.onCloseRight?.(this.props.keyId);
  };

  contextMenu = (
    <Menu>
      <Menu.Item key="1" onClick={this.rename}>
        Rename
      </Menu.Item>
      <Menu.Item key="2" onClick={this.onCopyPage}>
        Copy
      </Menu.Item>
      <Menu.Item key="3" onClick={this.onSaveCode}>
        Download Code
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={this.onDel}>
        Close
      </Menu.Item>
      <Menu.Item key="5" onClick={this.onCloseOther}>
        Close other tabs
      </Menu.Item>
      <Menu.Item key="6" onClick={this.onCloseRight}>
        Close tabs to the right
      </Menu.Item>
    </Menu>
  );

  render() {
    const { name, isEdit } = this.state;
    return (
      <Dropdown overlay={this.contextMenu} trigger={["contextMenu"]}>
        <span>
          {isEdit ? (
            <input
              maxLength={16}
              onSelect={this.textSelect}
              ref={this.inputRef}
              type="text"
              value={name}
              className={styles.renameinput}
              onBlur={this.finishEdit}
              onChange={this.changeName}
            />
          ) : (
            <>{name || "Untitled.wgsl"}</>
          )}
        </span>
      </Dropdown>
    );
  }
}

export default class PageTabs extends Component {
  newTabIndex = 0;

  onChange = (activeKey: string) => {
    this.setState({ activeKey });
    this.state.panes.forEach((pane: any, i: number) => {
      if (pane.key === activeKey && pane.ref?.current?.isCodePage) {
        updateMaterialShader(pane.ref.current.state.code, pane.ref.current.state.language);
      }
    });
  };

  onEdit = (targetKey: any, action: React.ReactText) => {
    (this as any)[action](targetKey);
  };

  // 添加代码页
  add = (
    key: string = "",
    tabName: string = "",
    code: string = `[[location(0)]] var<out> fragColor : vec4<f32>;

[[stage(fragment)]] fn main() -> void {
    fragColor = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return;
}
`
  ) => {
    const { panes } = this.state;
    const activeKey = key + `${Date.now()}`;
    const newPanes = [...panes];
    const tmpRef = React.createRef() as any;
    newPanes.push({
      title: (
        <TabTitle
          name={tabName}
          keyId={activeKey}
          onCloseRight={this.onCloseRight}
          onCloseOther={this.onCloseOther}
          onDel={this.remove}
          onSaveCode={this.onSaveCode}
          onCopyPage={this.onCopyPage}
        />
      ),
      content: <CodePage language="wgsl" ref={tmpRef} code={code} />,
      key: activeKey,
      ref: tmpRef,
    });
    updateMaterialShader(code);
    this.setState({
      panes: newPanes,
      activeKey,
    });
  };

  remove = (targetKey: string) => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex: number = -1;
    panes.forEach((pane: any, i: number) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane: any) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

  onSaveCode = (targetKey: string, name: string = "Untitled") => {
    this.state.panes.forEach((pane: any) => {
      if (pane.key === targetKey && pane.ref?.current) {
        const blob = new Blob([pane.ref.current.state.code], {
          type: "text/plain",
        });
        BlobDownloader.download(blob as any, name + ".wgsl");
      }
    });
  };

  onCopyPage = (targetKey: string, name: string = "Untitled") => {
    this.state.panes.forEach((pane: any) => {
      if (pane.key === targetKey && pane.ref?.current) {
        this.add("copy", name + " Copy", pane.ref.current.state.code);
      }
    });
  };

  onCloseOther = (targetKey: string) => {
    let arr: any[] = [];
    this.state.panes.forEach((pane: any, i: number) => {
      if (pane.key === targetKey) {
        arr.push(pane);
      }
    });
    this.setState({
      panes: arr,
    });
  };

  onCloseRight = (targetKey: string) => {
    let isFind = false;
    let arr: any[] = [];
    this.state.panes.forEach((pane: any, i: number) => {
      if (!isFind) {
        arr.push(pane);
      }
      if (pane.key === targetKey) {
        isFind = true;
      }
    });
    this.setState({
      panes: arr,
    });
  };

  tmpRef = React.createRef() as any;

  state = {
    activeKey: "1",
    panes: [
      {
        title: (
          <TabTitle
            name="Hello World.wgsl"
            keyId="1"
            onCloseRight={this.onCloseRight}
            onCloseOther={this.onCloseOther}
            onDel={this.remove}
            onSaveCode={this.onSaveCode}
            onCopyPage={this.onCopyPage}
          />
        ),
        content: <CodePage language="wgsl" ref={this.tmpRef} code={wgslShaders.fragment} />,
        ref: this.tmpRef,
        key: "1",
      },
    ],
  };

  runCode = () => {
    this.state.panes.forEach((pane: any, i: number) => {
      if (pane.key === this.state.activeKey && pane.ref?.current) {
        updateMaterialShader(pane.ref.current.state.code);
      }
    });
  };

  render() {
    const { panes, activeKey } = this.state;
    return (
      <Dropzone
        noClick
        noKeyboard
        multiple
        onDrop={(files, f, event) => {
          if (files.length) {
            for (let i = 0; i < files.length; i++) {
              let reader = new FileReader();
              reader.readAsText(files[i]);
              reader.onload = () => {
                this.add(
                  files[i].name,
                  files[i].name,
                  (reader.result as string) || ""
                );
              };
            }
          }
        }}
      >
        {({ getRootProps }) => {
          return (
            <div style={{ height: "100%" }} {...getRootProps()}>
              <Tabs
                type="editable-card"
                onChange={this.onChange}
                activeKey={activeKey}
                onEdit={this.onEdit}
                tabBarExtraContent={
                  <>
                    <ShaderTypeSelect/>
                    <IconButton
                      onClick={this.runCode}
                      icon={<CaretRightOutlined style={{ fontSize: "24px" }} />}
                    ></IconButton>
                  </>
                }
              >
                {panes.map((pane: any) => (
                  <TabPane tab={pane.title} key={pane.key} closable>
                    {pane.content}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          );
        }}
      </Dropzone>
    );
  }
}
