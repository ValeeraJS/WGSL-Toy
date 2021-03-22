import React from "react";
import styles from "./MenuArea.module.css";
import { Tree } from "antd";
import { globalShaderType, setCurrentCode, setCurrentShaderType, setNeedUpdate } from "../../features/editor/shaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { activeTab, addTab } from "../../features/editor/tabSlice";

const { DirectoryTree } = Tree;

const treeData = [
  {
    title: "Color",
    key: "0-0",
    children: [
      { title: "1. pure color", key: "0-0-0", isLeaf: true },
      { title: "2. color by uv", key: "0-0-1", isLeaf: true },
      { title: "3. color by mouse", key: "0-0-2", isLeaf: true },
      { title: "4. chess board", key: "0-0-3", isLeaf: true },
    ],
  },
  {
    title: "Distance Field",
    key: "0-1",
    children: [
      { title: "1. circle", key: "0-1-0", isLeaf: true },
      { title: "2. square", key: "0-1-1", isLeaf: true },
      { title: "3. ellipse", key: "0-1-2", isLeaf: true },
      { title: "4. polygon", key: "0-1-3", isLeaf: true },
      { title: "5. star", key: "0-1-4", isLeaf: true },
    ],
  },
  {
    title: "Noise",
    key: "0-2",
    children: [
      { title: "1. smoke", key: "0-2-0", isLeaf: true },
      { title: "2. cloud", key: "0-2-1", isLeaf: true },
    ],
  },
  {
    title: "Fractal",
    key: "0-3",
    children: [
      { title: "1. julia set", key: "0-3-0", isLeaf: true },
      { title: "2. mandelbrot set", key: "0-3-1", isLeaf: true },
      { title: "3. fantasy tunnel", key: "0-3-2", isLeaf: true },
    ],
  },
];

function MenuArea() {
  const dispatch = useDispatch();
  const shaderType = useSelector(globalShaderType);

  const onSelect = (keys: React.Key[], info: any) => {
    if (info.node.isLeaf) {
      fetch("./wgsl/" + info.node.title + ".wgsl")
        .then((data) => {
          return data.text();
        })
        .then((str) => {
          let key = info.node.title + Date.now();
          dispatch(addTab({
            title: info.node.title,
            content: "CodePage",
            key,
            code: str,
            isCodePage: true,
            language: shaderType
          }));
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
      />
    </div>
  );
}

export default MenuArea;
