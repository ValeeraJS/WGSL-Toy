[[block]] struct Uniforms {
    [[offset(8)]] resolution: vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;


fn sdfCircle(point: vec2<f32>, radius: f32) -> bool {
    const aspect: f32 = uniforms.resolution.y / uniforms.resolution.x;
    return distance(vec2<f32>(fragCoord.x, fragCoord.y * aspect), point) < radius;
}

[[stage(fragment)]] fn main() -> void {
    if (sdfCircle(vec2<f32>(0., 0.), 0.5)) {
        fragColor = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    } else {
        fragColor = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    }
    
    return;
}
