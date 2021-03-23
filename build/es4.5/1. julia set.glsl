#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

#define MAX_ITER 150
#define c vec2(0.01, 1.02)
#define epsilon 10.

void main() {
    vec2 z = fragCoord;
    int i = 0;
    for (i = 0; i < MAX_ITER; i++) {
        float x = (z.x * z.x - z.y * z.y) + uniforms.mouse.x / uniforms.resolution.x;
        float y = (z.x * z.y + z.x * z.y) + uniforms.mouse.y / uniforms.resolution.y;
        if ((x * x + y * y) > epsilon) {
            break;
        } 
        z.x = x;
        z.y = y;
    }
    float val = float(i) / float(MAX_ITER);
    fragColor = vec4(1. - val, 1. - val, 1. - val, 1.);
}
