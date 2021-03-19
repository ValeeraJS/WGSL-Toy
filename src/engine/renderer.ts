const swapChainFormat = "bgra8unorm";
const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
        {
            attachment: null as any,
            loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        },
    ],
};

export default class Renderer {
    device: GPUDevice;
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext | null;
    swapChain!: GPUSwapChain;
    format: string = '';
    commandEncoder!: GPUCommandEncoder;
    passEncoder: any;
    constructor(device: GPUDevice, canvas: HTMLCanvasElement) {
        this.device = device;
        this.canvas = canvas;
        this.context = canvas.getContext("gpupresent");
        if (!this.context) {
            return;
        }
        this.swapChain = this.context.configureSwapChain({
            device,
            format: swapChainFormat
        });
        this.format = swapChainFormat;
    }

    clear() {
        this.commandEncoder = this.device.createCommandEncoder();
        const textureView = this.swapChain.getCurrentTexture().createView();
        (renderPassDescriptor.colorAttachments as any)[0].attachment = textureView;

        this.passEncoder = this.commandEncoder.beginRenderPass(renderPassDescriptor);
    }

    end() {
        this.passEncoder.endPass();

        this.device.queue.submit([this.commandEncoder.finish()]);
    }

    render(mesh: any, mouseArray: Float32Array) {
        let pipeline = mesh.pipeline || mesh.updatePipeline().pipeline;
        (window as any).p = pipeline;
        this.device.queue.writeBuffer(
            mesh.uniformBuffer,
            0,
            mouseArray.buffer,
            mouseArray.byteOffset,
            mouseArray.byteLength
        );

        this.passEncoder.setBindGroup(0, mesh.uniformBindGroup);
        this.passEncoder.setPipeline(pipeline);
        for (let i = 0; i < mesh.geometry.nodes.length; i++) {
            this.passEncoder.setVertexBuffer(i, mesh.geometry.nodes[i].buffer.gpuBuffer);
        }

        this.passEncoder.draw(mesh.geometry.length, 1, 0, 0);
    }
}