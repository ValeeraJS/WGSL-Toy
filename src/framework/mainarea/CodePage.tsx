import React, { Component } from "react";
import Editor from "@monaco-editor/react";
import Dropzone from 'react-dropzone';

import F32Buffer from "../../engine/buffer.js";
import Renderer from "../../engine/renderer";
import { GeometryNode, Geometry } from "../../engine/geometry.js";
import Material from "../../engine/material.js";
import Mesh from "../../engine/mesh.js";
import { setMsgOut } from "../ConsoleBar/ConsoleBar";

let f32BufferArray = new Float32Array([0, 0, 0, 0, 0]);

export { f32BufferArray };

// const options = {
//     selectOnLineNumbers: true,
//     automaticLayout: true
// };

let material: Material;
let mesh: Mesh;

export async function init(canvas: any) {
    const adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) {
        setMsgOut("Your browser doesn't support WebGPU, please use newest Chrome Canary.");
        return () => {};
    }
    const device = await adapter.requestDevice();
    if (!device) {
        setMsgOut("Your browser doesn't support WebGPU, please use newest Chrome Canary.");
        return () => {};
    }
    const renderer = new Renderer(device, canvas);

    // 顶点位置数据
    const verticesData = new Float32Array([
        -1, 1,
        -1, -1,
        1, -1,
        -1, 1,
        1, -1,
        1, 1,
    ]);
    const verticesBuffer = new F32Buffer(device, verticesData, GPUBufferUsage.VERTEX);
    const vnode = new GeometryNode(verticesBuffer, 'vertices', {
        stride: 2,
        offset: 0,
        format: 'float32x2'
    })

    material = new Material(device, wgslShaders.vertex, wgslShaders.fragment);
    const geo = new Geometry("triangle-list", 6, [vnode]);
    mesh = new Mesh(device, geo, material);

    function frame() {
        renderer.clear();
        f32BufferArray[4] = performance.now() / 1000;
        renderer.render(mesh, f32BufferArray);
        renderer.end();
        return requestAnimationFrame(frame);
    }

    return frame;
}

export const wgslShaders = {
    vertex: `[[builtin(position)]] var<out> out_position : vec4<f32>;
[[location(0)]] var<in> a_position : vec2<f32>;
[[location(0)]] var<out> fragCoord : vec2<f32>;
[[stage(vertex)]]
fn main() -> void {
	out_position = vec4<f32>(a_position, 0.0, 1.0);
    fragCoord = a_position;
	return;
}
`,
    fragment: `[[block]] struct Uniforms {
    [[offset(0)]] mouse: vec2<f32>;
    [[offset(8)]] resolution: vec2<f32>;
    [[offset(16)]] time: f32;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;  
[[location(0)]] var<in> fragCoord: vec2<f32>;
[[location(0)]] var<out> fragColor : vec4<f32>;


[[stage(fragment)]]
fn main() -> void {
    fragColor = vec4<f32>(uniforms.mouse / uniforms.resolution, 0., 1.0);
    return;
}
`
};

let fff: any, fIndex: any;

export function renderCanvasMouseMove(event: any) {
    f32BufferArray[0] = event.offsetX;
    f32BufferArray[1] = event.offsetY;
}

export function updateMaterialShader(code: string = '') {
    material.changeFS(code);
    mesh.updatePipeline();
    cancelAnimationFrame(fIndex);
    fIndex = fff();
}

let hasCanvas = setInterval(() => {
    let canvas = document.getElementById("renderTarget");
    if (canvas) {
        canvas.addEventListener('mousemove', renderCanvasMouseMove);
        clearInterval(hasCanvas);
        init(canvas).then(frame => {
            fff = frame;
            frame?.();
        });
    }
}, 100);

// 设置语法高亮和代码提示
function handleEditorBeforeMount(monaco: any) {
    monaco.languages.register({ id: 'wgsl' });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('wgsl', {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        keywords: [
            'continue',
            'for',
            'switch',
            'if',
            'break',
            'else',
            'case',
            'void',
            'const',
            'true',
            'false',
            'var',
            'var<in>',
            'var<out>',
            'var<uniform>',
            'var',
            'fn',
            'location',
            'offset',
            'block',
            'struct',
            'binding',
            'group',
            'stage'
        ],
        ctypes: [
            'vec2<f32>',
            'vec3<f32>',
            'vec4<f32>',
            'mat2x2<f32>',
            'mat3x3<f32>',
            'mat4x4<f32>',
        ],
        types: [
            'in',
            'out',
            'uniform',
            'sampler',
            'i32',
            'f32',
            'i32',
            
            'texture_2d',
            'Uniforms'
        ],
        funcs: [
            'abs',
            'clamp',
            'cos',
            'cross',
            'distance',
            'dot',
            'length',
            'normalize',
            'sin',
            'smoothStep'
        ],
        special: [
            'return',
            'fragment',
            'vertex'
        ],
        symbols: /[=><!~?:&|+\-*/^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+(_+\d+)*/,
        tokenizer: {
            root: [
                [/\/\/[^\n]*/, 'comment'],
                [
                    /[a-zA-Z_$<>][\w<>$]*/,
                    {
                        cases: {
                            '@ctypes': 'types',
                            '@keywords': { token: 'keyword.$0' },
                            '@types': 'types',
                            '@funcs': 'funcs',
                            '@special': 'special',
                            '@default': 'identifier',
                        }
                    }
                ],
                [/(@digits)[eE]([-+]?(@digits))?[fFdD]?/, 'number'],
                [/(@digits)\.(@digits)([eE][-+]?(@digits))?[fFdD]?/, 'number'],
                [/(@digits)[fFdD]/, 'number'],
                [/(@digits)[lL]?/, 'number'],
            ],
        }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('vs-dark-wgsl', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            // { token: 'identifier', foreground: 'dcdc9d' },
            { token: 'funcs', foreground: 'd0dcaa' },
            { token: 'types', foreground: '4ec9b0' },
            { token: 'special', foreground: 'c582b6' },
            { token: 'number', foreground: 'b5c078' },
            { token: 'comment', foreground: '529955' },
        ]
    });

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('wgsl', {
        provideCompletionItems: () => {
            var suggestions = [{
                label: 'ifelse',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'if (${1:condition}) {',
                    '\t$0',
                    '} else {',
                    '\t',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'If-Else Statement'
            }];
            return { suggestions: suggestions };
        }
    });
}

interface CodePageProps {
    code?: string;
}

export default class CodePage extends Component<CodePageProps> {
    isCodePage = true;

    state = {
        code: this.props.code || ''
    }

    updateCode = (code: string = '') => {
        this.setState({ code });
    }

    render() {
        return (
            <Dropzone noClick noKeyboard multiple={false} onDrop={(files, r, event) => {
                if (files.length) {
                    let reader = new FileReader();
                    reader.readAsText(files[0]);
                    reader.onload = () => {
                        this.updateCode(reader.result as string || '');
                    };
                }
                event.stopPropagation();
            }}>
                {({ getRootProps }) => {
                    return (
                        <div style={{ height: '100%' }} {...getRootProps()}>
                            <Editor
                                height="100%"
                                theme="vs-dark-wgsl"
                                defaultLanguage="wgsl"
                                defaultValue={this.state.code}
                                value={this.state.code}
                                onChange={this.updateCode}
                                beforeMount={handleEditorBeforeMount}
                            />
                        </div>
                    );
                }}
            </Dropzone>
        );
    }
}
