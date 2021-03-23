import { Tabs, Menu, Dropdown } from "antd";
import React, { Component } from "react";
import CodePage from "./CodePage";
import { CaretRightOutlined } from "@ant-design/icons";
import IconButton from "./IconButton";
import styles from "./Tabs.module.css";
import BlobDownloader from "@valeera/blobdownloader";
import Dropzone from "react-dropzone";
import ShaderTypeSelect from "./ShaderTypeSelect";
import { connect } from "react-redux";
import { RootState } from "../../app/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import {
  setCurrentCode,
  setCurrentShaderType,
  setNeedUpdate,
  ShaderType,
} from "../../features/editor/shaderSlice";
import {
  activeTab,
  addTab,
  editTab,
  removeTab,
  setTabs,
  TabDescripter,
} from "../../features/editor/tabSlice";
import getDefaultCode from "../../features/common/defaultCode";

const { TabPane } = Tabs;

interface TabTitleProps {
  name: string;
  keyId: string | number;
  language: ShaderType;
  onDel?: any;
  onSaveCode?: any;
  onCopyPage?: any;
  onCloseOther?: any;
  onCloseRight?: any;
  onRenameTab?: any;
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

  rename = () => {
    this.setState({
      isEdit: true,
    });
  };

  finishEdit = () => {
    this.setState({
      isEdit: false,
    });
    this.props.onRenameTab(this.state.name, this.props.keyId);
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

  checkFinishEdit = (e: any) => {
    if (e.keyCode === 13) {
      this.finishEdit();
    }
  };

  render() {
    const { name, isEdit } = this.state;
    return (
      <Dropdown overlay={this.contextMenu} trigger={["contextMenu"]}>
        <span>
          {isEdit ? (
            <input
              maxLength={16}
              onSelect={this.textSelect}
              type="text"
              value={name}
              className={styles.renameinput}
              onBlur={this.finishEdit}
              onChange={this.changeName}
              onKeyDown={this.checkFinishEdit}
            />
          ) : (
            <>
              {name || "Untitled"}
              {getShaderSuffix(this.props.language)}
            </>
          )}
        </span>
      </Dropdown>
    );
  }
}

function getShaderSuffix(type: ShaderType) {
  if (type === ShaderType.WGSL) {
    return ".wgsl";
  } else {
    return ".glsl";
  }
}

@(connect(
  (state: RootState) => {
    return {
      tabs: state.tabs,
      shader: state.shader,
    };
  },
  (dispatch) => {
    return bindActionCreators(
      {
        setNeedUpdate,
        setCurrentCode,
        setCurrentShaderType,
        addTab,
        activeTab,
        removeTab,
        editTab,
        setTabs,
      },
      dispatch
    );
  }
) as any)
export default class PageTabs extends Component<any, any> {
  newTabIndex = 0;

  onChange = (activeKey: string) => {
    let { panes } = this.props.tabs;
    panes.forEach((pane: any, i: number) => {
      if (pane.key === activeKey && pane.isCodePage) {
        this.props.setCurrentCode(pane.code);
        this.props.setCurrentShaderType(pane.language);
        this.props.setNeedUpdate(true);
      }
    });
    this.props.activeTab(activeKey);
  };

  onRenameTab = (name: string, activeKey: string) => {
    let { panes } = this.props.tabs;
    panes.forEach((pane: any, i: number) => {
      if (pane.key === activeKey) {
        let result = { ...pane };
        result.title = name;
        this.props.editTab(result);
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
    code: string | null | undefined,
    language: ShaderType = this.props.shader.globalShaderType
  ) => {
    const activeKey = key + `${Date.now()}`;
    const destripter: TabDescripter = {
      title: tabName,
      content: "CodePage",
      language: language,
      code: code || getDefaultCode(language),
      isCodePage: true,
      key: activeKey,
    };

    this.props.addTab(destripter);
    this.props.activeTab(activeKey);
    this.props.setCurrentCode(code);
    this.props.setCurrentShaderType(language);
  };

  remove = (targetKey: string) => {
    let { activeKey, panes } = this.props.tabs;
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
    this.props.removeTab(targetKey);
    this.props.activeTab(newActiveKey);
    if (newActiveKey) {
      panes.forEach((pane: TabDescripter) => {
        if (pane.key === newActiveKey) {
          this.props.setCurrentShaderType(pane.language);
          this.props.setCurrentCode(pane.code);
          this.props.setNeedUpdate(true);
        }
      });
    }
  };

  onSaveCode = (targetKey: string, name: string = "Untitled") => {
    this.props.tabs.panes.forEach((pane: TabDescripter) => {
      if (pane.key === targetKey) {
        const blob = new Blob([pane.code || ""], {
          type: "text/plain",
        });
        BlobDownloader.download(
          blob as any,
          (name || "Untitled") + getShaderSuffix(pane.language as ShaderType)
        );
      }
    });
  };

  onCopyPage = (targetKey: string, name: string = "Untitled") => {
    this.props.tabs.panes.forEach((pane: TabDescripter) => {
      if (pane.key === targetKey) {
        this.add("copy", name + " Copy", pane.code, pane.language);
      }
    });
  };

  onCloseOther = (targetKey: string) => {
    let arr: any[] = [];
    this.props.tabs.panes.forEach((pane: any) => {
      if (pane.key === targetKey) {
        arr.push(pane);
      }
    });
    this.props.setTabs(arr);
  };

  onCloseRight = (targetKey: string) => {
    let isFind = false;
    let arr: any[] = [];
    this.props.tabs.panes.forEach((pane: any) => {
      if (!isFind) {
        arr.push(pane);
      }
      if (pane.key === targetKey) {
        isFind = true;
      }
    });
    this.props.setTabs(arr);
  };

  runCode = () => {
    let { activeKey, panes } = this.props.tabs;
    panes.forEach((pane: TabDescripter) => {
      if (pane.key === activeKey) {
        this.props.setCurrentShaderType(pane.language);
        this.props.setCurrentCode(pane.code);
        this.props.setNeedUpdate(true);
      }
    });
  };

  render() {
    const { panes, activeKey } = this.props.tabs;
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
                this.add(files[i].name, files[i].name, reader.result as string);
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
                    <ShaderTypeSelect />
                    <IconButton
                      onClick={this.runCode}
                      icon={<CaretRightOutlined style={{ fontSize: "24px" }} />}
                    ></IconButton>
                  </>
                }
              >
                {panes.map((pane: TabDescripter) => {
                  if (pane.isCodePage) {
                    let title = (
                      <TabTitle
                        name={pane.title}
                        keyId={pane.key}
                        language={pane.language as ShaderType}
                        onRenameTab={this.onRenameTab}
                        onCloseRight={this.onCloseRight}
                        onCloseOther={this.onCloseOther}
                        onDel={this.remove}
                        onSaveCode={this.onSaveCode}
                        onCopyPage={this.onCopyPage}
                      />
                    );
                    let codePage = (
                      <CodePage
                        language={pane.language}
                        code={pane.code}
                        keyName={pane.key}
                      />
                    );
                    return (
                      <TabPane tab={title} key={pane.key} closable>
                        {codePage}
                      </TabPane>
                    );
                  } else {
                    return "Unknown Page";
                  }
                })}
              </Tabs>
            </div>
          );
        }}
      </Dropzone>
    );
  }
}
