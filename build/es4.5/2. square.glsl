#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

float sdfSquare(vec2 uv, vec2 center, float radius) {
    return max(abs(uv.x - center.x), abs(uv.y - center.y)) - radius;
}

void main() {
    float aspect = uniforms.resolution.y / uniforms.resolution.x;
    vec2 uv = fragCoord * vec2(1.0, -aspect);
    vec2 mouse = (uniforms.mouse * 2. - uniforms.resolution) / uniforms.resolution.xx;
    float d = sdfSquare(uv, mouse, 0.5);

    if (d < 0.) {
        fragColor = vec4(1., 1., 1., 1.0);
    } else {
        fragColor = vec4(0., 0., 0., 1.0);
    }
    
    return;
}
