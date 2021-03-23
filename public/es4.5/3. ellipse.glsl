#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

float sdfEllipse(vec2 uv, vec2 f1, vec2 f2, float a) {
    return length(uv - f1) + length(uv - f2) - a;
}

void main() {
    float aspect = uniforms.resolution.y / uniforms.resolution.x;
    vec2 uv = fragCoord * vec2(1.0, -aspect);
    vec2 mouse = (uniforms.mouse * 2. - uniforms.resolution) / uniforms.resolution.xx;
    float d = sdfEllipse(uv, mouse, mouse * -1., 1.0);

    if (d < 0.) {
        fragColor = vec4(1., 1., 1., 1.0);
    } else {
        fragColor = vec4(0., 0., 0., 1.0);
    }
    
    return;
}
