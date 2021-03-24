import { IRenderingAreaProps } from "./IRenderingArea";
import { useDispatch, useSelector } from "react-redux";
import {
  codeNeedUpdate,
  currentCode,
  currentShaderType,
  setNeedUpdate,
  ShaderType,
} from "../../features/editor/shaderSlice";
import { uniformBufferArray, verticesData } from "./common3dDatas";
import getDefaultCode from "../../features/common/defaultCode";
import { setFPS } from "../../features/editor/runtimeSlice";
import { store } from "../../app/store";
import { MSG_TYPE, setMessage } from "../../features/editor/logSlice";

export default function RenderingAreaWebGL(props: IRenderingAreaProps) {
  const shaderType = useSelector(currentShaderType);
  const codes = useSelector(currentCode);
  const needUpdate = useSelector(codeNeedUpdate);
  const dispatch = useDispatch();
  if (codes && shaderType === ShaderType.ES20 && needUpdate) {
    updateMaterialShader(codes);
    dispatch(setNeedUpdate(false));
  }
  if (gl) {
    gl.viewport(0, 0, props.width || 0, props.height || 0);
  }
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
  let startTime = Date.now();
  // Compile shaders
  var vertexShader = makeShader(gl, vs, gl.VERTEX_SHADER);
  var fragmentShader = makeShader(gl, fs, gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    return false;
  }

  // Create program
  glProgram = gl.createProgram() as WebGLProgram;

  // Attach and link shaders to the program
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    store.dispatch(
      setMessage({
        type: MSG_TYPE.ERROR,
        text:
          "Unable to initialize the shader program: " +
          gl.getProgramParameter(glProgram, gl.LINK_STATUS),
        date: Date.now(),
      })
    );
    return false;
  }
  let time = Date.now() - startTime;
  store.dispatch(
    setMessage([
      {
        type: MSG_TYPE.SUCCESS,
        text: "Shader compiled successfully.",
        date: Date.now(),
      },
      {
        type: MSG_TYPE.SUCCESS,
        text: `Compiled in ${time} ms.`,
        date: Date.now(),
      },
    ])
  );

  // Use program
  gl.useProgram(glProgram);

  return glProgram;
}

function makeShader(gl: WebGLRenderingContext, code: string, type: number) {
  var shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, code);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    store.dispatch(
      setMessage({
        type: MSG_TYPE.ERROR,
        text: "Error compiling shader: " + gl.getShaderInfoLog(shader),
        date: Date.now(),
      })
    );
    return;
  }
  return shader;
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  // Create a buffer object
  var vertexBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);

  // Assign the vertices in buffer object to position variable
  var position = gl.getAttribLocation(program, "position");
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position);
}

let lastTime = performance.now();
let deltaTime = 0;
let fff: Function, fIndex: number;

function updateMaterialShader(code: string = "") {
  initShaders(gl, vs, code);
}

const vs = `attribute vec4 position;
varying vec2 fragCoord;

void main() {
  fragCoord = position.xy;
  gl_Position = position;
}`;

let gl: WebGLRenderingContext;
let glProgram: WebGLProgram;

async function init(canvas: HTMLCanvasElement) {
  gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const fs = getDefaultCode(ShaderType.ES20);

  glProgram = initShaders(gl, vs, fs);
  initVertexBuffers(gl, glProgram);

  function frame() {
    if (store.getState().shader.currentShaderType === ShaderType.ES20) {
      uniformBufferArray[4] = performance.now() / 1000;
      const mouseUniform = gl.getUniformLocation(glProgram, "mouse");
      gl.uniform2fv(mouseUniform, [
        uniformBufferArray[0],
        uniformBufferArray[1],
      ]);
      const resolutionUniform = gl.getUniformLocation(glProgram, "resolution");
      gl.uniform2fv(resolutionUniform, [
        uniformBufferArray[2],
        uniformBufferArray[3],
      ]);
      const timeUniform = gl.getUniformLocation(glProgram, "time");
      gl.uniform1f(timeUniform, uniformBufferArray[4]);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      deltaTime = performance.now() - lastTime;
      lastTime = performance.now();
    }
    fIndex = requestAnimationFrame(frame);
    return fIndex;
  }

  setInterval(() => {
    if (store.getState().shader.currentShaderType === ShaderType.ES20) {
      store.dispatch(setFPS(1000 / deltaTime));
    }
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
