#version 300 es
precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

in vec2 fragCoord;
out vec4 fragColor;

#define MAX_ITER 150
#define c vec2(0.01, 1.02)
#define epsilon 10.0

void main() {
    vec2 z = fragCoord;
    int ii = 0;
    for (int i = 0; i < MAX_ITER; i++) {
        float x = (z.x * z.x - z.y * z.y) + mouse.x / resolution.x;
        float y = (z.x * z.y + z.x * z.y) + mouse.y / resolution.y;
        if ((x * x + y * y) > epsilon) {
            ii = i;
            break;
        } 
        z.x = x;
        z.y = y;
        ii = i;
    }
    float val = float(ii) / float(MAX_ITER);
    fragColor = vec4(val, val, val, 1);
}
