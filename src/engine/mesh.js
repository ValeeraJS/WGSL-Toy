export default class Mesh {
    constructor(device, geo, material) {
        this.device = device;
        this.geometry = geo;
        this.material = material;
        this.pipeline = null;

        this.createUniform();
    }

    createUniform() {

        // mouse
        this.uniformBuffer = this.device.createBuffer({
            size: 20,
            usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
        });

        this.bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    // mouse
                    binding: 0,
                    visibility: window.GPUShaderStage.FRAGMENT,
                    type: 'uniform-buffer',
                },
                // {
                //     // Sampler
                //     binding: 1,
                //     visibility: GPUShaderStage.FRAGMENT,
                //     type: 'sampler',
                // },
                // {
                //     // Texture view
                //     binding: 2,
                //     visibility: GPUShaderStage.FRAGMENT,
                //     type: 'sampled-texture',
                // },
            ],
        });
    }

    updatePipeline() {
        let vbufferConfig = [];
        for (let i = 0; i < this.geometry.nodes.length; i++) {
            vbufferConfig.push(this.geometry.nodes[i].toPipelineBuffer(i))
        }
        this.pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [this.bindGroupLayout],
        });

        this.pipeline = this.device.createRenderPipeline({
            layout: this.pipelineLayout,
            vertexStage: this.material.vertexStage,
            fragmentStage: this.material.fragmentStage,
            primitiveTopology: this.geometry.type,
            colorStates: [
                {
                    format: "bgra8unorm"
                }
            ],
            vertexState: {
                vertexBuffers: vbufferConfig
            }
        });

        window.mesh = this;

        this.uniformBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer,
                    },
                },
            ],
        });
        return this;
    }
}