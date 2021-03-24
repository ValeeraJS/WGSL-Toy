#version 300 es
precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

in vec2 fragCoord;
out vec4 fragColor;

float sdfSquare(vec2 uv, vec2 center, float radius) {
    return max(abs(uv.x - center.x), abs(uv.y - center.y)) - radius;
}

void main() {
    float aspect = resolution.y / resolution.x;
    vec2 uv = fragCoord * vec2(1.0, -aspect);
    vec2 mouseIn = (mouse * 2.0 - resolution) / resolution.xx;
    float d = sdfSquare(uv, mouseIn, 0.5);

    if (d < 0.0) {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
