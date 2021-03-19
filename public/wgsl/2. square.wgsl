[[block]] struct Uniforms {
    [[offset(8)]] resolution: vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;


fn sdfSquare(point: vec2<f32>, width: f32, height: f32) -> bool {
    const aspect: f32 = uniforms.resolution.y / uniforms.resolution.x;
    var x: f32 = fragCoord.x;
    var y: f32 = fragCoord.y * aspect;
    return x > point.x - width / 2.0 && x < point.x + width / 2.0 
        && y > point.y - height / 2.0 && y < point.y + height / 2.0;
}

[[stage(fragment)]] fn main() -> void {
    if (sdfSquare(vec2<f32>(0., 0.), 0.5, 0.5)) {
        fragColor = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    } else {
        fragColor = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    }
    
    return;
}
