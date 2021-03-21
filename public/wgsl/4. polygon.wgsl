[[block]] struct Uniforms {
    [[offset(0)]] mouse: vec2<f32>;
    [[offset(8)]] resolution: vec2<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;

const PI: f32 = 3.1415927;
const EDGE_COUNT: i32 = 5;

fn sdPolygon(pp: vec2<f32>, radius: f32, n: i32, rotation: f32) -> f32 {
    var p: vec2<f32> = pp;
    var an: f32 = PI / f32(n);
    var acs: vec2<f32> = vec2<f32>(cos(an), sin(an));
    var ecs: vec2<f32> = vec2<f32>(0., 1.);

    var bn: f32 = (atan2(p.x , p.y) + rotation) % (2.0 * an) - an;
    p = length(p) * vec2<f32>(cos(bn), abs(sin(bn)));
    p = p - radius * acs;
    p = p + ecs * clamp(-dot(p,ecs), 0.0, radius * acs.y / ecs.y);
    return p.x ;
}

[[stage(fragment)]] fn main() -> void {
    const aspect: f32 = uniforms.resolution.y / uniforms.resolution.x;
    var p: vec2<f32> = fragCoord * vec2<f32>(1., aspect);

    var m: f32 = 2.0;
    var d: f32 = sdPolygon(p, 0.5, EDGE_COUNT, uniforms.mouse.x / uniforms.resolution.x * 2.);

    if (d < 0.) {
        fragColor = vec4<f32>(1., 1., 1., 1.0);
    } else {
        fragColor = vec4<f32>(0., 0., 0., 1.0);
    }
    
    return;
}
