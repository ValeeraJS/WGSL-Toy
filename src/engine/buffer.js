export default class F32Buffer {
    constructor(device, data, usage) {
        this.elementSize = data.BYTES_PER_ELEMENT;
        this.gpuBuffer = device.createBuffer({
            size: data.byteLength,
            usage: usage,
            mappedAtCreation: true
        });
        new Float32Array(this.gpuBuffer.getMappedRange()).set(data);
	    this.gpuBuffer.unmap();	
    }
}
