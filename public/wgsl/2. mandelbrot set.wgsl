[[block]] struct Uniforms {
    [[offset(0)]] mouse : vec2<f32>;
    [[offset(8)]] resolution : vec2<f32>;
    [[offset(16)]] time : f32;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;

const MAX_ITERATIONS: i32 = 100;
const epsilon: f32 = 10.;

fn mandelbrot(p: vec2<f32>) -> vec3<f32> {
	var z: vec2<f32> = vec2<f32>(0., 0.);
	var c: vec2<f32> = p.xy * 2.;
	for (var i: i32 = 0; i < MAX_ITERATIONS; i = i + 1) {
		if (length(z) > epsilon) {
			return vec3<f32>(1., 1., 1.) * (f32(i) / 50.0) + vec3<f32>(0.25, 0.25, 0.25);
		}
		z = vec2<f32>(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
	}
	return vec3<f32>(0., 0., 0.);
}

[[stage(fragment)]] fn main() -> void {
	var aspect: f32 = uniforms.resolution.x / uniforms.resolution.y;
	var mr: vec2<f32> = uniforms.mouse / uniforms.resolution;
	mr = (mr - vec2<f32>(0.5, 0.5)) * 2.;
    var c: vec3<f32> = mandelbrot((fragCoord + mr) * vec2<f32>(aspect, 1.));
	fragColor = vec4<f32>(c, 1.);
    return;
}
