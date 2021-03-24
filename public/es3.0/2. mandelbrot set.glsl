#version 300 es
precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

in vec2 fragCoord;
out vec4 fragColor;

#define MAX_ITERATIONS 100
#define epsilon 10.0

vec3 mandelbrot(vec2 p) {
	vec2 z = vec2(0.0, 0.0);
	vec2 c = p.xy * 2.0;
	for (int i = 0; i < MAX_ITERATIONS; i++) {
		if (length(z) > epsilon) {
			return (float(i) / 50.0) + vec3(0.25);
		}
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
	}
	return vec3(0.0, 0.0, 0.0);
}

void main() {
	float aspect = resolution.x / resolution.y;
	vec2 mr = mouse / resolution;
	mr = (mr - vec2(0.25, 0.5)) * vec2(-2.0, 2.0);
    vec3 c = mandelbrot((fragCoord + mr) * vec2(aspect, 1.0));
	fragColor = vec4(c, 1.0);
}
