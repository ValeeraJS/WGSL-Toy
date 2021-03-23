#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

vec3 getR(vec3 p, vec3 a, vec3 r) {
    return mix(a * dot(p, a), p, sin(r)) + sin(r) * cross(p, a);
}

void main() {
    fragColor = vec4(0.);
    vec3 p;
    vec2 r = uniforms.resolution;
    vec2 dotV = vec2(0.5) * r; 
    vec3 d = normalize(vec3((fragCoord * r - dotV) / vec2(r.y), 1.0));

    float g = 0.;
    float e;
    float s;
    for (int i = 0; i < 99; i++) {
        p = g * d;
        p.z = p.z + uniforms.time * 0.3;
        p = getR(p, normalize(vec3(1.0, 2.0, 3.0)), vec3(0.5));   
        s = 2.5;
        p = abs(mod((p - 1.0), vec3(2.0)) - 1.0) - 1.0;

        for(int j = 0; j < 10; j++){
            p = 1.0 - abs(p - 1.0);
            e = -1.8 / dot(p, p);
            s = s * e;
            p = p * vec3(e) - vec3(0.7);
        }

        e = abs(p.z) / s + 0.001;
        g = g + e;   
        float l09 = log(s * 9.0);
        float dpe = dot(p, p) * e;
        vec3 oo = fragColor.xyz + vec3(0.00005) * abs(cos(vec3(3.0, 2.0, 1.0) + l09)) / dpe;
        fragColor = vec4(oo, fragColor.w);
    }
}
