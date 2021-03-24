precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

#define PI 3.1415927
#define EDGE_COUNT 5

float sdStar(vec2 p, float radius, int n, float m, float rotation) {

    float an = PI / float(n);
    float en = PI / m;
    vec2 acs = vec2(cos(an), sin(an));
    vec2 ecs = vec2(cos(en), sin(en)); // ecs=vec2(0,1) and simplify, for regular polygon,

    // reduce to first sector
    float bn = mod(atan(p.x, p.y) + rotation, 2.0 * an) - an;
    p = length(p) * vec2(cos(bn), abs(sin(bn)));

    // line sdf
    p = p - radius * acs;
    p = p + ecs * clamp(-dot(p, ecs), 0.0, radius * acs.y / ecs.y);
    return length(p) * sign(p.x);
}

void main() {
    float aspect = resolution.y / resolution.x;
    vec2 p = fragCoord * vec2(1, aspect);

    float m = 2.0;
    float d = sdStar(p, 0.5, EDGE_COUNT, mouse.y / resolution.y * 4.0 + 1.0, mouse.x / resolution.x * 2.0);

    if (d < 0.) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
