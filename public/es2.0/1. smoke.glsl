precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;
    
#define MAX_ITER 20
#define TAU 7.28318530718

void main() {
    vec2 uv = (fragCoord + 1.0) / 2.0;
    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 0.5;
    float inten = 0.005;
    for (int n = 0; n < MAX_ITER; n++) {
        float t = 0.16 * (time + 23.0) * (1.0 - (3.5 / (float(n) + 1.0)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y) + cos(t + i.x));
        c = c + 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }

    c = c / float(MAX_ITER);
    c = 1.0 - pow(c, 2.0);

    vec3 color = vec3(pow(abs(c), 12.0));
    color = clamp(color, 0.0, 1.0);

    vec3 tint = vec3(uv.x, uv.y, (1.0 - uv.x) * (1.0 - uv.y));
    gl_FragColor = vec4(color * tint, 1.0);
}
