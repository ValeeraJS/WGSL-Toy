#version 450
layout(set = 0, binding = 0) uniform Uniforms {
    vec2 mouse;
    vec2 resolution;
    float time;
} uniforms;

layout(location = 0) in vec2 fragCoord;
layout(location = 0) out vec4 fragColor;

#define MAX_ITERATIONS 100
#define epsilon 10

vec3 mandelbrot(vec2 p) {
	vec2 z = vec2(0, 0);
	vec2 c = p.xy * 2;
	for (int i = 0; i < MAX_ITERATIONS; i++) {
		if (length(z) > epsilon) {
			return (float(i) / 50) + vec3(0.25);
		}
		z = vec2(z.x * z.x - z.y * z.y, 2 * z.x * z.y) + c;
	}
	return vec3(0, 0, 0);
}

void main() {
	float aspect = uniforms.resolution.x / uniforms.resolution.y;
	vec2 mr = uniforms.mouse / uniforms.resolution;
	mr = (mr - vec2(0.25, 0.5)) * vec2(-2, 2);
    vec3 c = mandelbrot((fragCoord + mr) * vec2(aspect, 1));
	fragColor = vec4(c, 1);
    return;
}
