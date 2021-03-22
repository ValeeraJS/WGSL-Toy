import React from "react";
import { IRenderingAreaProps } from "./IRenderingArea";
import { useSelector } from "react-redux";
import { currentShaderType, ShaderType } from "../../features/editor/shaderSlice";

import F32Buffer from "../../engine/buffer.js";
import Renderer from "../../engine/renderer";
import { GeometryNode, Geometry } from "../../engine/geometry.js";
import Material from "../../engine/material.js";
import Mesh from "../../engine/mesh.js";
import { setMsgOut } from "../ConsoleBar/ConsoleBar";
import { fpsText } from "../rightside/RightSide";
import glslangModule from '../../engine/glsllang';

export default function RenderingAreaWebGpu(props: IRenderingAreaProps) {
    const shaderType = useSelector(currentShaderType);
    return <canvas id={props.id} width={props.width} height={props.height} style={{
        display: (shaderType === ShaderType.WGSL || shaderType === ShaderType.ES45) ? 'auto' : 'none',
    }}></canvas>;
}


let f32BufferArray = new Float32Array([0, 0, 0, 0, 0]);

export { f32BufferArray };

let material: Material;
let mesh: Mesh;
let lastTime = performance.now();
let deltaTime = 0;

export async function init(canvas: any) {
    const adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) {
        setMsgOut(<div style={{color: 'yellow'}}>Your browser doesn't support WebGPU, please use newest Chrome Canary.</div>);
        return () => {};
    }
    const device = await adapter.requestDevice();
    if (!device) {
        setMsgOut(<div style={{color: 'yellow'}}>Your browser doesn't support WebGPU, please use newest Chrome Canary.</div>);
        return () => {};
    }
    const renderer = new Renderer(device, canvas);

    // 顶点位置数据
    const verticesData = new Float32Array([
        -1, 1,
        -1, -1,
        1, -1,
        -1, 1,
        1, -1,
        1, 1,
    ]);
    const verticesBuffer = new F32Buffer(device, verticesData, GPUBufferUsage.VERTEX);
    const vnode = new GeometryNode(verticesBuffer, 'vertices', {
        stride: 2,
        offset: 0,
        format: 'float32x2'
    })

    material = new Material(device, wgslShaders.vertex, wgslShaders.fragment);
    const geo = new Geometry("triangle-list", 6, [vnode]);
    mesh = new Mesh(device, geo, material);

    function frame() {
        renderer.clear();
        f32BufferArray[4] = performance.now() / 1000;
        renderer.render(mesh, f32BufferArray);
        renderer.end();
        deltaTime = performance.now() - lastTime;
        lastTime = performance.now();
        fIndex = requestAnimationFrame(frame);
        return fIndex;
    }

    setInterval(() => {
        if (fpsText.ref.current) {
            fpsText.ref.current.innerText = (1000 / deltaTime).toFixed(2) + "fps";
        }
    }, 1000)

    return frame;
}

export const wgslShaders = {
    vertex: `[[builtin(position)]] var<out> out_position : vec4<f32>;
[[location(0)]] var<in> a_position : vec2<f32>;
[[location(0)]] var<out> fragCoord : vec2<f32>;
[[stage(vertex)]]
fn main() -> void {
	out_position = vec4<f32>(a_position, 0.0, 1.0);
    fragCoord = a_position;
	return;
}
`,
    fragment: `[[location(0)]] var<out> fragColor : vec4<f32>;

[[stage(fragment)]] fn main() -> void {
    fragColor = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return;
}    
`
};

export const glsl45Shaders = {
    fragment: ``
};

let fff: any, fIndex: any;

export function renderCanvasMouseMove(event: any) {
    f32BufferArray[0] = event.offsetX;
    f32BufferArray[1] = event.offsetY;
}

export function updateMaterialShader(code: string = '', isGlsl = false) {
    material.changeFS(code, isGlsl);
    mesh.updatePipeline();
    cancelAnimationFrame(fIndex);
    fIndex = fff();
}

let hasCanvas = setInterval(() => {
    let canvas = document.getElementById("webgpuTarget");
    if (canvas) {
        canvas.addEventListener('mousemove', renderCanvasMouseMove);
        clearInterval(hasCanvas);
        init(canvas).then(frame => {
            fff = frame;
            frame?.();
        });
    }
}, 100);