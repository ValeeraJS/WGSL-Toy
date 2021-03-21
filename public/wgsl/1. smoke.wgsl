[[block]] struct Uniforms {
    [[offset(0)]] mouse : vec2<f32>;
    [[offset(16)]] time : f32;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;
    
const MAX_ITER: i32 = 20;
const TAU: f32 = 7.28318530718;

[[stage(fragment)]] fn main() -> void {
    var uv: vec2<f32>= (fragCoord + vec2<f32>(1., 1.)) / vec2<f32>(2., 2.);
    var time: f32 = uniforms.time;
    
    var p: vec2<f32> = (uv * vec2<f32>(TAU, TAU) % vec2<f32>(TAU, TAU)) - vec2<f32>(250.0, 250.0);
    var i: vec2<f32> = vec2<f32>(p);
    var c: f32 = .5;
    var inten: f32 = .005;
    
    for (var n: i32 = 0; n < MAX_ITER; n = n + 1) {
        var t: f32 = 0.16 * (time+23.0) * (1.0 - (3.5 / (f32(n) + 1.0)));
        i = p + vec2<f32>(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c = c + 1.0 / length(vec2<f32>(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }
    
    c = c / f32(MAX_ITER);
    c = 1.0 - pow(c, 2.0);
    var cc: f32 = pow(abs(c), 12.0);
    var color: vec3<f32> = vec3<f32>(cc, cc, cc);
    color = clamp(color, vec3<f32>(0.0, 0.0, 0.0), vec3<f32>(1.0, 1.0, 1.0));
    
    var tint: vec3<f32>= vec3<f32>(uv.x, uv.y, (1.0 - uv.x) * (1.0 - uv.y) );
    fragColor = vec4<f32>(color * tint, 1.0);
    return;
}
