import React from "react";
import { IRenderingAreaProps } from "./IRenderingArea";
import { useSelector } from "react-redux";
import {
  currentShaderType,
  ShaderType,
} from "../../features/editor/shaderSlice";
import { uniformBufferArray, verticesData } from "./common3dDatas";
import getDefaultCode from "../../features/common/defaultCode";
import { setFPS } from "../../features/editor/runtimeSlice";
import { store } from "../../app/store";

export default function RenderingAreaWebGL(props: IRenderingAreaProps) {
  const shaderType = useSelector(currentShaderType);
  console.log(shaderType);
  return (
    <canvas
      id={props.id}
      width={props.width}
      height={props.height}
      style={{
        display: shaderType === ShaderType.ES20 ? "" : "none",
      }}
    ></canvas>
  );
}

function initShaders(gl: WebGLRenderingContext, vs: string, fs: string) {
  // Compile shaders
  var vertexShader = makeShader(gl, vs, gl.VERTEX_SHADER);
  var fragmentShader = makeShader(gl, fs, gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    return false;
  }

  // Create program
  var glProgram = gl.createProgram() as WebGLProgram;

  // Attach and link shaders to the program
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program");
    return false;
  }

  // Use program
  gl.useProgram(glProgram);

  return glProgram;
}

function makeShader(gl: WebGLRenderingContext, code: string, type: number) {
  var shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, code);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
    return;
  }
  return shader;
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  // Create a buffer object
  var vertexBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);

  // Assign the vertices in buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
}

let lastTime = performance.now();
let deltaTime = 0;
let fff: Function, fIndex: number;

async function init(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  const vs = `attribute vec2 a_Position;
    void main() {
        gl_Position = vec4(a_Position, 0.0, 0.0);
    }`;

  const fs = getDefaultCode(ShaderType.ES20);

  const program = initShaders(gl, vs, fs);
  initVertexBuffers(gl, program);

  function frame() {
    uniformBufferArray[4] = performance.now() / 1000;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    deltaTime = performance.now() - lastTime;
    lastTime = performance.now();
    fIndex = requestAnimationFrame(frame);
    return fIndex;
  }

  setInterval(() => {
    store.dispatch(setFPS(1000 / deltaTime));
  }, 1000);

  return frame;
}

function renderCanvasMouseMove(event: any) {
  uniformBufferArray[0] = event.offsetX;
  uniformBufferArray[1] = event.offsetY;
}

let hasCanvas = setInterval(() => {
  let canvas = document.getElementById("webglTarget") as HTMLCanvasElement;
  if (canvas) {
    canvas.addEventListener("mousemove", renderCanvasMouseMove);
    clearInterval(hasCanvas);
    init(canvas).then((frame) => {
      fff = frame;
      frame?.();
    });
  }
}, 100);
