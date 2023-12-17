/*
The MIT License (MIT)

Copyright (c) 2015 Patricio Gonzalez Vivo ( http://www.patriciogonzalezvivo.com )

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export interface ContextOptions {
  vertexString?: string;
  fragmentString?: string;
  backgroundColor?: string;
}
export interface GlslCanvasOptions {
  onError?: (code: 1 | 2) => void;
}
export default class GlslCanvas {
  constructor(
    canvas: HTMLCanvasElement,
    contextOptions?: ContextOptions,
    options?: GlslCanvasOptions,
  );

  destroy(): void;

  load(fragString?: string, vertString?: string): void;

  test(
    callback: (
      ret: {
        wasValid: boolean;
        frag: string;
        vert: string;
        timeElapsedMs: number;
      },
    ) => void,
    fragString?: string,
    vertString?: string,
  ): void;

  loadTexture<O extends Record<string, unknown>>(
    name: string,
    urlElementOrData:
      | string
      | { data: unknown; width: number; height: number }
      | O,
    options?: {
      url?: string;
      element?: O;
      data?: unknown;
      width?: number;
      height?: number;
    },
  ): void;

  refreshUniforms(): void;

  setUniform(name: string, ...value: unknown[]): void;

  setUniforms(uniforms: Record<string, unknown[]>): void;

  setMouse(mouse?: { x: number; y: number }): void;

  uniformTexture<O extends Record<string, unknown>>(
    name: string,
    texture: string | { data: unknown; width: number; height: number } | O,
    options?: {
      url?: string;
      element?: O;
      data?: unknown;
      width?: number;
      height?: number;
    },
  ): void;

  resize(): boolean;

  render(): void;

  pause(): void;

  play(): void;

  /** render main and buffers programs */
  renderPrograms(): void;

  /** parse input strings */
  getBuffers(
    fragString: string,
  ): Record<
    `u_buffer${number}`,
    { fragment: `#define BUFFER_${number}\n${string}` }
  >;

  /** resize buffers on canvas resize
   * consider applying a throttle of 50 ms on canvas resize
   * to avoid requestAnimationFrame and Gl violations
   */
  resizeSwappableBuffers(): void;

  version(): number;
}
