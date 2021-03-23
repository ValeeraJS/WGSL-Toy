#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;
    
#define MAX_ITER 20
#define TAU 7.28318530718

void main() {
    vec2 uv = (fragCoord + 1) / 2;
    float time = uniforms.time;
    vec2 p = mod(uv * TAU, TAU) - 250;
    vec2 i = vec2(p);
    float c = 0.5;
    float inten = 0.005;
    for (int n = 0; n < MAX_ITER; n++) {
        float t = 0.16 * (time + 23) * (1 - (3.5 / (float(n) + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y) + cos(t + i.x));
        c = c + 1 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }

    c = c / float(MAX_ITER);
    c = 1.0 - pow(c, 2.0);

    vec3 color = vec3(pow(abs(c), 12));
    color = clamp(color, 0, 1);

    vec3 tint = vec3(uv.x, uv.y, (1 - uv.x) * (1 - uv.y));
    fragColor = vec4(color * tint, 1);
}
