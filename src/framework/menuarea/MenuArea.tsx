import React from "react";
import styles from "./MenuArea.module.css";
import { Tree } from "antd";
import { CodePageRef } from "../mainarea/MainArea";

const { DirectoryTree } = Tree;

const treeData = [
  {
    title: "Color",
    key: "0-0",
    children: [
      { title: "1. pure color", key: "0-0-0", isLeaf: true },
      { title: "2. color by uv", key: "0-0-1", isLeaf: true },
      { title: "3. color by mouse", key: "0-0-2", isLeaf: true },
    ],
  },
  {
    title: "Distance Field",
    key: "0-1",
    children: [
      { title: "1. circle", key: "0-1-0", isLeaf: true },
      { title: "2. square", key: "0-1-1", isLeaf: true },
      { title: "3. circle moving", key: "0-1-2", isLeaf: true },
    ],
  },
  {
    title: "Noise",
    key: "0-2",
    children: [
      { title: "1. smoke", key: "0-2-0", isLeaf: true },
    ],
  },
  {
    title: "Fractal",
    key: "0-3",
    children: [
      { title: "1. fantasy tunnel", key: "0-3-0", isLeaf: true },
    ],
  }
];

const onSelect = (keys: React.Key[], info: any) => {
  if (info.node.isLeaf) {
    fetch("./wgsl/" + info.node.title + ".wgsl")
      .then((data) => {
        return data.text();
      })
      .then((str) => {
        CodePageRef.page.current?.add(
          info.node.title + Date.now(),
          info.node.title + ".wgsl",
          str
        );
      });
  }
};

function MenuArea() {
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
