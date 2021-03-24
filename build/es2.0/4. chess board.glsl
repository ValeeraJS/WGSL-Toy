precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

#define SCALE 4.0

float chessboard(vec2 uv) {
    vec2 uv2 = floor(uv); 
    return mod(uv2.x + uv2.y, 2.0);
}

void main() {
    float aspect = resolution.x / resolution.y;
    vec2 uv = fragCoord * SCALE * vec2(aspect, 1);
    float c = chessboard(uv);
    gl_FragColor = vec4(c, c, c, 1.0);
}
