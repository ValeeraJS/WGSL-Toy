[[block]] struct Uniforms {
    [[offset(0)]] mouse: vec2<f32>;
    [[offset(8)]] resolution: vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;


fn sdfEllipse(uv: vec2<f32>, f1: vec2<f32>, f2: vec2<f32>, a: f32) -> f32 {
    return length(uv - f1) + length(uv - f2) - a;
}

[[stage(fragment)]] fn main() -> void {
    var aspect: f32 = uniforms.resolution.y / uniforms.resolution.x;
    var uv: vec2<f32> = fragCoord * vec2<f32>(1., aspect);
    var mouse: vec2<f32> = (uniforms.mouse * 2. - uniforms.resolution) / uniforms.resolution * vec2<f32>(1., -aspect);
    var d: f32 = sdfEllipse(uv, mouse, mouse * -1., 1.0);

    if (d < 0.) {
        fragColor = vec4<f32>(1., 1., 1., 1.0);
    } else {
        fragColor = vec4<f32>(0., 0., 0., 1.0);
    }
    
    return;
}
