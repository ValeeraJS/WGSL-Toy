#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;


void main() {
    fragColor = vec4(uniforms.mouse / uniforms.resolution, 0., 1.0);
    return;
}
