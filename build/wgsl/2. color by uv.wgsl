[[location(0)]] var<out> fragColor : vec4<f32>;
[[location(0)]] var<in> fragCoord: vec2<f32>;

[[stage(fragment)]] fn main() -> void {
    fragColor = vec4<f32>((fragCoord.x + 1.) * 0.5, (fragCoord.y + 1.) * 0.5, 0.0, 1.0);
    return;
}

// Practice:
// Paint the whole canvas with blue color
