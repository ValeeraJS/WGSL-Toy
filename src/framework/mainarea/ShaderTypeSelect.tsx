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
          <Menu.Item key={ShaderType.WGSL}>WebGPU: WGSL</Menu.Item>
          <Menu.Item key={ShaderType.ES45}>WebGPU: GLSL ES4.5</Menu.Item>
        </>
      )}
      {webgl2S && (
        <Menu.Item key={ShaderType.ES30}>WebGL2: GLSL ES3.0</Menu.Item>
      )}
      {webglS && <Menu.Item key={ShaderType.ES20}>WebGL: GLSL ES2.0</Menu.Item>}
      {(!webgpuS || !webgl2S || !webglS) && (
        <>
          <Menu.Divider />
          {!webgpuS && (
            <>
              <Menu.Item disabled key={ShaderType.WGSL}>
                WebGPU: WGSL
              </Menu.Item>
              <Menu.Item disabled key={ShaderType.ES45}>
                WebGPU: GLSL ES4.5
              </Menu.Item>
            </>
          )}
          {!webgl2S && (
            <Menu.Item disabled key={ShaderType.ES30}>
              WebGL2: GLSL ES3.0
            </Menu.Item>
          )}
          {!webglS && (
            <Menu.Item disabled key={ShaderType.ES20}>
              WebGL: GLSL ES2.0
            </Menu.Item>
          )}
        </>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <span
        style={{
          color: "#cccccc",
          cursor: "pointer",
          lineHeight: "40px",
          display: "flex",
        }}
      >
        Language: {shaderType}
      </span>
    </Dropdown>
  );
}
