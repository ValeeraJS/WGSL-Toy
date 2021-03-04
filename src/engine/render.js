import F32Buffer from "./buffer.js";
import Renderer from "./renderer.js";
import {GeometryNode, Geometry} from "./geometry.js";
import Material from "./material.js";
import Mesh from "./mesh.js";

export async function init(canvas, useWGSL) {
	const adapter = await navigator.gpu.requestAdapter();
	const device = await adapter.requestDevice();
	const renderer = new Renderer(device, canvas);

	// 顶点位置数据
	const verticesData = new Float32Array([
		0, 0.5,
		-0.5, -0.5,
		0.5, -0.5,
	]);
	const verticesBuffer = new F32Buffer(device, verticesData, GPUBufferUsage.VERTEX);
	const vnode = new GeometryNode(verticesBuffer, 'vertices', {
		stride: 2,
		offset: 0,
		format: 'float32x2'
	})

	// 顶点颜色数据rgb
	const colorData = new Float32Array([
		0, 0, 1,
		0, 1, 0,
		1, 0, 0
	]);
	const colorBuffer = new F32Buffer(device, colorData, GPUBufferUsage.VERTEX);
	const cnode = new GeometryNode(colorBuffer, 'color', {
		stride: 3,
		offset: 0,
		format: 'float3'
	})	

	const material = new Material(device, wgslShaders.vertex, wgslShaders.fragment);
	const geo = new Geometry("triangle-list", 3, [vnode, cnode]);
	const mesh = new Mesh(device, geo, material);

	function frame() {
		renderer.clear();
		renderer.render(mesh);
		renderer.end();
	}

	return frame;
}

const wgslShaders = {
	vertex: `
		[[builtin(position)]] var<out> out_position : vec4<f32>;
		[[location(0)]] var<out> out_color : vec3<f32>;
		[[location(0)]] var<in> a_position : vec2<f32>;
		[[location(1)]] var<in> a_color : vec3<f32>;
		[[stage(vertex)]]
		fn main() -> void {
			out_position = vec4<f32>(a_position, 0.0, 1.0);
			out_color = a_color;
			return;
		}
	`,
	fragment: `
		[[location(0)]] var<out> fragColor : vec4<f32>;
		[[location(0)]] var<in> in_color : vec3<f32>;
		[[stage(fragment)]]
		fn main() -> void {
			fragColor = vec4<f32>(in_color, 1.0);
			return;
		}
	`
};

init(document.getElementById("webgpu-canvas"), true).then((frame) => {
	frame();
});
