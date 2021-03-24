import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  webgpuSupported,
  webgl2Supported,
  webglSupported,
  globalShaderType,
  ShaderType,
  setGlobalShaderType,
} from "../../features/editor/shaderSlice";

export const LanguageUtils = {
  getShaderSuffix(str: string) {
    if (str === "wgsl") {
      return ".wgsl";
    } else {
      return ".glsl";
    }
  },
};

const MENU_STYLE = {
  display: "flex",
  justifyContent: "space-between",
};

export default function ShaderTypeSelect() {
  const shaderType = useSelector(globalShaderType);
  const webgpuS = useSelector(webgpuSupported);
  const webgl2S = useSelector(webgl2Supported);
  const webglS = useSelector(webglSupported);
  const dispatch = useDispatch();

  const menu = (
    <Menu
      onClick={(e: any) => {
        dispatch(setGlobalShaderType(e.key as ShaderType));
      }}
    >
      {webgpuS && (
        <>
          <Menu.Item style={MENU_STYLE} key={ShaderType.WGSL}>
            <span>WebGPU:</span>
            <span style={{ paddingLeft: 8 }}>WGSL</span>
          </Menu.Item>
          <Menu.Item style={MENU_STYLE} key={ShaderType.ES45}>
            <span>WebGPU:</span>
            <span style={{ paddingLeft: 8 }}>GLSL ES4.5</span>
          </Menu.Item>
        </>
      )}
      {webgl2S && (
        <Menu.Item style={MENU_STYLE} key={ShaderType.ES30}>
          <span>WebGL2:</span>
          <span style={{ paddingLeft: 8 }}>GLSL ES3.0</span>
        </Menu.Item>
      )}
      {webglS && (
        <Menu.Item style={MENU_STYLE} key={ShaderType.ES20}>
          <span>WebGL:</span>
          <span style={{ paddingLeft: 8 }}>GLSL ES2.0</span>
        </Menu.Item>
      )}
      {(!webgpuS || !webgl2S || !webglS) && (
        <>
          <Menu.Divider />
          {!webgpuS && (
            <>
              <Menu.Item style={MENU_STYLE} disabled key={ShaderType.WGSL}>
                <span>WebGPU:</span>
                <span style={{ paddingLeft: 8 }}>WGSL</span>
              </Menu.Item>
              <Menu.Item style={MENU_STYLE} disabled key={ShaderType.ES45}>
                <span>WebGPU:</span>
                <span style={{ paddingLeft: 8 }}>GLSL ES4.5</span>
              </Menu.Item>
            </>
          )}
          {!webgl2S && (
            <Menu.Item style={MENU_STYLE} disabled key={ShaderType.ES30}>
              <span>WebGL2:</span>
              <span style={{ paddingLeft: 8 }}>GLSL ES3.0</span>
            </Menu.Item>
          )}
          {!webglS && (
            <Menu.Item style={MENU_STYLE} disabled key={ShaderType.ES20}>
              <span>WebGL:</span>
              <span style={{ paddingLeft: 8 }}>GLSL ES2.0</span>
            </Menu.Item>
          )}
        </>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <span
        style={{
          color: "#cccccc",
          cursor: "pointer",
          lineHeight: "40px",
          display: "flex",
        }}
      >
        {shaderType}
      </span>
    </Dropdown>
  );
}
