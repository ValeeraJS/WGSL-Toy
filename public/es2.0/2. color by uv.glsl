precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

void main() {
    gl_FragColor = vec4((fragCoord + 1.) * 0.5, 0., 1.);
}
