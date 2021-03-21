[[block]] struct Uniforms {
    [[offset(0)]] mouse: vec2<f32>;
    [[offset(8)]] resolution: vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;


fn sdfCircle(uv: vec2<f32>, center: vec2<f32>, radius: f32) -> f32 {
    return length(uv - center) - radius;
}

[[stage(fragment)]] fn main() -> void {
    var aspect: f32 = uniforms.resolution.y / uniforms.resolution.x;
    var uv: vec2<f32> = fragCoord * vec2<f32>(1., aspect);
    var mouse: vec2<f32> = (uniforms.mouse * 2. - uniforms.resolution) / uniforms.resolution * vec2<f32>(1., -aspect);
    var d: f32 = sdfCircle(uv, mouse, 0.5);

    if (d < 0.) {
        fragColor = vec4<f32>(1., 1., 1., 1.0);
    } else {
        fragColor = vec4<f32>(0., 0., 0., 1.0);
    }
    
    return;
}
