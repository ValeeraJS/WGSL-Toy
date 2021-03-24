#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

#define SCALE 4

float chessboard(vec2 uv) {
    vec2 uv2 = floor(uv); 
    return mod(uv2.x + uv2.y, 2);
}

void main() {
    float aspect = uniforms.resolution.x / uniforms.resolution.y;
    vec2 uv = fragCoord * SCALE * vec2(aspect, 1);
    float c = chessboard(uv);
    fragColor = vec4(c, c, c, 1);

    return;
}
