import React, { Component } from "react";
import Editor from "@monaco-editor/react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { RootState } from "../../app/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import {
  setCurrentCode,
  setCurrentShaderType,
  ShaderType,
} from "../../features/editor/shaderSlice";
import { editTab, TabDescripter } from "../../features/editor/tabSlice";

// 设置wgsl语法高亮和代码提示
function handleEditorBeforeMountWGSL(monaco: any) {
  monaco.languages.register({ id: "wgsl" });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider("wgsl", {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    keywords: [
      "continue",
      "for",
      "switch",
      "if",
      "break",
      "else",
      "case",
      "void",
      "const",
      "true",
      "false",
      "var",
      "var<in>",
      "var<out>",
      "var<uniform>",
      "fn",
      "location",
      "offset",
      "block",
      "struct",
      "binding",
      "group",
      "stage",
    ],
    ctypes: [
      "vec2<f32>",
      "vec3<f32>",
      "vec4<f32>",
      "mat2x2<f32>",
      "mat3x3<f32>",
      "mat4x4<f32>",
    ],
    types: [
      "in",
      "out",
      "uniform",
      "sampler",
      "i32",
      "f32",
      "i32",
      "bool",
      "texture_2d",
      "Uniforms",
    ],
    funcs: [
      "abs",
      "atan",
      "atan2",
      "clamp",
      "ceil",
      "cos",
      "cross",
      "distance",
      "dot",
      "floor",
      "fma",
      "fract",
      "length",
      "log",
      "log2",
      "max",
      "min",
      "mix",
      "modf",
      "normalize",
      "pow",
      "reflect",
      "sin",
      "smoothStep",
    ],
    special: ["return", "fragment", "vertex"],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    tokenizer: {
      root: [
        [/\/\/[^\n]*/, "comment"],
        [
          /[a-zA-Z_$<>][\w<>$]*/,
          {
            cases: {
              "@ctypes": "types",
              "@keywords": { token: "keyword.$0" },
              "@types": "types",
              "@funcs": "funcs",
              "@special": "special",
              "@default": "identifier",
            },
          },
        ],
        [/(@digits)[eE]([-+]?(@digits))?[fFdD]?/, "number"],
        [/(@digits)\.(@digits)([eE][-+]?(@digits))?[fFdD]?/, "number"],
        [/(@digits)[fFdD]/, "number"],
        [/(@digits)[lL]?/, "number"],
      ],
    },
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme("vs-dark-wgsl", {
    base: "vs-dark",
    inherit: true,
    rules: [
      // { token: 'identifier', foreground: 'dcdc9d' },
      { token: "funcs", foreground: "d0dcaa" },
      { token: "types", foreground: "4ec9b0" },
      { token: "special", foreground: "c582b6" },
      { token: "number", foreground: "b5c078" },
      { token: "comment", foreground: "529955" },
    ],
  });

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider("wgsl", {
    provideCompletionItems: () => {
      var suggestions = [
        {
          label: "ifelse",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: `if (\${1:condition}) {
                    \t$0
                } else {
                    \t
                }`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "If-Else Statement",
        },
        {
          label: "location",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: `[[location(\${1:0})]]`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Location Statement",
        },
      ];
      return { suggestions };
    },
  });
}

// 设置glsl语法高亮和代码提示
function handleEditorBeforeMountGLSL(monaco: any) {
  monaco.languages.register({ id: "glsl" });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider("glsl", {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    keywords: [
      "continue",
      "for",
      "switch",
      "if",
      "break",
      "else",
      "case",
      "void",
      "const",
      "true",
      "false",
      "var",
      "var",
      "fn",
      "layout",
      "offset",
      "block",
      "struct",
      "binding",
      "group",
      "stage",
    ],
    types: [
      "in",
      "out",
      "uniform",
      "sampler",
      "int",
      "float",
      "bool",
      "texture_2d",
      "Uniforms",
      "vec2",
      "vec3",
      "vec4",
      "mat2",
      "mat3",
      "mat4"
    ],
    funcs: [
      "abs",
      "atan",
      "atan2",
      "clamp",
      "ceil",
      "cos",
      "cross",
      "distance",
      "dot",
      "floor",
      "fma",
      "fract",
      "length",
      "log",
      "log2",
      "main",
      "max",
      "min",
      "mix",
      "mod",
      "modf",
      "normalize",
      "pow",
      "reflect",
      "sin",
      "smoothstep",
    ],
    special: ["#version", "return", "location", "#define"],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    tokenizer: {
      root: [
        [/\/\/[^\n]*/, "comment"],
        [
          /[a-zA-Z_$#][\w$]*/,
          {
            cases: {
              "@keywords": { token: "keyword.$0" },
              "@types": "types",
              "@funcs": "funcs",
              "@special": "special",
              "@default": "identifier",
            },
          },
        ],
        [/(@digits)[eE]([-+]?(@digits))?[fFdD]?/, "number"],
        [/(@digits)\.(@digits)([eE][-+]?(@digits))?[fFdD]?/, "number"],
        [/(@digits)[fFdD]/, "number"],
        [/(@digits)[lL]?/, "number"],
      ],
    },
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme("vs-dark-glsl", {
    base: "vs-dark",
    inherit: true,
    rules: [
      // { token: 'identifier', foreground: 'dcdc9d' },
      { token: "funcs", foreground: "d0dcaa" },
      { token: "types", foreground: "4ec9b0" },
      { token: "special", foreground: "c582b6" },
      { token: "number", foreground: "b5c078" },
      { token: "comment", foreground: "529955" },
    ],
  });

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider("glsl", {
    provideCompletionItems: () => {
      var suggestions = [
        {
          label: "ifelse",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: `if (\${1:condition}) {
                    \t$0
                } else {
                    \t
                }`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "If-Else Statement",
        }
      ];
      return { suggestions };
    },
  });
}

@(connect(
  (state: RootState) => {
    return {
      tabs: state.tabs,
      shader: state.shader,
    };
  },
  (dispatch) => {
    return bindActionCreators(
      {
        setCurrentCode: setCurrentCode,
        setCurrentShaderType: setCurrentShaderType,
        editTab: editTab,
      },
      dispatch
    );
  }
) as any)
export default class CodePage extends Component<any> {
  isCodePage = true;

  updateCode = (code: string = "") => {
    let panes: TabDescripter[] = this.props.tabs.panes;
    for(let item of panes) {
      if (item.key === this.props.keyName) {
        let result = {
          ...item
        };
        result.code = code;
        this.props.editTab(result);
        break;
      }
    }
  };

  render() {
    const {language, code} = this.props;
    return (
      <Dropzone
        noClick
        noKeyboard
        multiple={false}
        onDrop={(files, r, event) => {
          if (files.length) {
            let reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = () => {
              this.updateCode((reader.result as string) || "");
            };
          }
          event.stopPropagation();
        }}
      >
        {({ getRootProps }) => {
          return (
            <div style={{ height: "100%" }} {...getRootProps()}>
              <Editor
                height="100%"
                theme={language === ShaderType.WGSL ? "vs-dark-wgsl" : "vs-dark-glsl"}
                defaultLanguage={language === ShaderType.WGSL ? "wgsl" : "glsl"}
                value={code}
                onChange={this.updateCode}
                beforeMount={language === ShaderType.WGSL ? handleEditorBeforeMountWGSL : handleEditorBeforeMountGLSL}
              />
            </div>
          );
        }}
      </Dropzone>
    );
  }
}
