import React from "react";
import styles from "./MenuArea.module.css";
import { Dropdown, Menu, Tree } from "antd";
import {
  globalShaderType,
  setCurrentCode,
  setCurrentShaderType,
  setNeedUpdate,
  ShaderType,
  SUPPORT_STATE,
} from "../../features/editor/shaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { activeTab, addTab } from "../../features/editor/tabSlice";
import { treeData } from "./Data";

const { DirectoryTree } = Tree;

function getFilePath(name: string, type: ShaderType): string {
  if (type === ShaderType.WGSL) {
    return "./wgsl/" + name + ".wgsl";
  } else if (type === ShaderType.ES45) {
    return "./es4.5/" + name + ".glsl";
  } else if (type === ShaderType.ES30) {
    return "./es3.0/" + name + ".glsl";
  } else if (type === ShaderType.ES20) {
    return "./es2.0/" + name + ".glsl";
  }
  return name;
}

function MenuArea() {
  const dispatch = useDispatch();
  const shaderTypeO = useSelector(globalShaderType);
  const onSelect = (
    keys: React.Key[],
    { node }: any,
    shaderType = shaderTypeO
  ) => {
    if (node.isLeaf) {
      fetch(getFilePath(node.title, shaderType))
        .then((data) => {
          return data.text();
        })
        .then((str) => {
          let key = node.title + Date.now();
          dispatch(
            addTab({
              title: node.title,
              content: "CodePage",
              key,
              code: str,
              isCodePage: true,
              language: shaderType,
            })
          );
          dispatch(activeTab(key));
          dispatch(setCurrentShaderType(shaderType));
          dispatch(setCurrentCode(str));
          dispatch(setNeedUpdate(true));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <div className={styles.menuarea}>
      <div
        style={{
          padding: "4px 8px",
          fontSize: 14,
          color: "white",
        }}
      >
        Tutorials
      </div>
      <DirectoryTree
        multiple
        defaultExpandAll
        treeData={treeData}
        onSelect={onSelect}
        titleRender={(node) => {
          if (!node.isLeaf) {
            return node.title;
          }
          return (
            <Dropdown
              overlay={
                <Menu>
                  {SUPPORT_STATE.WebGPU && (
                    <Menu.Item
                      key="1"
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        onSelect([], { node }, ShaderType.WGSL);
                      }}
                    >
                      Open in WGSL editor
                    </Menu.Item>
                  )}
                  {SUPPORT_STATE.WebGPU && (
                    <Menu.Item
                      key="2"
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        onSelect([], { node }, ShaderType.ES45);
                      }}
                    >
                      Open in GLSL ES4.5 editor
                    </Menu.Item>
                  )}
                  {SUPPORT_STATE.WebGL2 && (
                    <Menu.Item
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        onSelect([], { node }, ShaderType.ES30);
                      }}
                      key="3"
                    >
                      Open in GLSL ES3.0 editor
                    </Menu.Item>
                  )}
                  {SUPPORT_STATE.WebGL && (
                    <Menu.Item
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        onSelect([], { node }, ShaderType.ES20);
                      }}
                      key="4"
                    >
                      Open in GLSL ES2.0 editor
                    </Menu.Item>
                  )}
                  {(!SUPPORT_STATE.WebGL2 || !SUPPORT_STATE.WebGPU) && (
                    <>
                      <Menu.Divider />
                      {!SUPPORT_STATE.WebGPU && (
                        <Menu.Item
                          disabled
                          key="1"
                          onClick={(e) => {
                            e.domEvent.stopPropagation();
                            onSelect([], { node }, ShaderType.WGSL);
                          }}
                        >
                          Open in WGSL editor
                        </Menu.Item>
                      )}
                      {!SUPPORT_STATE.WebGPU && (
                        <Menu.Item
                          disabled
                          key="2"
                          onClick={(e) => {
                            e.domEvent.stopPropagation();
                            onSelect([], { node }, ShaderType.ES45);
                          }}
                        >
                          Open in GLSL ES4.5 editor
                        </Menu.Item>
                      )}
                      {!SUPPORT_STATE.WebGL2 && (
                        <Menu.Item
                          disabled
                          onClick={(e) => {
                            e.domEvent.stopPropagation();
                            onSelect([], { node }, ShaderType.ES30);
                          }}
                          key="3"
                        >
                          Open in GLSL ES3.0 editor
                        </Menu.Item>
                      )}
                    </>
                  )}
                </Menu>
              }
              trigger={["contextMenu"]}
            >
              <span>{node.title}</span>
            </Dropdown>
          );
        }}
      />
    </div>
  );
}

export default MenuArea;
