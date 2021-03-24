#version 300 es
precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

in vec2 fragCoord;
out vec4 fragColor;

void main() {
    fragColor = vec4((fragCoord + 1.0) * 0.5, 0.0, 1.0);
}
