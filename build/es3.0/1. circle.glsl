#version 300 es
precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

in vec2 fragCoord;
out vec4 fragColor;

float sdfCircle(vec2 uv, vec2 center, float radius) {
    return length(uv - center) - radius;
}

void main() {
    float aspect = resolution.y / resolution.x;
    vec2 uv = fragCoord * vec2(1.0, -aspect);
    vec2 mouses = (mouse * vec2(2.0) - resolution) / resolution.xx;
    float d = sdfCircle(uv, mouses, 0.5);
    if (d < 0.) {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
