[[block]] struct Uniforms {
    [[offset(0)]] mouse : vec2<f32>;
    [[offset(8)]] resolution : vec2<f32>;
    [[offset(16)]] time : f32;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;

fn getR(p: vec3<f32>, a: vec3<f32>, r: vec3<f32>) -> vec3<f32> {
    return mix(a * dot(p, a), p, sin(r)) + sin(r) * cross(p, a);
}

const one: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);

[[stage(fragment)]]
fn main() -> void {
    fragColor = vec4<f32>(0., 0., 0., 0.);
    var p: vec3<f32>;
    var r: vec2<f32> = uniforms.resolution;
    var dotV: vec2<f32> = vec2<f32>(0.5, 0.5) * r; 
    var d: vec3<f32> = normalize(vec3<f32>((fragCoord * r - dotV) / vec2<f32>(r.y, r.y), 1.0));

    var g: f32 = 0.;
    var e: f32;
    var s: f32;
    for (var i: i32 = 0; i < 99; i = i + 1) {
        p = g * d;
        p.z = p.z + uniforms.time * 0.3;
        p = getR(p, normalize(vec3<f32>(1.0, 2.0, 3.0)), vec3<f32>(0.5, 0.5, 0.5));   
        s = 2.5;
        p = abs((p - one) % vec3<f32>(2.0, 2.0, 2.0) - one) - one;

        for(var j: i32 = 0; j < 10; j = j + 1){
            p = one - abs(p - one);
            e = -1.8 / dot(p, p);
            s = s * e;
            p = p * vec3<f32>(e, e, e) - vec3<f32>(0.7, 0.7, 0.7);
        }

        e = abs(p.z) / s + .001;
        g = g + e;   
        var l09: f32 = log(s * 9.0);
        var dpe: f32 = dot(p, p) * e;
        var oo: vec3<f32> = fragColor.xyz + vec3<f32>(0.00005, 0.00005, 0.00005) * abs(cos(vec3<f32>(3.0, 2.0, 1.0) + vec3<f32>(l09, l09, l09))) / vec3<f32>(dpe, dpe, dpe);
        fragColor = vec4<f32>(oo, fragColor.w);
    }
    return;
}
