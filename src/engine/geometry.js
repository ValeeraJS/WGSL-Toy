let defaultOpt = {
    stride: 2,
    offset: 0,
    format: "float32x2"
}

export class GeometryNode {
    constructor(buffer, name, options = defaultOpt) {
        this.name = name;
        this.buffer = buffer;
        this.stride = options.stride;
        this.offset = options.offset;
        this.format = options.format;
    }

    toPipelineBuffer(shaderLocation) {
        return {
            arrayStride: this.stride * this.buffer.elementSize,
            attributes:[{
                shaderLocation: shaderLocation,
                offset: this.offset,
                format: this.format
            }]
        }
    }
}

export class Geometry {
    constructor(type, length, nodes = []) {
        this.type = type; // 拓扑类型
        this.length = length; // 顶点数据数量长度
        this.nodes = nodes;
    }
}