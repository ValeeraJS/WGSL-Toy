[[block]] struct Uniforms {
    [[offset(0)]] mouse : vec2<f32>;
    [[offset(8)]] resolution : vec2<f32>;
    [[offset(16)]] time : f32;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;

const c: vec2<f32> = vec2<f32>(0.01, 1.02);
const maxLoop: i32 = 150;
const epsilon: f32 = 10.0;

[[stage(fragment)]] fn main() -> void {
    var z: vec2<f32> = fragCoord;

    var ii: i32 = 0;
    for (var i: i32 = 0; i < maxLoop; i = i + 1) {
		var x: f32 = (z.x * z.x - z.y * z.y) + uniforms.mouse.x / uniforms.resolution.x;
        var y: f32 = (z.x * z.y + z.x * z.y) + uniforms.mouse.y / uniforms.resolution.y;

        if ((x * x + y * y) > epsilon) {
            ii = i;
            break;
        } 
        z.x = x;
        z.y = y;
        ii = i;
    }

    var val: f32 = f32(ii) / f32(maxLoop);
    fragColor = vec4<f32>(val, val, val, 1.0);
}
