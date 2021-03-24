precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

void main() {
    gl_FragColor = vec4(mouse / resolution, 0.0, 1.0);
}
