#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

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
    float aspect = uniforms.resolution.y / uniforms.resolution.x;
    vec2 p = fragCoord * vec2(1.0, aspect);

    float m = 2.0;
    float d = sdStar(p, 0.5, EDGE_COUNT, uniforms.mouse.y / uniforms.resolution.y * 4.0 + 1.0, uniforms.mouse.x / uniforms.resolution.x * 2.);

    if (d < 0.) {
        fragColor = vec4(1., 1., 1., 1.0);
    } else {
        fragColor = vec4(0., 0., 0., 1.0);
    }
    
    return;
}
