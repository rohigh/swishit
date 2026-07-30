/**
 * Standalone OGL implementation for Next.js (zero node_modules dependency)
 */

export class Transform {
  constructor() {
    this.parent = null;
    this.children = [];
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.scale = {
      x: 1,
      y: 1,
      z: 1,
      set(x, y, z = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
    };
    this.matrix = new Float32Array(16);
    this.worldMatrix = new Float32Array(16);
    this.identity(this.matrix);
    this.identity(this.worldMatrix);
  }

  identity(m) {
    m.fill(0);
    m[0] = m[5] = m[10] = m[15] = 1;
  }

  setParent(parent) {
    if (this.parent) {
      const idx = this.parent.children.indexOf(this);
      if (idx !== -1) this.parent.children.splice(idx, 1);
    }
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
  }

  updateMatrixWorld() {
    const cosZ = Math.cos(this.rotation.z);
    const sinZ = Math.sin(this.rotation.z);

    this.matrix[0] = cosZ * this.scale.x;
    this.matrix[1] = sinZ * this.scale.x;
    this.matrix[2] = 0;
    this.matrix[3] = 0;

    this.matrix[4] = -sinZ * this.scale.y;
    this.matrix[5] = cosZ * this.scale.y;
    this.matrix[6] = 0;
    this.matrix[7] = 0;

    this.matrix[8] = 0;
    this.matrix[9] = 0;
    this.matrix[10] = this.scale.z;
    this.matrix[11] = 0;

    this.matrix[12] = this.position.x;
    this.matrix[13] = this.position.y;
    this.matrix[14] = this.position.z;
    this.matrix[15] = 1;

    if (this.parent) {
      for (let i = 0; i < 16; i++) {
        this.worldMatrix[i] = this.matrix[i];
      }
      this.worldMatrix[12] += this.parent.position.x;
      this.worldMatrix[13] += this.parent.position.y;
      this.worldMatrix[14] += this.parent.position.z;
    } else {
      this.worldMatrix.set(this.matrix);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateMatrixWorld();
    }
  }
}

export class Camera extends Transform {
  constructor(gl, { fov = 45, near = 0.1, far = 100 } = {}) {
    super();
    this.gl = gl;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = 1;
    this.projectionMatrix = new Float32Array(16);
    this.perspective({ aspect: 1 });
  }

  perspective({ aspect = this.aspect, fov = this.fov, near = this.near, far = this.far } = {}) {
    this.aspect = aspect;
    this.fov = fov;
    this.near = near;
    this.far = far;

    const f = 1.0 / Math.tan((fov * Math.PI) / 360);
    const rangeInv = 1.0 / (near - far);

    this.projectionMatrix.fill(0);
    this.projectionMatrix[0] = f / aspect;
    this.projectionMatrix[5] = f;
    this.projectionMatrix[10] = (near + far) * rangeInv;
    this.projectionMatrix[11] = -1;
    this.projectionMatrix[14] = near * far * rangeInv * 2;
  }
}

export class Plane {
  constructor(gl, { width = 1, height = 1 } = {}) {
    this.gl = gl;
    this.width = width;
    this.height = height;

    this.attributes = {
      position: new Float32Array([
        -0.5,  0.5, 0.0,
        -0.5, -0.5, 0.0,
         0.5,  0.5, 0.0,
         0.5, -0.5, 0.0,
      ]),
      uv: new Float32Array([
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
      ]),
    };
  }
}

export class Texture {
  constructor(gl, { generateMipmaps = false } = {}) {
    this.gl = gl;
    this.generateMipmaps = false;
    this.texture = gl.createTexture();
    this._image = null;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([240, 240, 240, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  set image(img) {
    this._image = img;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  get image() {
    return this._image;
  }
}

export class Program {
  constructor(gl, { vertex, fragment, uniforms = {}, transparent = false } = {}) {
    this.gl = gl;
    this.uniforms = uniforms;
    this.transparent = transparent;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertex);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragment);
    gl.compileShader(fShader);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vShader);
    gl.attachShader(this.program, fShader);
    gl.linkProgram(this.program);
  }
}

export class Mesh extends Transform {
  constructor(gl, { geometry, program } = {}) {
    super();
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;

    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.attributes.position, gl.STATIC_DRAW);

    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.attributes.uv, gl.STATIC_DRAW);
  }

  draw({ camera }) {
    const gl = this.gl;
    const prog = this.program.program;
    gl.useProgram(prog);

    const mvMat = new Float32Array(16);
    mvMat.set(this.worldMatrix);
    mvMat[14] -= camera.position.z;

    const pMatLoc = gl.getUniformLocation(prog, "projectionMatrix");
    const mvMatLoc = gl.getUniformLocation(prog, "modelViewMatrix");

    if (pMatLoc) gl.uniformMatrix4fv(pMatLoc, false, camera.projectionMatrix);
    if (mvMatLoc) gl.uniformMatrix4fv(mvMatLoc, false, mvMat);

    let textureUnit = 0;
    Object.keys(this.program.uniforms).forEach((key) => {
      const u = this.program.uniforms[key];
      const loc = gl.getUniformLocation(prog, key);
      if (!loc) return;

      if (u.value instanceof Texture) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, u.value.texture);
        gl.uniform1i(loc, textureUnit);
        textureUnit++;
      } else if (Array.isArray(u.value)) {
        if (u.value.length === 2) gl.uniform2f(loc, u.value[0], u.value[1]);
      } else if (typeof u.value === "number") {
        gl.uniform1f(loc, u.value);
      }
    });

    const aPos = gl.getAttribLocation(prog, "position");
    if (aPos !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    }

    const aUv = gl.getAttribLocation(prog, "uv");
    if (aUv !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw({ camera });
    }
  }
}

export class Renderer {
  constructor({ alpha = true, antialias = true, dpr = 1 } = {}) {
    this.dpr = dpr;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "w-full h-full block";
    this.gl = this.canvas.getContext("webgl", { alpha, antialias, premultipliedAlpha: false });
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render({ scene, camera }) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    scene.updateMatrixWorld();
    camera.updateMatrixWorld();
    for (let i = 0; i < scene.children.length; i++) {
      scene.children[i].draw({ camera });
    }
  }
}
