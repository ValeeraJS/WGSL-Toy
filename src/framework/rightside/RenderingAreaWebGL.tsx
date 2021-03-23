import React from "react";
import { IRenderingAreaProps } from "./IRenderingArea";
import { useSelector } from "react-redux";
import { currentShaderType, ShaderType } from "../../features/editor/shaderSlice";
import { uniformBufferArray } from "./common3dDatas";

export default function RenderingAreaWebGL(props: IRenderingAreaProps) {
    const shaderType = useSelector(currentShaderType);
    return <canvas id={props.id} width={props.width} height={props.height} style={{
        display: shaderType === ShaderType.ES20 ? 'auto' : 'none',
    }}></canvas>;
}

let fff: Function, fIndex: number;
async function init(canvas: HTMLCanvasElement) {
    return () => {
        return 1;
    };
}

function renderCanvasMouseMove(event: any) {
    uniformBufferArray[0] = event.offsetX;
    uniformBufferArray[1] = event.offsetY;
}

let hasCanvas = setInterval(() => {
    let canvas = document.getElementById("webglTarget") as HTMLCanvasElement;
    if (canvas) {
        canvas.addEventListener('mousemove', renderCanvasMouseMove);
        clearInterval(hasCanvas);
        init(canvas).then(frame => {
            fff = frame;
            frame?.();
        });
    }
}, 100);
