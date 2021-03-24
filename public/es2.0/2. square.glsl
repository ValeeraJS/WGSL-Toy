precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

float sdfSquare(vec2 uv, vec2 center, float radius) {
    return max(abs(uv.x - center.x), abs(uv.y - center.y)) - radius;
}

void main() {
    float aspect = resolution.y / resolution.x;
    vec2 uv = fragCoord * vec2(1.0, -aspect);
    vec2 mouseIn = (mouse * 2.0 - resolution) / resolution.xx;
    float d = sdfSquare(uv, mouseIn, 0.5);

    if (d < 0.0) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
