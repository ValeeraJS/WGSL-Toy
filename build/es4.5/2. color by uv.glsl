#version 450
layout(location = 0) out vec4 fragColor;
layout(location = 0) in vec2 fragCoord;

void main() {
    fragColor = vec4((fragCoord + 1) * 0.5, 0, 1);
}
