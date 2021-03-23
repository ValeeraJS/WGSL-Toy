import { ShaderType } from "../editor/shaderSlice";

export default function getDefaultCode(shaderType: ShaderType): string {
    if (shaderType === ShaderType.WGSL) {
        return `[[location(0)]] var<out> fragColor : vec4<f32>;

[[stage(fragment)]] fn main() -> void {
    fragColor = vec4<f32>(1.0, 0.0, 0.0, 1.0);
    return;
}
`;
    } else if (shaderType === ShaderType.ES45) {
        return `#version 450
layout(location = 0) out vec4 outColor;
        
void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
    }
    return ``;
}