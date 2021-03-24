#version 300 es
precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

in vec2 fragCoord;
out vec4 fragColor;

float sdfEllipse(vec2 uv, vec2 f1, vec2 f2, float a) {
    return length(uv - f1) + length(uv - f2) - a;
}

void main() {
    float aspect = resolution.y / resolution.x;
    vec2 uv = fragCoord * vec2(1.0, -aspect);
    vec2 mr = (mouse * 2.0 - resolution) / resolution.xx;
    float d = sdfEllipse(uv, mr, mr * -1.0, 1.0);

    if (d < 0.0) {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
