[[block]] struct Uniforms {
    [[offset(8)]] resolution : vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<out> fragColor : vec4<f32>;
[[location(0)]] var<in> fragCoord: vec2<f32>;

const SCALE: f32 = 4.;

fn chessboard(uv: vec2<f32>) -> f32 {
    var uv2: vec2<f32> = floor(uv); 
    return (uv2.x + uv2.y) % 2.0;
}

[[stage(fragment)]] fn main() -> void {
    var aspect: f32 = uniforms.resolution.x / uniforms.resolution.y;
    var uv: vec2<f32> = fragCoord * vec2<f32>(aspect, 1.) * SCALE;
    var c: f32 = chessboard(uv);
    fragColor = vec4<f32>(c, c, c, 1.);

    return;
}
