[[block]] struct Uniforms {
    [[offset(0)]] mouse: vec2<f32>;
    [[offset(8)]] resolution: vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;


[[stage(fragment)]] fn main() -> void {
    fragColor = vec4<f32>(uniforms.mouse / uniforms.resolution, 0., 1.0);
    return;
}
