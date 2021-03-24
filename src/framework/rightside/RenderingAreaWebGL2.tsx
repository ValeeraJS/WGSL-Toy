import { IRenderingAreaProps } from "./IRenderingArea";
import { useSelector } from "react-redux";
import { currentShaderType, ShaderType } from "../../features/editor/shaderSlice";

export default function RenderingAreaWebGL(props: IRenderingAreaProps) {
    const shaderType = useSelector(currentShaderType);
    return <canvas id={props.id} width={props.width} height={props.height} style={{
        display: shaderType === ShaderType.ES30 ? 'auto' : 'none',
    }}></canvas>;
}
