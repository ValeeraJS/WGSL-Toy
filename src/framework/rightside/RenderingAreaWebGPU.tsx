import React from "react";
import { IRenderingAreaProps } from "./IRenderingArea";
import { useDispatch, useSelector } from "react-redux";
import { codeNeedUpdate, currentCode, currentShaderType, setNeedUpdate, ShaderType } from "../../features/editor/shaderSlice";

import F32Buffer from "../../engine/buffer.js";
import Renderer from "../../engine/renderer";
import { GeometryNode, Geometry } from "../../engine/geometry.js";
import Material from "../../engine/material.js";
import Mesh from "../../engine/mesh.js";
import glslangModule from '../../engine/glsllang';
import getDefaultCode from "../../features/common/defaultCode";
import { store } from "../../app/store";
import { setFPS } from "../../features/editor/runtimeSlice";
import { uniformBufferArray, verticesData } from "./common3dDatas";

export default function RenderingAreaWebGpu(props: IRenderingAreaProps) {
    const shaderType = useSelector(currentShaderType);
    const codes = useSelector(currentCode);
    const needUpdate = useSelector(codeNeedUpdate);
    const dispatch = useDispatch();
    if (codes && (shaderType === ShaderType.WGSL || shaderType === ShaderType.ES45) && needUpdate) {
        updateMaterialShader(codes, shaderType === ShaderType.ES45);
        dispatch(setNeedUpdate(false));
    }
    return <canvas id={props.id} width={props.width} height={props.height} style={{
        display: (shaderType === ShaderType.WGSL || shaderType === ShaderType.ES45) ? 'auto' : 'none',
    }}></canvas>;
}

let material: Material;
let mesh: Mesh;
let lastTime = performance.now();
let deltaTime = 0;

export async function init(canvas: any) {
    const glslang = await glslangModule();
    const adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) {
        return () => {};
    }
    const device = await adapter.requestDevice();
    if (!device) {
        return () => {};
    }
    const renderer = new Renderer(device, canvas);
    const verticesBuffer = new F32Buffer(device, verticesData, GPUBufferUsage.VERTEX);
    const vnode = new GeometryNode(verticesBuffer, 'vertices', {
        stride: 2,
        offset: 0,
        format: 'float32x2'
    })

    material = new Material(device, wgslShaders.vertex, getDefaultCode(ShaderType.WGSL), glslang);
    const geo = new Geometry("triangle-list", 6, [vnode]);
    mesh = new Mesh(device, geo, material);

    function frame() {
        renderer.clear();
        uniformBufferArray[4] = performance.now() / 1000;
        renderer.render(mesh, uniformBufferArray);
        renderer.end();
        deltaTime = performance.now() - lastTime;
        lastTime = performance.now();
        fIndex = requestAnimationFrame(frame);
        return fIndex;
    }

    setInterval(() => {
        store.dispatch(setFPS(1000 / deltaTime))
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
`};

export const glsl45Shaders = {
    fragment: ``
};

let fff: any, fIndex: any;

function renderCanvasMouseMove(event: any) {
    uniformBufferArray[0] = event.offsetX;
    uniformBufferArray[1] = event.offsetY;
}

function updateMaterialShader(code: string = '', isGlsl = false) {
    if (material) {
        material.changeFS(code, isGlsl);
        mesh.updatePipeline();
        cancelAnimationFrame(fIndex);
        fIndex = fff();
    }
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
