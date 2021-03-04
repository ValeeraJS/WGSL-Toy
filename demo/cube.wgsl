[[block]] struct Uniforms {
    [[offset(0)]] mouse : vec2<f32>;
	[[offset(8)]] resolution : vec2<f32>;
	[[offset(16)]] time : f32;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;

const ITER: i32 = 200;

fn rot(a: f32) -> mat2x2<f32> {
    return mat2x2<f32>(vec2<f32>(cos(a),-sin(a)),vec2<f32>(sin(a),cos(a)));
}

fn hit(pp: vec3<f32>) -> f32 {
    var p: vec3<f32> = vec3<f32>(pp);
    var tmp: vec2<f32>;

    tmp = p.yz * rot(0.5);
	p.y = tmp.x;
    p.z = tmp.y;
	tmp = p.zx * rot(uniforms.mouse.x / 50.);
	p.z = tmp.x;
    p.x = tmp.y;

	return length(max(abs(p) - vec3<f32>(.6, .6, .6), vec3<f32>(0., 0., 0.)));
}

[[stage(fragment)]]
fn main() -> void {
    var uv: vec2<f32>= fragCoord * vec2<f32>(1., uniforms.resolution.y / uniforms.resolution.x);
    var time: f32 = uniforms.time;
    var mouse: vec2<f32> = uniforms.mouse.xy;

    var rd: vec3<f32> = vec3<f32>(uv, 2.);
	var ro: vec3<f32> = vec3<f32>(0., 0., -3.);
	var bright: f32 = f32(ITER);

	for (var i: i32 = 0; i < ITER; i = i + 1) {
		var p: vec3<f32> = ro + rd * (1. + f32(i) / f32(ITER));
		if (hit(p) > 0.0) {
			bright = bright - 1.;
		}
	}
	fragColor = vec4<f32>(vec3<f32>(1., 1., 1.) * .005 * bright, 1.);
    
    return;
}
