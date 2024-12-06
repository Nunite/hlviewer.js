var xs = Object.defineProperty;
var ws = (e, t, s) => t in e ? xs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var f = (e, t, s) => ws(e, typeof t != "symbol" ? t + "" : t, s);
let it = () => ({
  emit(e, ...t) {
    for (let s = 0, n = this.events[e] || [], i = n.length; s < i; s++)
      n[s](...t);
  },
  events: {},
  on(e, t) {
    var s;
    return ((s = this.events)[e] || (s[e] = [])).push(t), () => {
      var n;
      this.events[e] = (n = this.events[e]) == null ? void 0 : n.filter((i) => t !== i);
    };
  }
});
const dt = performance.now.bind(performance), Tt = (e) => {
  const t = Math.floor(e / 60), s = Math.floor(e - t * 60), n = t < 10 ? `0${t}` : t.toString(), i = s < 10 ? `0${s}` : s.toString();
  return `${n}:${i}`;
}, Xt = new AudioContext();
class Kt {
  constructor() {
    f(this, "context");
    f(this, "channels");
    f(this, "masterGain");
    f(this, "preMuteVolume");
    f(this, "events");
    this.context = Xt, this.events = it();
    const t = Number.parseFloat(localStorage.getItem("volume") || "0.3");
    localStorage.setItem("volume", t.toString()), this.channels = [], this.preMuteVolume = 1, this.masterGain = this.context.createGain(), this.masterGain.gain.value = t, this.masterGain.connect(this.context.destination);
    for (let s = 0; s < 8; ++s)
      this.channels.push({
        source: null,
        gain: this.context.createGain()
      }), this.channels[s].gain.connect(this.masterGain);
  }
  static getContext() {
    return Xt;
  }
  play(t, s, n) {
    this.stop(s);
    const i = this.channels[s].gain;
    i.gain.value = Math.max(0, Math.min(1, n));
    const o = this.context.createBufferSource();
    o.buffer = t.buffer, o.connect(i), o.start(0), this.channels[s].source = o;
  }
  stop(t) {
    const s = this.channels[t].source;
    s && s.stop(0);
  }
  getVolume() {
    return this.masterGain.gain.value;
  }
  setVolume(t) {
    const s = this.masterGain.gain.value;
    s > 0 && t === 0 && (this.preMuteVolume = s), this.masterGain.gain.value = t, localStorage.setItem("volume", t.toString()), this.events.emit("volumeChange", t);
  }
  toggleMute() {
    this.getVolume() === 0 ? this.setVolume(this.preMuteVolume) : this.setVolume(0);
  }
}
class Rt {
  constructor(t) {
    f(this, "index");
    f(this, "name");
    f(this, "buffer");
    this.index = -1, this.name = "", this.buffer = t;
  }
  static create(t) {
    return new Promise((s, n) => {
      Kt.getContext().decodeAudioData(
        t,
        (i) => {
          s(new Rt(i));
        },
        (i) => {
          n(i);
        }
      );
    });
  }
}
function es(e, t) {
  return e.slice(e.lastIndexOf("/") + 1).replace(t || "", "");
}
function bs(e) {
  const t = e.lastIndexOf("/"), s = e.lastIndexOf(".");
  return t < s ? e.slice(s) : "";
}
var D = /* @__PURE__ */ ((e) => (e[e.UByte = 0] = "UByte", e[e.Byte = 1] = "Byte", e[e.UShort = 2] = "UShort", e[e.Short = 3] = "Short", e[e.UInt = 4] = "UInt", e[e.Int = 5] = "Int", e[e.Float = 6] = "Float", e[e.Double = 7] = "Double", e[e.NString = 8] = "NString", e[e.String = 9] = "String", e))(D || {});
class fe {
  constructor(t) {
    f(this, "data");
    f(this, "offset");
    this.data = new DataView(t), this.offset = 0;
  }
  length() {
    return this.data.byteLength;
  }
  tell() {
    return this.offset;
  }
  seek(t) {
    this.offset = Math.max(0, t);
  }
  skip(t) {
    this.seek(this.tell() + t);
  }
  b() {
    const t = this.data.getInt8(this.offset);
    return this.skip(1), t;
  }
  ub() {
    const t = this.data.getUint8(this.offset);
    return this.skip(1), t;
  }
  s(t = !0) {
    const s = this.data.getInt16(this.offset, t);
    return this.skip(2), s;
  }
  us(t = !0) {
    const s = this.data.getUint16(this.offset, t);
    return this.skip(2), s;
  }
  i(t = !0) {
    const s = this.data.getInt32(this.tell(), t);
    return this.skip(4), s;
  }
  ui(t = !0) {
    const s = this.data.getUint32(this.tell(), t);
    return this.skip(4), s;
  }
  f(t = !0) {
    const s = this.data.getFloat32(this.tell(), t);
    return this.skip(4), s;
  }
  lf(t = !0) {
    const s = this.data.getFloat64(this.tell(), t);
    return this.skip(8), s;
  }
  str() {
    let t = this.ub(), s = "";
    for (; t !== 0; )
      s += String.fromCharCode(t), t = this.ub();
    return s;
  }
  nstr(t) {
    let s = t;
    if (s < 0)
      return "";
    let n = "";
    for (; s > 0; ) {
      s -= 1;
      const i = this.ub();
      if (i === 0)
        break;
      n += String.fromCharCode(i);
    }
    return s !== 0 && this.skip(s), n;
  }
  arr(t, s) {
    let n = t;
    s.bind(this);
    const i = [];
    for (; n-- > 0; )
      i.push(s());
    return i;
  }
  arrx(t, s, n = 0) {
    let i = t, o;
    switch (s) {
      case 0: {
        o = new Uint8Array(this.data.buffer, this.tell(), i), this.skip(i);
        break;
      }
      case 1: {
        o = new Int8Array(this.data.buffer, this.tell(), i), this.skip(i);
        break;
      }
      case 2:
        o = new Uint16Array(this.data.buffer, this.tell(), i), this.skip(i * 2);
        break;
      case 3:
        o = new Int16Array(this.data.buffer, this.tell(), i), this.skip(i * 2);
        break;
      case 4:
        o = new Uint32Array(this.data.buffer, this.tell(), i), this.skip(i * 4);
        break;
      case 5:
        o = new Int32Array(this.data.buffer, this.tell(), i), this.skip(i * 4);
        break;
      case 6:
        o = new Float32Array(this.data.buffer, this.tell(), i), this.skip(i * 4);
        break;
      case 7:
        o = new Float64Array(this.data.buffer, this.tell(), i), this.skip(i * 8);
        break;
      case 8:
        for (o = []; i-- > 0; )
          o.push(o.nstr(n));
        break;
      case 9:
        for (o = []; i-- > 0; )
          o.push(o.str());
        break;
    }
    return o;
  }
}
class Pt {
  constructor(t, s, n, i) {
    f(this, "name");
    f(this, "width");
    f(this, "height");
    f(this, "data");
    this.name = t, this.width = s, this.height = n, this.data = i;
  }
  static parse(t, s) {
    const n = new fe(t), i = {
      idLength: n.ub(),
      colorMapType: n.ub(),
      imageType: n.ub(),
      colorMap: {
        firstEntryIndex: n.us(),
        length: n.us(),
        size: n.ub()
      },
      image: {
        xOrigin: n.us(),
        yOrigin: n.us(),
        width: n.us(),
        height: n.us(),
        depth: n.ub(),
        descriptor: n.ub()
      }
    };
    if (i.idLength && n.arrx(i.idLength, D.UByte), i.colorMapType)
      throw new Error("Not implemented");
    const o = i.image.width, a = i.image.height, r = o * a;
    let l = new Uint8Array(0);
    if (i.imageType === 2) {
      const u = r * i.image.depth / 8;
      if (l = n.arrx(u, D.UByte), i.image.depth === 24) {
        const c = new Uint8Array(r * 4);
        for (let h = 0; h < a; ++h)
          for (let d = 0; d < o; ++d) {
            const g = (a - 1 - h) * o + d;
            c[g * 4] = l[(h * o + d) * 3 + 2], c[g * 4 + 1] = l[(h * o + d) * 3 + 1], c[g * 4 + 2] = l[(h * o + d) * 3], c[g * 4 + 3] = 255;
          }
        l = c;
      } else if (i.image.depth === 32) {
        const c = new Uint8Array(r * 4);
        for (let h = 0; h < a; ++h)
          for (let d = 0; d < o; ++d) {
            const g = (a - 1 - h) * o + d;
            c[g * 4] = l[(h * o + d) * 4 + 2], c[g * 4 + 1] = l[(h * o + d) * 4 + 1], c[g * 4 + 2] = l[(h * o + d) * 4], c[g * 4 + 3] = 255;
          }
        l = c;
      }
    } else if (i.imageType === 10 && (l = new Uint8Array(r * 4), i.image.depth === 24))
      for (let u = 0; u < a; ++u)
        for (let c = 0; c < o; ) {
          let h = n.ub();
          if (h & 128) {
            h = (h & 127) + 1;
            const d = n.ub(), g = n.ub(), m = n.ub();
            for (; c < o && h; ) {
              const p = (a - 1 - u) * o + c;
              l[p * 4] = m, l[p * 4 + 1] = g, l[p * 4 + 2] = d, l[p * 4 + 3] = 255, ++c, --h;
            }
          } else
            for (h = (h & 127) + 1; c < o && h; ) {
              const d = (a - 1 - u) * o + c;
              l[d * 4 + 2] = n.ub(), l[d * 4 + 1] = n.ub(), l[d * 4] = n.ub(), l[d * 4 + 3] = 255, ++c, --h;
            }
        }
    return new Pt(s, i.image.width, i.image.height, l);
  }
}
function rt(e, t) {
  const s = new Uint8Array(e.length * 4), n = e.length;
  for (let i = 0; i < n; ++i)
    s[i * 4] = t[e[i] * 3], s[i * 4 + 1] = t[e[i] * 3 + 1], s[i * 4 + 2] = t[e[i] * 3 + 2], s[i * 4 + 3] = 255;
  return s;
}
function Se(e, t) {
  const s = new Uint8Array(e.length * 4), n = e.length;
  for (let i = 0; i < n; ++i)
    e[i] === 255 ? s[i * 4 + 3] = 0 : (s[i * 4] = t[e[i] * 3], s[i * 4 + 1] = t[e[i] * 3 + 1], s[i * 4 + 2] = t[e[i] * 3 + 2], s[i * 4 + 3] = 255);
  return s;
}
function ys(e) {
  const t = e.nstr(16), s = e.ui(), n = e.ui();
  e.skip(4 * 4);
  const i = s * n, o = e.arrx(i, D.UByte);
  e.skip(21 * (i / 64)), e.skip(2);
  const a = e.arrx(768, D.UByte), r = t[0] === "{" ? Se(o, a) : rt(o, a);
  return {
    type: "decal",
    name: t,
    width: s,
    height: n,
    data: r
  };
}
const ks = (e, t) => ({
  type: "cache",
  name: t.name
});
function As(e) {
  const t = e.nstr(16), s = e.ui(), n = e.ui();
  e.skip(4 * 4);
  const i = s * n, o = e.arrx(i, D.UByte);
  e.skip(21 * (i / 64)), e.skip(2);
  const a = e.arrx(768, D.UByte), r = t[0] === "{" ? Se(o, a) : rt(o, a);
  return {
    type: "texture",
    name: t,
    width: s,
    height: n,
    data: r
  };
}
function Is(e, t) {
  const s = e.ui() && 256, n = e.ui(), i = e.ui(), o = e.ui(), a = [];
  for (let c = 0; c < 256; ++c) {
    const h = e.us(), d = e.us();
    a.push({
      x: h % s,
      y: Math.floor(h / s) / o * o,
      width: d,
      height: o
    });
  }
  const r = s * n, l = e.arrx(r, D.UByte);
  e.skip(2);
  const u = e.arrx(256 * 3, D.UByte);
  return {
    type: "font",
    name: t.name,
    width: s,
    height: n,
    rowCount: i,
    rowHeight: o,
    glyphs: a,
    data: Se(l, u)
  };
}
const _s = (e, t) => ({
  type: "unknown",
  name: t.name,
  data: e.arrx(t.length, D.UByte)
});
function Ms(e, t) {
  switch (e.seek(t.offset), t.type) {
    case 64:
      return ys(e);
    case 66:
      return ks(e, t);
    case 67:
      return As(e);
    case 70:
      return Is(e, t);
    default:
      return _s(e, t);
  }
}
class Lt {
  constructor(t) {
    f(this, "entries");
    this.entries = t;
  }
  static parse(t) {
    const s = new fe(t);
    if (s.nstr(4) !== "WAD3")
      throw new Error("Invalid WAD file format");
    const i = s.ui(), o = s.ui();
    s.seek(o);
    const a = [];
    for (let l = 0; l < i; ++l) {
      const u = {
        offset: s.ui(),
        diskLength: s.ui(),
        length: s.ui(),
        type: s.b(),
        isCompressed: s.b(),
        name: ""
      };
      s.skip(2), u.name = s.nstr(16), a.push(u);
    }
    const r = a.map((l) => Ms(s, l));
    return new Lt(r);
  }
}
class mt {
  constructor(t) {
    f(this, "name");
    f(this, "chunks");
    f(this, "resources");
    this.name = es(t, ".bsp"), this.chunks = [], this.resources = {
      sounds: [],
      skins: [],
      models: [],
      decals: [],
      custom: [],
      events: []
    };
  }
  setResources(t) {
    for (const s of t)
      switch (s.type) {
        case 0: {
          s.used = !1, this.resources.sounds.push(s);
          break;
        }
        case 1: {
          this.resources.skins.push(s);
          break;
        }
        case 2: {
          this.resources.models.push(s);
          break;
        }
        case 3: {
          this.resources.decals.push(s);
          break;
        }
        case 4: {
          this.resources.custom.push(s);
          break;
        }
        case 5: {
          this.resources.events.push(s);
          break;
        }
      }
  }
  addChunk(t) {
    this.chunks.push(t);
  }
}
class gt {
  constructor(t, s) {
    f(this, "state");
    f(this, "startTime");
    f(this, "timeLength");
    f(this, "data");
    f(this, "reader");
    this.state = t.clone(), this.startTime = s, this.timeLength = 10, this.data = null, this.reader = null;
  }
  setData(t) {
    this.data = new Uint8Array(t.length);
    for (let s = 0; s < t.length; ++s)
      this.data[s] = t[s];
    this.reader = new fe(this.data.buffer);
  }
}
class ot {
  // 速度标量
  constructor(t = null) {
    f(this, "cameraPos");
    f(this, "cameraRot");
    f(this, "entities");
    f(this, "prevCameraPos");
    // 上一帧的位置
    f(this, "prevTime");
    // 上一帧的时间
    f(this, "time");
    // 当前时间
    f(this, "velocity");
    // 速度向量
    f(this, "speed");
    t ? (this.cameraPos = t.cameraPos ? JSON.parse(JSON.stringify(t.cameraPos)) : [0, 0, 0], this.cameraRot = t.cameraRot ? JSON.parse(JSON.stringify(t.cameraRot)) : [0, 0, 0], this.entities = t.entities ? JSON.parse(JSON.stringify(t.entities)) : [], this.prevCameraPos = t.prevCameraPos ? JSON.parse(JSON.stringify(t.prevCameraPos)) : void 0, this.prevTime = t.prevTime || 0, this.time = t.time || 0, this.velocity = t.velocity ? JSON.parse(JSON.stringify(t.velocity)) : void 0, this.speed = t.speed || 0) : (this.cameraPos = [0, 0, 0], this.cameraRot = [0, 0, 0], this.entities = [], this.prevTime = 0, this.time = 0);
  }
  feedFrame(t) {
    switch (t.type) {
      case 0:
      case 1: {
        this.cameraPos[0] = t.camera.position[0], this.cameraPos[1] = t.camera.position[1], this.cameraPos[2] = t.camera.position[2], this.cameraRot[0] = t.camera.orientation[0], this.cameraRot[1] = t.camera.orientation[1], this.cameraRot[2] = t.camera.orientation[2], this.time = t.time;
        break;
      }
    }
  }
  clone() {
    return new ot(this);
  }
}
function pt(e) {
  const t = e.readBits(1), s = e.readBits(1);
  if (!t && !s)
    return 0;
  const n = e.readBits(1);
  let i = 0, o = 0;
  t && (i = e.readBits(12)), s && (o = e.readBits(3));
  let a = i + o / 32;
  return n && (a = -a), a;
}
var U = /* @__PURE__ */ ((e) => (e[e.DT_BYTE = 1] = "DT_BYTE", e[e.DT_SHORT = 2] = "DT_SHORT", e[e.DT_FLOAT = 4] = "DT_FLOAT", e[e.DT_INTEGER = 8] = "DT_INTEGER", e[e.DT_ANGLE = 16] = "DT_ANGLE", e[e.DT_TIMEWINDOW_8 = 32] = "DT_TIMEWINDOW_8", e[e.DT_TIMEWINDOW_BIG = 64] = "DT_TIMEWINDOW_BIG", e[e.DT_STRING = 128] = "DT_STRING", e[e.DT_SIGNED = -2147483648] = "DT_SIGNED", e))(U || {});
function ee(e, t) {
  const s = {}, n = e.readBits(3), i = [];
  for (let a = 0; a < n; ++a)
    i.push(e.readBits(8));
  let o = !1;
  for (let a = 0; a < n; ++a) {
    for (let r = 0; r < 8; ++r) {
      const l = r + a * 8;
      if (l === t.length) {
        o = !0;
        break;
      }
      if (i[a] & 1 << r)
        if (t[l].flags & U.DT_BYTE)
          if (t[l].flags & U.DT_SIGNED) {
            const u = e.readBits(1) ? -1 : 1, c = e.readBits(t[l].bits - 1), h = t[l].divisor;
            s[t[l].name] = u * c / h;
          } else {
            const u = e.readBits(t[l].bits), c = t[l].divisor;
            s[t[l].name] = u / c;
          }
        else if (t[l].flags & U.DT_SHORT)
          if (t[l].flags & U.DT_SIGNED) {
            const u = e.readBits(1) ? -1 : 1, c = e.readBits(t[l].bits - 1), h = t[l].divisor;
            s[t[l].name] = u * c / h;
          } else {
            const u = e.readBits(t[l].bits), c = t[l].divisor;
            s[t[l].name] = u / c;
          }
        else if (t[l].flags & U.DT_INTEGER)
          if (t[l].flags & U.DT_SIGNED) {
            const u = e.readBits(1) ? -1 : 1, c = e.readBits(t[l].bits - 1), h = t[l].divisor;
            s[t[l].name] = u * c / h;
          } else {
            const u = e.readBits(t[l].bits), c = t[l].divisor;
            s[t[l].name] = u / c;
          }
        else if (t[l].flags & U.DT_FLOAT || t[l].flags & U.DT_TIMEWINDOW_8 || t[l].flags & U.DT_TIMEWINDOW_BIG)
          if (t[l].flags & U.DT_SIGNED) {
            const u = e.readBits(1) ? -1 : 1, c = e.readBits(t[l].bits - 1), h = t[l].divisor;
            s[t[l].name] = u * c / h;
          } else {
            const u = e.readBits(t[l].bits), c = t[l].divisor;
            s[t[l].name] = u / c;
          }
        else if (t[l].flags & U.DT_ANGLE) {
          const u = e.readBits(t[l].bits), c = 360 / (1 << t[l].bits);
          s[t[l].name] = u * c;
        } else t[l].flags & U.DT_STRING && (s[t[l].name] = e.readString());
    }
    if (o)
      break;
  }
  return s;
}
const Rs = {
  delta_description_t: [
    {
      name: "flags",
      bits: 32,
      divisor: 1,
      flags: U.DT_INTEGER
    },
    {
      name: "name",
      bits: 8,
      divisor: 1,
      flags: U.DT_STRING
    },
    {
      name: "offset",
      bits: 16,
      divisor: 1,
      flags: U.DT_INTEGER
    },
    {
      name: "size",
      bits: 8,
      divisor: 1,
      flags: U.DT_INTEGER
    },
    {
      name: "bits",
      bits: 8,
      divisor: 1,
      flags: U.DT_INTEGER
    },
    {
      name: "divisor",
      bits: 32,
      divisor: 4e3,
      flags: U.DT_FLOAT
    },
    {
      name: "preMultiplier",
      bits: 32,
      divisor: 4e3,
      flags: U.DT_FLOAT
    }
  ]
}, Ht = () => ({ ...Rs }), ue = class ue {
  constructor(t) {
    f(this, "view");
    this.view = new Uint8Array(t, 0, t.byteLength);
  }
  getBits(t, s, n = !1) {
    let i = t;
    const o = this.view.length * 8 - i;
    if (s > o)
      throw new Error("Bits out of bounds");
    let a = 0;
    for (let r = 0; r < s; ) {
      const l = s - r, u = i & 7, c = this.view[i >> 3], h = Math.min(l, 8 - u), d = (1 << h) - 1, g = c >> u & d;
      a |= g << r, i += h, r += h;
    }
    return n ? (s !== 32 && a & 1 << s - 1 && (a |= -1 ^ (1 << s) - 1), a) : a >>> 0;
  }
  getInt8(t) {
    return this.getBits(t, 8, !0);
  }
  getUint8(t) {
    return this.getBits(t, 8, !1);
  }
  getInt16(t) {
    return this.getBits(t, 16, !0);
  }
  getUint16(t) {
    return this.getBits(t, 16, !1);
  }
  getInt32(t) {
    return this.getBits(t, 32, !0);
  }
  getUint32(t) {
    return this.getBits(t, 32, !1);
  }
  getFloat32(t) {
    return ue.scratch.setUint32(0, this.getUint32(t)), ue.scratch.getFloat32(0);
  }
  getFloat64(t) {
    return ue.scratch.setUint32(0, this.getUint32(t)), ue.scratch.setUint32(4, this.getUint32(t + 32)), ue.scratch.getFloat64(0);
  }
};
f(ue, "scratch", new DataView(new ArrayBuffer(8)));
let vt = ue;
class Q {
  constructor(t) {
    f(this, "view");
    f(this, "index");
    this.view = new vt(t), this.index = 0;
  }
  readBits(t, s = !1) {
    const n = this.view.getBits(this.index, t, s);
    return this.index += t, n;
  }
  readInt8() {
    const t = this.view.getInt8(this.index);
    return this.index += 8, t;
  }
  readUint8() {
    const t = this.view.getUint8(this.index);
    return this.index += 8, t;
  }
  readInt16() {
    const t = this.view.getInt16(this.index);
    return this.index += 16, t;
  }
  readUint16() {
    const t = this.view.getUint16(this.index);
    return this.index += 16, t;
  }
  readInt32() {
    const t = this.view.getInt32(this.index);
    return this.index += 32, t;
  }
  readUint32() {
    const t = this.view.getUint32(this.index);
    return this.index += 32, t;
  }
  readFloat32() {
    const t = this.view.getFloat32(this.index);
    return this.index += 32, t;
  }
  readFloat64() {
    const t = this.view.getFloat64(this.index);
    return this.index += 64, t;
  }
  readString(t = 0, s = !1) {
    let n = 0;
    const i = [];
    let o = !0;
    for (; !t || t && n < t; ) {
      const r = this.readUint8();
      if (r === 0 && (o = !1, !t))
        break;
      o && i.push(r), n++;
    }
    const a = String.fromCharCode.apply(null, i);
    if (s)
      try {
        return decodeURIComponent(a);
      } catch {
        return a;
      }
    else
      return a;
  }
}
const T = {
  bad() {
    throw new Error("Invalid message type");
  },
  nop() {
    return null;
  },
  disconnect(e) {
    return {
      reason: e.str()
    };
  },
  event(e, t) {
    const s = new Q(e.data.buffer);
    s.index = e.tell() * 8;
    const n = [], i = s.readBits(5);
    for (let o = 0; o < i; ++o) {
      const a = {
        index: s.readBits(10)
      };
      s.readBits(1) && (a.packetIndex = s.readBits(11), s.readBits(1) && (a.delta = ee(s, t.event_t))), s.readBits(1) && (a.fireTime = s.readBits(16)), n.push(a);
    }
    return s.index % 8 > 0 ? e.seek(Math.floor(s.index / 8) + 1) : e.seek(s.index / 8), { events: n };
  },
  version(e) {
    return {
      version: e.ui()
    };
  },
  setView(e) {
    return {
      entityIndex: e.s()
    };
  },
  sound(e) {
    const t = new Q(e.data.buffer);
    t.index = e.tell() * 8;
    const s = t.readBits(9);
    let n = 1;
    s & 1 && (n = t.readBits(8) / 255);
    let i = 1;
    s & 2 && (i = t.readBits(8) / 64);
    const o = t.readBits(3), a = t.readBits(11);
    let r;
    s & 4 ? r = t.readBits(16) : r = t.readBits(8);
    const l = t.readBits(1), u = t.readBits(1), c = t.readBits(1);
    let h = 0, d = 0, g = 0;
    l && (h = pt(t)), u && (d = pt(t)), c && (g = pt(t));
    let m = 1;
    return s & 8 && (m = t.readBits(8)), t.index % 8 > 0 ? e.seek(Math.floor(t.index / 8) + 1) : e.seek(t.index / 8), {
      flags: s,
      volume: n,
      attenuation: i,
      channel: o,
      entityIndex: a,
      soundIndex: r,
      xPosition: h,
      yPosition: d,
      zPosition: g,
      pitch: m
    };
  },
  time(e) {
    return {
      time: e.f()
    };
  },
  print(e) {
    return {
      message: e.str()
    };
  },
  stuffText(e) {
    return { commands: e.str().split(";").map((n) => {
      const i = n.split(/\s*("[^"]+"|[^\s"]+)/).map((r) => r.replace(/^"(.*)"$/, "$1").trim()).filter((r) => r), o = i[0], a = i.slice(1);
      return { func: o, params: a };
    }) };
  },
  setAngle(e) {
    return {
      pitch: e.s(),
      yaw: e.s(),
      roll: e.s()
    };
  },
  serverInfo(e) {
    const t = {
      protocol: e.i(),
      spawnCount: e.i(),
      // map change count
      mapCrc: e.i(),
      clientDllHash: e.arrx(16, D.UByte),
      maxPlayers: e.ub(),
      playerIndex: e.ub(),
      isDeathmatch: e.ub(),
      gameDir: e.str(),
      hostName: e.str(),
      mapFileName: e.str(),
      // path to map relative in mod directory
      mapCycle: e.str()
    };
    return e.skip(1), t;
  },
  lightStyle(e) {
    return {
      index: e.ub(),
      lightInfo: e.str()
    };
  },
  updateUserInfo(e) {
    return {
      clientIndex: e.ub(),
      clientUserId: e.ui(),
      clientUserInfo: e.str(),
      clientCdKeyHash: e.arrx(16, D.UByte)
    };
  },
  deltaDescription(e, t) {
    const s = {
      name: e.str(),
      fields: []
    }, n = new Q(e.data.buffer), i = e.us();
    n.index = e.tell() * 8;
    for (let o = 0; o < i; ++o)
      s.fields.push(ee(n, t.delta_description_t));
    return t[s.name] = s.fields, n.index % 8 > 0 ? e.seek(Math.floor(n.index / 8) + 1) : e.seek(n.index / 8), s;
  },
  clientData(e, t) {
    const s = new Q(e.data.buffer);
    s.index = e.tell() * 8, s.readBits(1) && (s.index += 8);
    const i = t.clientdata_t, o = ee(s, i), a = t.weapon_data_t;
    for (; s.readBits(1); )
      s.index += 6, ee(s, a);
    return s.index % 8 > 0 ? e.seek(Math.floor(s.index / 8) + 1) : e.seek(s.index / 8), {
      clientData: o
    };
  },
  stopSound(e) {
    return {
      entityIndex: e.s()
    };
  },
  pings(e) {
    const t = new Q(e.data.buffer);
    t.index = e.tell() * 8;
    const s = [];
    for (; t.readBits(1); )
      s.push({
        slot: t.readBits(8),
        ping: t.readBits(8),
        loss: t.readBits(8)
      });
    return t.index % 8 > 0 ? e.seek(Math.floor(t.index / 8) + 1) : e.seek(t.index / 8), s;
  },
  particle(e) {
    return {
      position: [e.s() / 8, e.s() / 8, e.s() / 8],
      direction: [e.b(), e.b(), e.b()],
      count: e.ub(),
      color: e.ub()
    };
  },
  damage() {
    return null;
  },
  spawnStatic(e) {
    const t = {
      modelIndex: e.s(),
      sequence: e.b(),
      frame: e.b(),
      colorMap: e.s(),
      skin: e.b(),
      position: [],
      rotation: []
    };
    return t.position[0] = e.s() / 8, t.rotation[0] = e.b() * (360 / 256), t.position[1] = e.s() / 8, t.rotation[1] = e.b() * (360 / 256), t.position[2] = e.s() / 8, t.rotation[2] = e.b() * (360 / 256), t.renderMode = e.b(), t.renderMode && (t.renderAmt = e.b(), t.renderColor = [e.ub(), e.ub(), e.ub()], t.renderFx = e.b()), t;
  },
  eventReliable(e, t) {
    const s = new Q(e.data.buffer);
    s.index = e.tell() * 8;
    const n = s.readBits(10), i = ee(s, t.event_t), o = s.readBits(1);
    let a = 0;
    return o && (a = s.readBits(16)), s.index % 8 > 0 ? e.seek(Math.floor(s.index / 8) + 1) : e.seek(s.index / 8), {
      eventIndex: n,
      eventData: i,
      delayBit: o,
      delay: a
    };
  },
  spawnBaseLine(e, t) {
    const s = new Q(e.data.buffer);
    s.index = e.tell() * 8;
    const n = [];
    for (; ; ) {
      const r = s.readBits(11);
      if (r === 2047)
        break;
      const l = s.readBits(2);
      let u;
      l & 1 ? r > 0 && r <= 32 ? u = "entity_state_player_t" : u = "entity_state_t" : u = "custom_entity_state_t", n[r] = ee(s, t[u]);
    }
    if (s.readBits(5) !== 31)
      throw new Error("Bad spawnbaseline");
    const o = s.readBits(6), a = [];
    for (let r = 0; r < o; ++r)
      a.push(ee(s, t.entity_state_t));
    return s.index % 8 > 0 ? e.seek(Math.floor(s.index / 8) + 1) : e.seek(s.index / 8), {
      entities: n,
      extraData: a
    };
  },
  tempEntity(e) {
    const vs = e.ub(), z = {};
    switch (vs) {
      case 0: {
        e.skip(24);
        break;
      }
      case 1: {
        e.skip(20);
        break;
      }
      case 2: {
        e.skip(6);
        break;
      }
      case 3: {
        e.skip(11);
        break;
      }
      case 4: {
        e.skip(6);
        break;
      }
      case 5: {
        e.skip(10);
        break;
      }
      case 6: {
        e.skip(12);
        break;
      }
      case 7: {
        e.skip(17);
        break;
      }
      case 8: {
        e.skip(16);
        break;
      }
      case 9: {
        e.skip(6);
        break;
      }
      case 10: {
        e.skip(6);
        break;
      }
      case 11: {
        e.skip(6);
        break;
      }
      case 12: {
        e.skip(8);
        break;
      }
      case 13: {
        e.skip(8), e.s() && e.skip(2);
        break;
      }
      case 14: {
        e.skip(9);
        break;
      }
      case 15: {
        e.skip(19);
        break;
      }
      case 17: {
        e.skip(10);
        break;
      }
      case 18: {
        e.skip(16);
        break;
      }
      case 19: {
        e.skip(24);
        break;
      }
      case 20: {
        e.skip(24);
        break;
      }
      case 21: {
        e.skip(24);
        break;
      }
      case 22: {
        e.skip(10);
        break;
      }
      case 23: {
        e.skip(11);
        break;
      }
      case 24: {
        e.skip(16);
        break;
      }
      case 25: {
        e.skip(19);
        break;
      }
      case 27: {
        e.skip(12);
        break;
      }
      case 28: {
        e.skip(16);
        break;
      }
      case 29: {
        z.channel = e.b(), z.x = e.s(), z.y = e.s(), z.effect = e.b(), z.textColor = [e.ub(), e.ub(), e.ub(), e.ub()], z.effectColor = [e.ub(), e.ub(), e.ub(), e.ub()], z.fadeInTime = e.s(), z.fadeOutTime = e.s(), z.holdTime = e.s(), z.effect && (z.effectTime = e.s()), z.message = e.str();
        break;
      }
      case 30: {
        e.skip(17);
        break;
      }
      case 31: {
        e.skip(17);
        break;
      }
      case 99: {
        e.skip(2);
        break;
      }
      case 100: {
        e.skip(10);
        break;
      }
      case 101: {
        e.skip(14);
        break;
      }
      case 102: {
        e.skip(12);
        break;
      }
      case 103: {
        e.skip(14);
        break;
      }
      case 104: {
        e.skip(9);
        break;
      }
      case 105: {
        e.skip(5);
        break;
      }
      case 106: {
        e.skip(17);
        break;
      }
      case 107: {
        e.skip(13);
        break;
      }
      case 108: {
        e.skip(24);
        break;
      }
      case 109: {
        e.skip(9);
        break;
      }
      case 110: {
        e.skip(17);
        break;
      }
      case 111: {
        e.skip(7);
        break;
      }
      case 112: {
        e.skip(10);
        break;
      }
      case 113: {
        e.skip(19);
        break;
      }
      case 114: {
        e.skip(19);
        break;
      }
      case 115: {
        e.skip(12);
        break;
      }
      case 116: {
        e.skip(7);
        break;
      }
      case 117: {
        e.skip(7);
        break;
      }
      case 118: {
        e.skip(9);
        break;
      }
      case 119: {
        e.skip(16);
        break;
      }
      case 120: {
        e.skip(18);
        break;
      }
      case 121: {
        e.skip(5);
        break;
      }
      case 122: {
        e.skip(10);
        break;
      }
      case 123: {
        e.skip(9);
        break;
      }
      case 124: {
        e.skip(7);
        break;
      }
      case 125: {
        e.skip(1);
        break;
      }
      case 126: {
        e.skip(18);
        break;
      }
      case 127: {
        e.skip(15);
        break;
      }
      default:
        throw new Error("Unknown temp entity type");
    }
    return z;
  },
  setPause(e) {
    return {
      isPaused: e.b()
    };
  },
  signOnNum(e) {
    return {
      sign: e.b()
    };
  },
  centerPrint(e) {
    return {
      message: e.str()
    };
  },
  killedMonster() {
    return null;
  },
  foundSecret() {
    return null;
  },
  spawnStaticSound(e) {
    return {
      position: [e.s() / 8, e.s() / 8, e.s() / 8],
      soundIndex: e.us(),
      volume: e.ub() / 255,
      attenuation: e.ub() / 64,
      entityIndex: e.us(),
      pitch: e.ub(),
      flags: e.ub()
    };
  },
  intermission() {
    return null;
  },
  finale(e) {
    return {
      text: e.str()
    };
  },
  cdTrack(e) {
    return {
      track: e.b(),
      loopTrack: e.b()
    };
  },
  restore(e) {
    const t = e.str(), s = e.ub(), n = [];
    for (let i = 0; i < s; ++i)
      n.push(e.str());
    return { saveName: t, maps: n };
  },
  cutscene(e) {
    return {
      text: e.str()
    };
  },
  weaponAnim(e) {
    return {
      sequenceNumber: e.b(),
      weaponModelBodyGroup: e.b()
    };
  },
  decalName(e) {
    return {
      positionIndex: e.ub(),
      decalName: e.str()
    };
  },
  roomType(e) {
    return {
      type: e.us()
    };
  },
  addAngle(e) {
    return {
      angleToAdd: e.s() / (360 / 65536)
    };
  },
  newUserMsg(e) {
    return {
      index: e.ub(),
      size: e.b(),
      name: e.nstr(16)
    };
  },
  packetEntities(e, t) {
    const s = new Q(e.data.buffer);
    s.index = e.tell() * 8;
    const n = [];
    s.readBits(16);
    let i = 0;
    for (; s.readBits(16) !== 0; ) {
      s.index -= 16, s.readBits(1) ? i++ : s.readBits(1) ? i = s.readBits(11) : i += s.readBits(6);
      const r = s.readBits(1);
      s.readBits(1) && (s.index += 6);
      let u = "entity_state_t";
      i > 0 && i <= 32 ? u = "entity_state_player_t" : r && (u = "custom_entity_state_t"), n.push(ee(s, t[u]));
    }
    return s.index % 8 > 0 ? e.seek(Math.floor(s.index / 8) + 1) : e.seek(s.index / 8), { entityStates: n };
  },
  deltaPacketEntities(e, t) {
    const s = new Q(e.data.buffer);
    s.index = e.tell() * 8, s.readBits(16), s.index += 8;
    const n = [];
    let i = 0;
    for (; s.readBits(16) !== 0; ) {
      s.index -= 16;
      const a = s.readBits(1);
      if (s.readBits(1) ? i = s.readBits(11) : i += s.readBits(6), a)
        continue;
      const l = s.readBits(1);
      let u = "entity_state_t";
      i > 0 && i < 32 ? u = "entity_state_player_t" : l && (u = "custom_entity_state_t"), n[i] = ee(s, t[u]);
    }
    return s.index % 8 > 0 ? e.seek(Math.floor(s.index / 8) + 1) : e.seek(s.index / 8), { entityStates: n };
  },
  choke() {
    return null;
  },
  resourceList(e) {
    const t = new Q(e.data.buffer);
    t.index = e.tell() * 8;
    const s = [], n = t.readBits(12);
    for (let i = 0; i < n; ++i) {
      const o = {
        type: t.readBits(4),
        name: t.readString(),
        index: t.readBits(12),
        size: t.readBits(24)
      };
      t.readBits(3) & 4 && (t.index += 128), t.readBits(1) && (t.index += 256), s.push(o);
    }
    if (t.readBits(1))
      for (; t.readBits(1); ) {
        const i = t.readBits(1) ? 5 : 10;
        t.index += i;
      }
    return t.index % 8 > 0 ? e.seek(Math.floor(t.index / 8) + 1) : e.seek(t.index / 8), s;
  },
  newMoveVars(e) {
    return {
      gravity: e.f(),
      stopSpeed: e.f(),
      maxSpeed: e.f(),
      spectatorMaxSpeed: e.f(),
      acceleration: e.f(),
      airAcceleration: e.f(),
      waterAcceleration: e.f(),
      friction: e.f(),
      edgeFriction: e.f(),
      waterFriction: e.f(),
      entityGravity: e.f(),
      bounce: e.f(),
      stepSize: e.f(),
      maxVelocity: e.f(),
      zMax: e.f(),
      waveHeight: e.f(),
      footsteps: e.b(),
      rollAngle: e.f(),
      rollSpeed: e.f(),
      skyColor: [e.f(), e.f(), e.f()],
      skyVec: [e.f(), e.f(), e.f()],
      skyName: e.str()
    };
  },
  resourceRequest(e) {
    const t = {
      spawnCount: e.i()
    };
    return e.skip(4), t;
  },
  customization(e) {
    const t = e.ub(), s = e.ub(), n = e.str(), i = e.us(), o = e.ui(), a = e.ub();
    let r = null;
    return a & 4 && (r = [e.i(), e.i(), e.i(), e.i()]), {
      playerIndex: t,
      type: s,
      name: n,
      index: i,
      downloadSize: o,
      flags: a,
      md5hash: r
    };
  },
  crosshairAngle(e) {
    return {
      pitch: e.b(),
      yaw: e.b()
    };
  },
  soundFade(e) {
    return {
      initialPercent: e.ub(),
      holdTime: e.ub(),
      fadeOutTime: e.ub(),
      fadeInTime: e.ub()
    };
  },
  fileTxferFailed(e) {
    return {
      filename: e.str()
    };
  },
  hltv(e) {
    return {
      mode: e.ub()
    };
  },
  director(e) {
    const t = e.ub();
    return {
      flag: e.ub(),
      message: e.nstr(t - 1)
    };
  },
  voiceInit(e) {
    return {
      codecName: e.str(),
      quality: e.b()
    };
  },
  voiceData(e) {
    const t = e.ub(), s = e.us(), n = e.arrx(s, D.UByte);
    return { playerIndex: t, data: n };
  },
  sendExtraInfo(e) {
    return {
      fallbackDir: e.str(),
      canCheat: e.ub()
    };
  },
  timeScale(e) {
    return {
      timeScale: e.f()
    };
  },
  resourceLocation(e) {
    return {
      url: e.str()
    };
  },
  sendCvarValue(e) {
    return {
      name: e.str()
    };
  },
  sendCvarValue2(e) {
    return {
      requestId: e.ui(),
      name: e.str()
    };
  }
}, Ps = [
  T.bad,
  // SVC_BAD                      0
  T.nop,
  // SVC_NOP                      1
  T.disconnect,
  // SVC_DISCONNECT               2
  T.event,
  // SVC_EVENT                    3
  T.version,
  // SVC_VERSION                  4
  T.setView,
  // SVC_SETVIEW                  5
  T.sound,
  // SVC_SOUND                    6
  T.time,
  // SVC_TIME                     7
  T.print,
  // SVC_PRINT                    8
  T.stuffText,
  // SVC_STUFFTEXT                9
  T.setAngle,
  // SVC_SETANGLE                10
  T.serverInfo,
  // SVC_SERVERINFO              11
  T.lightStyle,
  // SVC_LIGHTSTYLE              12
  T.updateUserInfo,
  // SVC_UPDATEUSERINFO          13
  T.deltaDescription,
  // SVC_DELTADESCRIPTION        14
  T.clientData,
  // SVC_CLIENTDATA              15
  T.stopSound,
  // SVC_STOPSOUND               16
  T.pings,
  // SVC_PINGS                   17
  T.particle,
  // SVC_PARTICLE                18
  T.damage,
  // SVC_DAMAGE                  19
  T.spawnStatic,
  // SVC_SPAWN            20
  T.eventReliable,
  // SVC_EVENT_RELIABLE          21
  T.spawnBaseLine,
  // SVC_SPAWNBASELINE           22
  T.tempEntity,
  // SVC_TEMPENTITY              23
  T.setPause,
  // SVC_SETPAUSE                24
  T.signOnNum,
  // SVC_SIGNONNUM               25
  T.centerPrint,
  // SVC_CENTERPRINT             26
  T.killedMonster,
  // SVC_KILLEDMONSTER           27
  T.foundSecret,
  // SVC_FOUNDSECRET             28
  T.spawnStaticSound,
  // SVC_SPAWNSTATICSOUND        29
  T.intermission,
  // SVC_INTERMISSION            30
  T.finale,
  // SVC_FINALE                  31
  T.cdTrack,
  // SVC_CDTRACK                 32
  T.restore,
  // SVC_RESTORE                 33
  T.cutscene,
  // SVC_CUTSCENE                34
  T.weaponAnim,
  // SVC_WEAPONANIM              35
  T.decalName,
  // SVC_DECALNAME               36
  T.roomType,
  // SVC_ROOMTYPE                37
  T.addAngle,
  // SVC_ADDANGLE                38
  T.newUserMsg,
  // SVC_NEWUSERMSG              39
  T.packetEntities,
  // SVC_PACKETENTITIES          40
  T.deltaPacketEntities,
  // SVC_DELTAPACKETENTITIES     41
  T.choke,
  // SVC_CHOKE                   42
  T.resourceList,
  // SVC_RESOURCELIST            43
  T.newMoveVars,
  // SVC_NEWMOVEVARS             44
  T.resourceRequest,
  // SVC_RESOURCEREQUEST         45
  T.customization,
  // SVC_CUSTOMIZATION           46
  T.crosshairAngle,
  // SVC_CROSSHAIRANGLE          47
  T.soundFade,
  // SVC_SOUNDFADE               48
  T.fileTxferFailed,
  // SVC_FILETXFERFAILED         49
  T.hltv,
  // SVC_HLTV                    50
  T.director,
  // SVC_DIRECTOR                51
  T.voiceInit,
  // SVC_VOICEINIT               52
  T.voiceData,
  // SVC_VOICEDATA               53
  T.sendExtraInfo,
  // SVC_SENDEXTRAINFO           54
  T.timeScale,
  // SVC_TIMESCALE               55
  T.resourceLocation,
  // SVC_RESOURCELOCATION        56
  T.sendCvarValue,
  // SVC_SENDCVARVALUE           57
  T.sendCvarValue2
  // SVC_SENDCVARVALUE2          58
];
function ts(e, t, s) {
  if (t === 0)
    return null;
  const n = Ps[t];
  return n ? n(e, s) : null;
}
var le = /* @__PURE__ */ ((e) => (e[e.BAD = 0] = "BAD", e[e.NOP = 1] = "NOP", e[e.DISCONNECT = 2] = "DISCONNECT", e[e.EVENT = 3] = "EVENT", e[e.VERSION = 4] = "VERSION", e[e.SETVIEW = 5] = "SETVIEW", e[e.SOUND = 6] = "SOUND", e[e.TIME = 7] = "TIME", e[e.PRINT = 8] = "PRINT", e[e.STUFFTEXT = 9] = "STUFFTEXT", e[e.SETANGLE = 10] = "SETANGLE", e[e.SERVERINFO = 11] = "SERVERINFO", e[e.LIGHTSTYLE = 12] = "LIGHTSTYLE", e[e.UPDATEUSERINFO = 13] = "UPDATEUSERINFO", e[e.DELTADESCRIPTION = 14] = "DELTADESCRIPTION", e[e.CLIENTDATA = 15] = "CLIENTDATA", e[e.STOPSOUND = 16] = "STOPSOUND", e[e.PINGS = 17] = "PINGS", e[e.PARTICLE = 18] = "PARTICLE", e[e.DAMAGE = 19] = "DAMAGE", e[e.SPAWN = 20] = "SPAWN", e[e.EVENT_RELIABLE = 21] = "EVENT_RELIABLE", e[e.SPAWNBASELINE = 22] = "SPAWNBASELINE", e[e.TEMPENTITY = 23] = "TEMPENTITY", e[e.SETPAUSE = 24] = "SETPAUSE", e[e.SIGNONNUM = 25] = "SIGNONNUM", e[e.CENTERPRINT = 26] = "CENTERPRINT", e[e.KILLEDMONSTER = 27] = "KILLEDMONSTER", e[e.FOUNDSECRET = 28] = "FOUNDSECRET", e[e.SPAWNSTATICSOUND = 29] = "SPAWNSTATICSOUND", e[e.INTERMISSION = 30] = "INTERMISSION", e[e.FINALE = 31] = "FINALE", e[e.CDTRACK = 32] = "CDTRACK", e[e.RESTORE = 33] = "RESTORE", e[e.CUTSCENE = 34] = "CUTSCENE", e[e.WEAPONANIM = 35] = "WEAPONANIM", e[e.DECALNAME = 36] = "DECALNAME", e[e.ROOMTYPE = 37] = "ROOMTYPE", e[e.ADDANGLE = 38] = "ADDANGLE", e[e.NEWUSERMSG = 39] = "NEWUSERMSG", e[e.PACKETENTITIES = 40] = "PACKETENTITIES", e[e.DELTAPACKETENTITIES = 41] = "DELTAPACKETENTITIES", e[e.CHOKE = 42] = "CHOKE", e[e.RESOURCELIST = 43] = "RESOURCELIST", e[e.NEWMOVEVARS = 44] = "NEWMOVEVARS", e[e.RESOURCEREQUEST = 45] = "RESOURCEREQUEST", e[e.CUSTOMIZATION = 46] = "CUSTOMIZATION", e[e.CROSSHAIRANGLE = 47] = "CROSSHAIRANGLE", e[e.SOUNDFADE = 48] = "SOUNDFADE", e[e.FILETXFERFAILED = 49] = "FILETXFERFAILED", e[e.HLTV = 50] = "HLTV", e[e.DIRECTOR = 51] = "DIRECTOR", e[e.VOICEINIT = 52] = "VOICEINIT", e[e.VOICEDATA = 53] = "VOICEDATA", e[e.SENDEXTRAINFO = 54] = "SENDEXTRAINFO", e[e.TIMESCALE = 55] = "TIMESCALE", e[e.RESOURCELOCATION = 56] = "RESOURCELOCATION", e[e.SENDCVARVALUE = 57] = "SENDCVARVALUE", e[e.SENDCVARVALUE2 = 58] = "SENDCVARVALUE2", e))(le || {});
const Ls = (e) => e.nstr(8) === "HLDEMO", Wt = (e) => ({
  demoProtocol: e.ui(),
  netProtocol: e.ui(),
  mapName: e.nstr(260),
  modName: e.nstr(260),
  mapCrc: e.i(),
  dirOffset: e.ui()
}), jt = (e, t) => {
  e.seek(t);
  const s = e.ui(), n = [];
  for (let i = 0; i < s; ++i)
    n.push({
      id: e.ui(),
      name: e.nstr(64),
      flags: e.ui(),
      cdTrack: e.i(),
      time: e.f(),
      frames: e.ui(),
      offset: e.ui(),
      length: e.ui()
    });
  return n;
}, Ss = (e, t, s) => {
  const n = e.ui(), i = e.tell() + n, o = [];
  for (; e.tell() < i; ) {
    const a = e.ub();
    if (a === 1)
      continue;
    if (a >= 64) {
      s[a] && s[a].size > -1 ? e.skip(s[a].size) : e.skip(e.ub());
      continue;
    }
    const r = ts(e, a, t);
    r ? (a === 39 && (s[r.index] = r), o.push({
      type: a,
      data: r
    })) : e.seek(i);
  }
  return e.seek(i), o;
}, Ge = (e, t, s) => {
  const n = {
    type: e.ub(),
    time: e.f(),
    tick: e.ui()
  };
  switch (n.type) {
    case 0:
    case 1: {
      e.skip(4), n.camera = {
        position: [e.f(), e.f(), e.f()],
        orientation: [e.f(), e.f(), e.f()]
      }, e.skip(436), n.data = Ss(e, t, s);
      break;
    }
    case 2:
      break;
    case 3: {
      n.command = e.nstr(64);
      break;
    }
    case 4: {
      e.skip(32);
      break;
    }
    case 5:
      break;
    case 6: {
      e.skip(84);
      break;
    }
    case 7: {
      e.skip(8);
      break;
    }
    case 8: {
      n.sound = {
        channel: e.i(),
        sample: e.nstr(e.ui()),
        attenuation: e.f(),
        volume: e.f(),
        flags: e.ui(),
        pitch: e.i()
      };
      break;
    }
    case 9: {
      e.skip(e.ui());
      break;
    }
    default: {
      n.error = !0;
      break;
    }
  }
  return n;
};
class be {
  constructor(t, s) {
    f(this, "header");
    f(this, "mapName");
    f(this, "directories");
    this.header = t, this.mapName = this.header.mapName, this.directories = s;
  }
  static parseFromArrayBuffer(t) {
    const s = new fe(t);
    if (s.nstr(8) !== "HLDEMO")
      throw new Error("Invalid replay format");
    const i = {};
    i.demoProtocol = s.ui(), i.netProtocol = s.ui(), i.mapName = s.nstr(260), i.modName = s.nstr(260), i.mapCrc = s.i(), i.dirOffset = s.ui(), s.seek(i.dirOffset);
    const o = s.ui(), a = [];
    for (let r = 0; r < o; ++r)
      a.push({
        id: s.ui(),
        name: s.nstr(64),
        flags: s.ui(),
        cdTrack: s.i(),
        time: s.f(),
        frames: s.ui(),
        offset: s.ui(),
        length: s.ui(),
        macros: []
      });
    for (let r = 0; r < a.length; ++r) {
      s.seek(a[r].offset);
      let l = !1;
      for (; !l; ) {
        const u = {
          type: s.b(),
          time: s.f(),
          frame: s.ui()
        };
        switch (u.type) {
          case 0:
          case 1: {
            s.skip(4), u.camera = {
              position: [s.f(), s.f(), s.f()],
              orientation: [s.f(), s.f(), s.f()]
            }, s.skip(436), s.skip(s.ui());
            break;
          }
          case 2:
            break;
          case 3: {
            u.command = s.nstr(64);
            break;
          }
          case 4: {
            s.skip(32);
            break;
          }
          case 5: {
            l = !0;
            break;
          }
          case 6: {
            s.skip(84);
            break;
          }
          case 7: {
            s.skip(8);
            break;
          }
          case 8: {
            s.skip(4), s.skip(s.ui() + 16);
            break;
          }
          case 9: {
            s.skip(s.ui());
            break;
          }
          default: {
            const c = Number(s.tell() - 9).toString(16), h = [`Unexpected macro (${u.type})`, ` at offset = ${c}.`].join("");
            throw new Error(h);
          }
        }
        a[r].macros.push(u);
      }
    }
    return new be(i, a);
  }
  static parseFullFromArrayBuffer(t) {
    const s = new fe(t);
    if (s.nstr(8) !== "HLDEMO")
      throw new Error("Invalid replay format");
    const i = {};
    i.demoProtocol = s.ui(), i.netProtocol = s.ui(), i.mapName = s.nstr(260), i.modName = s.nstr(260), i.mapCrc = s.i(), i.dirOffset = s.ui(), s.seek(i.dirOffset);
    const o = s.ui(), a = [];
    for (let u = 0; u < o; ++u)
      a.push({
        id: s.ui(),
        name: s.nstr(64),
        flags: s.ui(),
        cdTrack: s.i(),
        time: s.f(),
        frames: s.ui(),
        offset: s.ui(),
        length: s.ui(),
        macros: []
      });
    const r = Ht(), l = [];
    for (let u = 0; u < a.length; ++u) {
      s.seek(a[u].offset);
      let c = !1;
      for (; !c; ) {
        const h = {
          type: s.b(),
          time: s.f(),
          frame: s.ui()
        };
        switch (h.type) {
          case 0:
          case 1: {
            s.skip(4), h.camera = {
              position: [s.f(), s.f(), s.f()],
              orientation: [s.f(), s.f(), s.f()],
              forward: [s.f(), s.f(), s.f()],
              right: [s.f(), s.f(), s.f()],
              up: [s.f(), s.f(), s.f()]
            }, h.RefParams = {
              frametime: s.f(),
              time: s.f(),
              intermission: s.i(),
              paused: s.i(),
              spectator: s.i(),
              onground: s.i(),
              waterlevel: s.i(),
              velocity: [s.f(), s.f(), s.f()],
              origin: [s.f(), s.f(), s.f()],
              viewHeight: [s.f(), s.f(), s.f()],
              idealPitch: s.f(),
              viewAngles: [s.f(), s.f(), s.f()],
              health: s.i(),
              crosshairAngle: [s.f(), s.f(), s.f()],
              viewSize: s.f(),
              punchAngle: [s.f(), s.f(), s.f()],
              maxClients: s.i(),
              viewEntity: s.i(),
              playerCount: s.i(),
              maxEntities: s.i(),
              demoPlayback: s.i(),
              hardware: s.i(),
              smoothing: s.i(),
              ptr_cmd: s.i(),
              ptr_movevars: s.i(),
              viewport: [s.i(), s.i(), s.i(), s.i()],
              nextView: s.i(),
              onlyClientDraw: s.i()
            }, h.UserCmd = {
              lerp_msec: s.s(),
              msec: s.ub(),
              UNUSED1: s.ub(),
              viewAngles: [s.f(), s.f(), s.f()],
              forwardMove: s.f(),
              sideMove: s.f(),
              upMove: s.f(),
              lightLevel: s.b(),
              UNUSED2: s.ub(),
              buttons: s.us(),
              impulse: s.b(),
              weaponSelect: s.b(),
              UNUSED: s.s(),
              impactIndex: s.i(),
              impactPosition: [s.f(), s.f(), s.f()]
            }, h.MoveVars = {
              gravity: s.f(),
              stopSpeed: s.f(),
              maxSpeed: s.f(),
              spectatorMaxSpeed: s.f(),
              acceleration: s.f(),
              airAcceleration: s.f(),
              waterAcceleration: s.f(),
              friction: s.f(),
              edgeFriction: s.f(),
              waterFriction: s.f(),
              entityGravity: s.f(),
              bounce: s.f(),
              stepSize: s.f(),
              maxVelocity: s.f(),
              zMax: s.f(),
              waveHeight: s.f(),
              footsteps: s.i(),
              skyName: s.nstr(32),
              rollAngle: s.f(),
              rollSpeed: s.f(),
              skyColor: [s.f(), s.f(), s.f()],
              skyVec: [s.f(), s.f(), s.f()]
            }, h.view = [s.f(), s.f(), s.f()], h.viewModel = s.i(), h.incoming_sequence = s.i(), h.incoming_acknowledged = s.i(), h.incoming_reliable_acknowledged = s.i(), h.incoming_reliable_sequence = s.i(), h.outgoing_sequence = s.i(), h.reliable_sequence = s.i(), h.last_reliable_sequence = s.i();
            const g = s.ui() + s.tell();
            for (h.frameData = []; s.tell() < g; ) {
              const m = s.ub();
              if (m === 1)
                continue;
              if (m >= 64) {
                l[m] && l[m].size > -1 ? s.skip(l[m].size) : s.skip(s.ub());
                continue;
              }
              const p = ts(s, m, r);
              p ? (m === 39 && (l[p.index] = p), h.frameData.push({ type: m, frameData: p })) : s.seek(g);
            }
            s.seek(g);
            break;
          }
          case 2:
            break;
          case 3: {
            h.command = s.nstr(64);
            break;
          }
          case 4: {
            h.clientData = {
              position: [s.f(), s.f(), s.f()],
              rotation: [s.f(), s.f(), s.f()],
              weaponFlags: s.ui(),
              fov: s.f()
            };
            break;
          }
          case 5: {
            c = !0;
            break;
          }
          case 6: {
            h.event = {
              flags: s.ui(),
              index: s.ui(),
              delay: s.f(),
              args: {
                flags: s.ui(),
                entityIndex: s.ui(),
                position: [s.f(), s.f(), s.f()],
                rotation: [s.f(), s.f(), s.f()],
                velocity: [s.f(), s.f(), s.f()],
                ducking: s.ui(),
                fparam1: s.f(),
                fparam2: s.f(),
                iparam1: s.i(),
                iparam2: s.i(),
                bparam1: s.i(),
                bparam2: s.i()
              }
            };
            break;
          }
          case 7: {
            h.weaponAnimation = {
              animation: s.i(),
              body: s.i()
            };
            break;
          }
          case 8: {
            h.sound = {
              channel: s.i(),
              sample: s.nstr(s.ui()),
              attenuation: s.f(),
              volume: s.f(),
              flags: s.ui(),
              pitch: s.i()
            };
            break;
          }
          case 9: {
            s.skip(s.ui());
            break;
          }
          default: {
            const d = Number(s.tell() - 9).toString(16), g = `Unexpected macro (${h.type}) at offset = ${d}`;
            throw new Error(g);
          }
        }
        a[u].macros.push(h);
      }
    }
    return new be(i, a);
  }
  static parseIntoChunks(t) {
    const s = new fe(t);
    if (!Ls(s))
      throw new Error("Invalid replay file format");
    const n = [], i = Ht(), o = [], a = Wt(s), r = jt(s, a.dirOffset);
    let l, u, c, h;
    const d = new ot();
    let g = r[0].offset + r[0].length;
    for (s.seek(r[0].offset); s.tell() < g; ) {
      const m = Ge(s, i, o);
      if (d.feedFrame(m), m.error)
        throw new Error("Encountered error while reading replay");
      if (m.type < 2) {
        const p = m.data.find((v) => v.type === le.SERVERINFO);
        p && (l = new mt(p.data.mapFileName), n.push(l));
        const E = m.data.find((v) => v.type === le.RESOURCELIST);
        E && l && l.setResources(E.data);
      }
    }
    if (!(l instanceof mt))
      throw new Error("Error while parsing replay.");
    for (h = s.tell(), u = new gt(d, 0), l.addChunk(u), g = r[1].offset + r[1].length, s.seek(r[1].offset); ; ) {
      const m = s.tell();
      if (m >= g) {
        const E = c.time - u.startTime;
        u.timeLength = E;
        const v = m - h;
        s.seek(h), u.setData(s.arrx(v, D.UByte)), s.seek(m);
        break;
      }
      const p = Ge(s, i, o);
      if (d.feedFrame(p), c = p, p.error)
        throw new Error("Encountered error while reading replay");
      if (p.type < 2) {
        const E = p.data.find((y) => y.type === le.SERVERINFO);
        if (E) {
          l = new mt(E.data.mapFileName), n.push(l);
          const y = c.time - u.startTime;
          u.timeLength = y;
          const w = m - h, x = s.tell();
          s.seek(h), u.setData(s.arrx(w, D.UByte)), s.seek(x), h = m, u = new gt(d, p.time), l.addChunk(u);
        }
        const v = p.data.find((y) => y.type === le.RESOURCELIST);
        if (v && l.setResources(v.data), E)
          continue;
        for (let y = 0; y < p.data.length; ++y) {
          const w = p.data[y];
          if (w.type === le.SOUND || w.type === le.SPAWNSTATICSOUND) {
            const x = l.resources.sounds.find((N) => N.index === w.data.soundIndex);
            x && (x.used = !0);
          } else if (w.type === le.STUFFTEXT) {
            const x = l.resources.sounds, N = w.data.commands;
            for (let F = 0; F < N.length; ++F) {
              const I = N[F], b = I.func;
              if ((b === "speak" || b === "spk") && I.params.length === 1) {
                const k = `${I.params[0]}.wav`, A = x.find((C) => C.name === k);
                A && (A.used = !0);
              }
            }
          }
        }
      } else if (p.type === 8) {
        const E = l.resources.sounds.find((v) => v.name === p.sound.sample);
        E && (E.used = !0);
      }
      if (u.startTime + 10 < p.time) {
        const E = m - h, v = s.tell();
        s.seek(h), u.setData(s.arrx(E, D.UByte)), s.seek(v), h = m, u = new gt(d, p.time), l.addChunk(u);
      }
    }
    return {
      length: r[1].time,
      maps: n,
      deltaDecoders: i,
      customMessages: o
    };
  }
  static readHeader(t) {
    return Wt(t);
  }
  static readDirectories(t, s) {
    return jt(t, s);
  }
  static readFrame(t, s, n) {
    return Ge(t, s, n);
  }
  static readFrameData(t, s, n) {
    return Ge(t, s, n);
  }
}
var J = /* @__PURE__ */ ((e) => (e[e.VP_PARALLEL_UPRIGHT = 0] = "VP_PARALLEL_UPRIGHT", e[e.FACING_UPRIGHT = 1] = "FACING_UPRIGHT", e[e.VP_PARALLEL = 2] = "VP_PARALLEL", e[e.ORIENTED = 3] = "ORIENTED", e[e.VP_PARALLEL_ORIENTED = 4] = "VP_PARALLEL_ORIENTED", e))(J || {});
class St {
  constructor(t, s) {
    f(this, "header");
    f(this, "frames");
    this.header = t, this.frames = s;
  }
  static parse(t) {
    const s = new fe(t);
    if (s.nstr(4) !== "IDSP")
      throw new Error("Invalid sprite file format");
    const i = {
      version: s.i(),
      // must be 2 (1 = Quake, 2 = Half-Life)
      type: s.i(),
      alphaType: s.i(),
      radius: s.f(),
      width: s.i(),
      height: s.i(),
      frameCount: s.i(),
      beamLength: s.f(),
      syncType: s.i()
    }, o = s.s(), a = s.arrx(o * 3, D.UByte), r = [];
    for (let l = 0; l < i.frameCount; ++l) {
      const u = {
        group: s.i(),
        position: [s.i(), s.i()],
        width: s.i(),
        height: s.i(),
        data: new Uint8Array(i.width * i.height * 4)
      }, c = s.arrx(i.width * i.height, D.UByte);
      i.alphaType === 3 ? u.data = Se(c, a) : u.data = rt(c, a), r.push(u);
    }
    return new St(i, r);
  }
}
function Te(e, t) {
  const s = t.method || "GET", n = t.isBinary, i = t.progressCallback;
  if (!e)
    throw new Error("Url parameter missing");
  return new Promise((o, a) => {
    const r = new XMLHttpRequest();
    n && (r.responseType = "arraybuffer"), n && i && r.addEventListener("progress", (l) => {
      if (l.lengthComputable)
        i(r, l.loaded / l.total);
      else {
        const u = r.getResponseHeader("content-length");
        let c = 0;
        u && (c = Number.parseFloat(u));
        const h = r.getResponseHeader("content-encoding");
        if (c && h && h.indexOf("gzip") > -1) {
          c *= 4;
          const d = Math.min(0.99, l.loaded / c);
          i(r, d);
        } else
          i(r, 0);
      }
    }), r.addEventListener("readystatechange", () => {
      r.readyState === 4 && (r.status === 200 ? (i && i(r, 1), o(r.response)) : a({
        status: r.status
      }));
    }), r.open(s, e, !0), r.send();
  });
}
var de = typeof Float32Array < "u" ? Float32Array : Array, Ns = Math.PI / 180;
function je(e) {
  return e * Ns;
}
Math.hypot || (Math.hypot = function() {
  for (var e = 0, t = arguments.length; t--; )
    e += arguments[t] * arguments[t];
  return Math.sqrt(e);
});
function xt() {
  var e = new de(16);
  return de != Float32Array && (e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0), e[0] = 1, e[5] = 1, e[10] = 1, e[15] = 1, e;
}
function xe(e) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
}
function Ie(e, t, s) {
  var n = s[0], i = s[1], o = s[2], a, r, l, u, c, h, d, g, m, p, E, v;
  return t === e ? (e[12] = t[0] * n + t[4] * i + t[8] * o + t[12], e[13] = t[1] * n + t[5] * i + t[9] * o + t[13], e[14] = t[2] * n + t[6] * i + t[10] * o + t[14], e[15] = t[3] * n + t[7] * i + t[11] * o + t[15]) : (a = t[0], r = t[1], l = t[2], u = t[3], c = t[4], h = t[5], d = t[6], g = t[7], m = t[8], p = t[9], E = t[10], v = t[11], e[0] = a, e[1] = r, e[2] = l, e[3] = u, e[4] = c, e[5] = h, e[6] = d, e[7] = g, e[8] = m, e[9] = p, e[10] = E, e[11] = v, e[12] = a * n + c * i + m * o + t[12], e[13] = r * n + h * i + p * o + t[13], e[14] = l * n + d * i + E * o + t[14], e[15] = u * n + g * i + v * o + t[15]), e;
}
function zt(e, t, s) {
  var n = s[0], i = s[1], o = s[2];
  return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * i, e[5] = t[5] * i, e[6] = t[6] * i, e[7] = t[7] * i, e[8] = t[8] * o, e[9] = t[9] * o, e[10] = t[10] * o, e[11] = t[11] * o, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
}
function ge(e, t, s) {
  var n = Math.sin(s), i = Math.cos(s), o = t[4], a = t[5], r = t[6], l = t[7], u = t[8], c = t[9], h = t[10], d = t[11];
  return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = o * i + u * n, e[5] = a * i + c * n, e[6] = r * i + h * n, e[7] = l * i + d * n, e[8] = u * i - o * n, e[9] = c * i - a * n, e[10] = h * i - r * n, e[11] = d * i - l * n, e;
}
function Xe(e, t, s) {
  var n = Math.sin(s), i = Math.cos(s), o = t[0], a = t[1], r = t[2], l = t[3], u = t[8], c = t[9], h = t[10], d = t[11];
  return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = o * i - u * n, e[1] = a * i - c * n, e[2] = r * i - h * n, e[3] = l * i - d * n, e[8] = o * n + u * i, e[9] = a * n + c * i, e[10] = r * n + h * i, e[11] = l * n + d * i, e;
}
function q(e, t, s) {
  var n = Math.sin(s), i = Math.cos(s), o = t[0], a = t[1], r = t[2], l = t[3], u = t[4], c = t[5], h = t[6], d = t[7];
  return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = o * i + u * n, e[1] = a * i + c * n, e[2] = r * i + h * n, e[3] = l * i + d * n, e[4] = u * i - o * n, e[5] = c * i - a * n, e[6] = h * i - r * n, e[7] = d * i - l * n, e;
}
function Os(e, t, s, n, i) {
  var o = 1 / Math.tan(t / 2), a;
  return e[0] = o / s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = o, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, i != null && i !== 1 / 0 ? (a = 1 / (n - i), e[10] = (i + n) * a, e[14] = 2 * i * n * a) : (e[10] = -1, e[14] = -2 * n), e;
}
var Ds = Os;
function he() {
  var e = new de(3);
  return de != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e;
}
function Bs(e) {
  var t = new de(3);
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t;
}
function te(e, t, s) {
  var n = new de(3);
  return n[0] = e, n[1] = t, n[2] = s, n;
}
function Us(e, t, s) {
  return e[0] = t[0] + s[0], e[1] = t[1] + s[1], e[2] = t[2] + s[2], e;
}
function qt(e, t, s) {
  return e[0] = t[0] * s, e[1] = t[1] * s, e[2] = t[2] * s, e;
}
function Cs(e, t) {
  var s = t[0] - e[0], n = t[1] - e[1], i = t[2] - e[2];
  return Math.hypot(s, n, i);
}
var Fs = Cs;
(function() {
  var e = he();
  return function(t, s, n, i, o, a) {
    var r, l;
    for (s || (s = 3), n || (n = 0), i ? l = Math.min(i * s + n, t.length) : l = t.length, r = n; r < l; r += s)
      e[0] = t[r], e[1] = t[r + 1], e[2] = t[r + 2], o(e, e, a), t[r] = e[0], t[r + 1] = e[1], t[r + 2] = e[2];
    return t;
  };
})();
function Re() {
  var e = new de(2);
  return de != Float32Array && (e[0] = 0, e[1] = 0), e;
}
(function() {
  var e = Re();
  return function(t, s, n, i, o, a) {
    var r, l;
    for (s || (s = 2), n || (n = 0), i ? l = Math.min(i * s + n, t.length) : l = t.length, r = n; r < l; r += s)
      e[0] = t[r], e[1] = t[r + 1], o(e, e, a), t[r] = e[0], t[r + 1] = e[1];
    return t;
  };
})();
function $s(e) {
  let t = 0, s = "", n = "";
  const i = [];
  for (let o = 0; o < e.length; ++o) {
    const a = e[o];
    switch (t) {
      case 0: {
        if (/\s/.test(a))
          continue;
        if (a === "{")
          i.push({}), t = 1;
        else
          return [];
        break;
      }
      case 1: {
        if (/\s/.test(a))
          continue;
        if (a === "}")
          t = 0;
        else if (a === '"')
          s = "", t = 2;
        else
          return [];
        break;
      }
      case 2: {
        a === '"' ? t = 3 : s += a;
        break;
      }
      case 3: {
        if (/\s/.test(a))
          continue;
        a === '"' && (n = "", t = 4);
        break;
      }
      case 4: {
        a === '"' ? (i[i.length - 1][s] = n, t = 1) : n += a;
        break;
      }
    }
  }
  return i;
}
class Gs {
  constructor(t, s, n, i, o) {
    f(this, "name");
    f(this, "entities");
    f(this, "textures");
    f(this, "models");
    f(this, "lightmap");
    f(this, "skies", []);
    f(this, "sprites", {});
    this.name = t, this.entities = s, this.textures = n, this.models = i, this.lightmap = o;
  }
}
const Z = class Z {
  constructor(t) {
    f(this, "lightmap");
    // entire lightmap of the bsp map
    f(this, "texture");
    f(this, "block", new Uint16Array(Z.TEXTURE_SIZE));
    this.lightmap = t, this.texture = new Uint8Array(Z.TEXTURE_SIZE * Z.TEXTURE_SIZE * 4), this.texture[this.texture.length - 4] = 255, this.texture[this.texture.length - 3] = 255, this.texture[this.texture.length - 2] = 255, this.texture[this.texture.length - 1] = 255;
  }
  static init(t) {
    return new Z(t);
  }
  getTexture() {
    return this.texture;
  }
  processFace(t, s, n) {
    const i = this.getDimensions(t), o = this.readLightmap(n, i.width, i.height);
    if (o)
      for (let a = 0; a < t.length / 7; ++a) {
        let r = t[a * 7] * s.s[0] + t[a * 7 + 1] * s.s[1] + t[a * 7 + 2] * s.s[2] + s.sShift - i.minU;
        r += o.x * 16 + 8, r /= Z.TEXTURE_SIZE * 16;
        let l = t[a * 7] * s.t[0] + t[a * 7 + 1] * s.t[1] + t[a * 7 + 2] * s.t[2] + s.tShift - i.minV;
        l += o.y * 16 + 8, l /= Z.TEXTURE_SIZE * 16, t[a * 7 + 5] = r, t[a * 7 + 6] = l;
      }
  }
  getDimensions(t) {
    let s = Math.floor(t[3]), n = Math.floor(t[4]), i = Math.floor(t[3]), o = Math.floor(t[4]);
    for (let a = 1; a < t.length / 7; ++a)
      Math.floor(t[a * 7 + 3]) < s && (s = Math.floor(t[a * 7 + 3])), Math.floor(t[a * 7 + 4]) < n && (n = Math.floor(t[a * 7 + 4])), Math.floor(t[a * 7 + 3]) > i && (i = Math.floor(t[a * 7 + 3])), Math.floor(t[a * 7 + 4]) > o && (o = Math.floor(t[a * 7 + 4]));
    return {
      width: Math.ceil(i / 16) - Math.floor(s / 16) + 1,
      height: Math.ceil(o / 16) - Math.floor(n / 16) + 1,
      minU: Math.floor(s),
      minV: Math.floor(n)
    };
  }
  readLightmap(t, s, n) {
    if (n <= 0 || s <= 0)
      return null;
    const i = this.findFreeSpace(s, n);
    if (i) {
      const o = [i.x, i.y], a = [s, n], r = [Z.TEXTURE_SIZE, Z.TEXTURE_SIZE], l = s * n;
      for (let u = 0; u < l; ++u) {
        const c = o[1] * r[0] + o[0] + r[0] * Math.floor(u / a[0]) + u % a[0];
        this.texture[c * 4] = Math.min(255, this.lightmap[t + u * 3] * 2), this.texture[c * 4 + 1] = Math.min(255, this.lightmap[t + u * 3 + 1] * 2), this.texture[c * 4 + 2] = Math.min(255, this.lightmap[t + u * 3 + 2] * 2), this.texture[c * 4 + 3] = 255;
      }
    }
    return i;
  }
  findFreeSpace(t, s) {
    let n = 0, i = 0, o = Z.TEXTURE_SIZE;
    for (let a = 0; a < this.block.length - t; ++a) {
      let r = 0, l = 0;
      for (; l < t && !(this.block[a + l] >= o); ++l)
        this.block[a + l] > r && (r = this.block[a + l]);
      l === t && (n = a, i = o = r);
    }
    if (o + s > Z.TEXTURE_SIZE)
      return null;
    for (let a = 0; a < t; ++a)
      this.block[n + a] = o + s;
    return { x: n, y: i };
  }
};
f(Z, "TEXTURE_SIZE", 1024);
let Me = Z;
function Xs(e, t, s, n, i, o, a, r) {
  const l = [];
  for (let u = 0; u < e.length; ++u) {
    const c = e[u], h = [], d = new Float32Array(3), g = new Float32Array(3), m = new Float32Array(3), p = new Float32Array(2), E = new Float32Array(2), v = new Float32Array(2), y = new Float32Array(2), w = new Float32Array(2), x = new Float32Array(2), N = u === 0 ? [0, 0, 0] : [0, 0, 0].map((I, b) => (c.maxs[b] - c.mins[b]) / 2 + c.mins[b]), F = te(N[0], N[1], N[2]);
    for (let I = c.firstFace; I < c.firstFace + c.faceCount; ++I) {
      const b = {
        // 3 floats vertices | 2 floats uvs | 2 floats luvs
        buffer: new Float32Array((t[I].edgeCount - 2) * 21),
        textureIndex: -1
      }, k = o[t[I].textureInfo], A = a[k.textureIndex], C = n.slice(t[I].firstEdge, t[I].firstEdge + t[I].edgeCount), j = s[Math.abs(C[0])][C[0] > 0 ? 0 : 1];
      d[0] = i[j][0], d[1] = i[j][1], d[2] = i[j][2], p[0] = d[0] * k.s[0] + d[1] * k.s[1] + d[2] * k.s[2] + k.sShift, p[1] = d[0] * k.t[0] + d[1] * k.t[1] + d[2] * k.t[2] + k.tShift, y[0] = 0, y[1] = 0;
      const $ = s[Math.abs(C[1])][C[1] > 0 ? 0 : 1];
      g[0] = i[$][0], g[1] = i[$][1], g[2] = i[$][2], E[0] = g[0] * k.s[0] + g[1] * k.s[1] + g[2] * k.s[2] + k.sShift, E[1] = g[0] * k.t[0] + g[1] * k.t[1] + g[2] * k.t[2] + k.tShift, w[0] = 0, w[1] = 0.999;
      let _ = 0;
      for (let B = 2; B < t[I].edgeCount; ++B) {
        const Y = s[Math.abs(C[B])][C[B] > 0 ? 0 : 1];
        m[0] = i[Y][0], m[1] = i[Y][1], m[2] = i[Y][2], v[0] = m[0] * k.s[0] + m[1] * k.s[1] + m[2] * k.s[2] + k.sShift, v[1] = m[0] * k.t[0] + m[1] * k.t[1] + m[2] * k.t[2] + k.tShift, x[0] = 0.999, x[1] = 0.999, b.buffer[_++] = d[0], b.buffer[_++] = d[1], b.buffer[_++] = d[2], b.buffer[_++] = p[0], b.buffer[_++] = p[1], b.buffer[_++] = y[0], b.buffer[_++] = y[1], b.buffer[_++] = g[0], b.buffer[_++] = g[1], b.buffer[_++] = g[2], b.buffer[_++] = E[0], b.buffer[_++] = E[1], b.buffer[_++] = w[0], b.buffer[_++] = w[1], b.buffer[_++] = m[0], b.buffer[_++] = m[1], b.buffer[_++] = m[2], b.buffer[_++] = v[0], b.buffer[_++] = v[1], b.buffer[_++] = x[0], b.buffer[_++] = x[1], g[0] = m[0], g[1] = m[1], g[2] = m[2], E[0] = v[0], E[1] = v[1], w[0] = x[0], w[1] = x[1];
      }
      (k.flags === 0 || k.flags === -65536) && r.processFace(b.buffer, k, t[I].lightmapOffset), b.textureIndex = k.textureIndex;
      for (let B = 0; B < b.buffer.length / 7; ++B)
        b.buffer[B * 7] -= F[0], b.buffer[B * 7 + 1] -= F[1], b.buffer[B * 7 + 2] -= F[2], b.buffer[B * 7 + 3] /= A.width, b.buffer[B * 7 + 4] /= A.height;
      h.push(b);
    }
    l.push({
      origin: F,
      faces: h
    });
  }
  return l;
}
const Hs = {
  parse(e, t) {
    const s = new fe(t);
    if (s.ui() !== 30)
      throw new Error("Invalid map version");
    const i = [];
    for (let E = 0; E < 15; ++E)
      i.push({
        offset: s.ui(),
        length: s.ui()
      });
    const o = this.loadEntities(s, i[
      0
      /* Entities */
    ].offset, i[
      0
      /* Entities */
    ].length), a = this.loadTextures(s, i[
      2
      /* Textures */
    ].offset), r = this.loadModels(s, i[
      14
      /* Models */
    ].offset, i[
      14
      /* Models */
    ].length), l = this.loadFaces(s, i[
      7
      /* Faces */
    ].offset, i[
      7
      /* Faces */
    ].length), u = this.loadEdges(s, i[
      12
      /* Edges */
    ].offset, i[
      12
      /* Edges */
    ].length), c = this.loadSurfEdges(s, i[
      13
      /* SurfEdges */
    ].offset, i[
      13
      /* SurfEdges */
    ].length), h = this.loadVertices(s, i[
      3
      /* Vertices */
    ].offset, i[
      3
      /* Vertices */
    ].length), d = this.loadTexInfo(s, i[
      6
      /* TexInfo */
    ].offset, i[
      6
      /* TexInfo */
    ].length), g = this.loadLightmap(s, i[
      8
      /* Lighting */
    ].offset, i[
      8
      /* Lighting */
    ].length), m = Me.init(g), p = Xs(r, l, u, c, h, d, a, m);
    return new Gs(e, o, a, p, {
      width: Me.TEXTURE_SIZE,
      height: Me.TEXTURE_SIZE,
      data: m.getTexture()
    });
  },
  loadFaces(e, t, s) {
    e.seek(t);
    const n = [];
    for (let i = 0; i < s / 20; ++i)
      n.push({
        plane: e.us(),
        planeSide: e.us(),
        firstEdge: e.ui(),
        edgeCount: e.us(),
        textureInfo: e.us(),
        styles: [e.ub(), e.ub(), e.ub(), e.ub()],
        lightmapOffset: e.ui()
      });
    return n;
  },
  loadModels(e, t, s) {
    e.seek(t);
    const n = [];
    for (let i = 0; i < s / 64; ++i)
      n.push({
        mins: [e.f(), e.f(), e.f()],
        maxs: [e.f(), e.f(), e.f()],
        origin: te(e.f(), e.f(), e.f()),
        headNodes: [e.i(), e.i(), e.i(), e.i()],
        visLeaves: e.i(),
        firstFace: e.i(),
        faceCount: e.i()
      });
    return n;
  },
  loadEdges(e, t, s) {
    e.seek(t);
    const n = [];
    for (let i = 0; i < s / 4; ++i)
      n.push([e.us(), e.us()]);
    return n;
  },
  loadSurfEdges(e, t, s) {
    e.seek(t);
    const n = [];
    for (let i = 0; i < s / 4; ++i)
      n.push(e.i());
    return n;
  },
  loadVertices(e, t, s) {
    e.seek(t);
    const n = [];
    for (let i = 0; i < s / 12; ++i)
      n.push([e.f(), e.f(), e.f()]);
    return n;
  },
  loadTexInfo(e, t, s) {
    e.seek(t);
    const n = [];
    for (let i = 0; i < s / 40; ++i)
      n.push({
        s: [e.f(), e.f(), e.f()],
        sShift: e.f(),
        t: [e.f(), e.f(), e.f()],
        tShift: e.f(),
        textureIndex: e.i(),
        flags: e.i()
      });
    return n;
  },
  loadLightmap(e, t, s) {
    return e.seek(t), e.arrx(s, D.UByte);
  },
  loadTextureData(e) {
    const t = e.nstr(16), s = e.ui(), n = e.ui(), i = !e.ui();
    if (i) {
      const u = new Uint8Array(4);
      return u[0] = u[1] = u[2] = u[3] = 255, { name: t, width: s, height: n, data: u, isExternal: i };
    }
    e.skip(3 * 4);
    const o = s * n, a = e.arrx(o, D.UByte);
    e.skip(21 * (o / 64)), e.skip(2);
    const r = e.arrx(768, D.UByte), l = t[0] === "{" ? Se(a, r) : rt(a, r);
    return { name: t, width: s, height: n, data: l, isExternal: i };
  },
  loadTextures(e, t) {
    e.seek(t);
    const s = e.ui(), n = [];
    for (let o = 0; o < s; ++o)
      n.push(e.ui());
    const i = [];
    for (let o = 0; o < s; ++o)
      n[o] === 4294967295 ? i.push({
        name: "ERROR404",
        width: 1,
        height: 1,
        data: new Uint8Array([0, 255, 0, 255]),
        isExternal: !1
      }) : (e.seek(t + n[o]), i.push(this.loadTextureData(e)));
    return i;
  },
  loadEntities(e, t, s) {
    e.seek(t);
    const n = $s(e.nstr(s)), i = ["origin", "angles", "_diffuse_light", "_light", "rendercolor", "avelocity"], o = ["renderamt", "rendermode", "scale"], a = n[0];
    a.classname === "worldspawn" && (a.model = "*0", a.wad = a.wad || "", a.wad = a.wad.split(";").filter((r) => r.length).map((r) => r.replace(/\\/g, "/")).map((r) => es(r)));
    for (const r of n) {
      r.model && (typeof r.renderamt > "u" && (r.renderamt = 0), typeof r.rendermode > "u" && (r.rendermode = 0), typeof r.renderfx > "u" && (r.renderfx = 0), typeof r.rendercolor > "u" && (r.rendercolor = "0 0 0"));
      for (const l of i)
        r[l] && (r[l] = r[l].split(" ").map((u) => Number.parseFloat(u)));
      for (const l of o)
        r[l] && (r[l] = Number.parseFloat(r[l]));
    }
    return n;
  }
};
class ye {
  constructor(t) {
    f(this, "name");
    f(this, "progress");
    f(this, "status");
    f(this, "data");
    this.name = t, this.progress = 0, this.status = 1, this.data = null;
  }
  isLoading() {
    return this.status === 1;
  }
  skip() {
    this.status = 2;
  }
  isSkipped() {
    return this.status === 2;
  }
  // TODO: Add error reason
  error() {
    this.status = 3;
  }
  isError() {
    return this.status === 3;
  }
  done(t) {
    this.status = 4, this.data = t;
  }
  isDone() {
    return this.status === 4;
  }
}
class Ws extends ye {
  constructor() {
    super(...arguments);
    f(this, "type", "replay");
  }
}
class js extends ye {
  constructor() {
    super(...arguments);
    f(this, "type", "bsp");
  }
}
class zs extends ye {
  constructor() {
    super(...arguments);
    f(this, "type", "sky");
  }
}
class qs extends ye {
  constructor() {
    super(...arguments);
    f(this, "type", "wad");
  }
}
class Zs extends ye {
  constructor() {
    super(...arguments);
    f(this, "type", "sound");
  }
}
class Vs extends ye {
  constructor() {
    super(...arguments);
    f(this, "type", "sprite");
  }
}
class Ys {
  constructor(t) {
    f(this, "config");
    f(this, "replay");
    f(this, "map");
    f(this, "skies");
    f(this, "wads");
    f(this, "sounds");
    f(this, "sprites", {});
    f(this, "events");
    this.config = t, this.replay = void 0, this.map = void 0, this.skies = [], this.wads = [], this.sounds = [], this.events = it(), this.events.on("error", (s) => {
      console.error(s);
    });
  }
  clear() {
    this.replay = void 0, this.map = void 0, this.skies.length = 0, this.wads.length = 0, this.sounds.length = 0, this.sprites = {};
  }
  checkStatus() {
    if (this.replay && !this.replay.isDone() || this.map && !this.map.isDone())
      return;
    for (let s = 0; s < this.skies.length; ++s)
      if (this.skies[s].isLoading())
        return;
    for (let s = 0; s < this.wads.length; ++s)
      if (this.wads[s].isLoading())
        return;
    for (let s = 0; s < this.sounds.length; ++s)
      if (this.sounds[s].isLoading())
        return;
    const t = Object.entries(this.sprites);
    for (let s = 0; s < t.length; ++s)
      if (t[s][1].isLoading())
        return;
    this.events.emit("loadall", this);
  }
  load(t) {
    const s = bs(t);
    s === ".dem" ? this.loadReplay(t) : s === ".bsp" ? this.loadMap(t) : this.events.emit("error", "Invalid file extension", t);
  }
  async loadReplay(t) {
    this.replay = new Ws(t), this.events.emit("loadstart", this.replay);
    const s = (r, l) => {
      this.replay && (this.replay.progress = l), this.events.emit("progress", this.replay);
    }, n = this.config.getReplaysPath(), i = await Te(`${n}/${t}`, {
      method: "GET",
      isBinary: !0,
      progressCallback: s
    }).catch((r) => {
      this.replay && this.replay.error(), this.events.emit("error", r, this.replay);
    });
    if (this.replay.isError())
      return;
    const o = be.parseIntoChunks(i);
    this.replay.done(o), this.loadMap(`${o.maps[0].name}.bsp`);
    const a = o.maps[0].resources.sounds;
    for (const r of a)
      r.used && this.loadSound(r.name, r.index);
    this.events.emit("load", this.replay), this.checkStatus();
  }
  async loadMap(t) {
    this.map = new js(t), this.events.emit("loadstart", this.map);
    const s = (r, l) => {
      this.map && (this.map.progress = l), this.events.emit("progress", this.map);
    }, n = this.config.getMapsPath(), i = await Te(`${n}/${t}`, {
      method: "GET",
      isBinary: !0,
      progressCallback: s
    }).catch((r) => {
      this.map && this.map.error(), this.events.emit("error", r, this.map);
    });
    if (this.map.isError())
      return;
    const o = Hs.parse(t, i);
    this.map.done(o), o.entities.map((r) => {
      if (typeof r.model == "string" && r.model.indexOf(".spr") > -1)
        return r.model;
    }).filter((r, l, u) => r && u.indexOf(r) === l).map((r) => r && this.loadSprite(r));
    const a = o.entities[0].skyname;
    if (a && ["bk", "dn", "ft", "lf", "rt", "up"].map((l) => `${a}${l}`).map((l) => this.loadSky(l)), o.textures.find((r) => r.isExternal)) {
      const l = o.entities[0].wad.map((u) => this.loadWad(u));
      await Promise.all(l);
    }
    this.events.emit("load", this.map), this.checkStatus();
  }
  async loadSprite(t) {
    const s = new Vs(t);
    this.sprites[t] = s, this.events.emit("loadstart", s);
    const n = (a, r) => {
      s.progress = r, this.events.emit("progress", s);
    }, i = await Te(`${this.config.getBasePath()}/${t}`, {
      method: "GET",
      isBinary: !0,
      progressCallback: n
    }).catch((a) => {
      s.error(), this.events.emit("error", a, s), this.checkStatus();
    });
    if (s.isError())
      return;
    const o = St.parse(i);
    s.done(o), this.events.emit("load", s), this.checkStatus();
  }
  async loadSky(t) {
    const s = new zs(t);
    this.skies.push(s), this.events.emit("loadstart", s);
    const n = (r, l) => {
      s.progress = l, this.events.emit("progress", s);
    }, i = this.config.getSkiesPath(), o = await Te(`${i}/${t}.tga`, {
      method: "GET",
      isBinary: !0,
      progressCallback: n
    }).catch((r) => {
      s.error(), this.events.emit("error", r, s), this.checkStatus();
    });
    if (s.isError())
      return;
    const a = Pt.parse(o, t);
    s.done(a), this.events.emit("load", s), this.checkStatus();
  }
  async loadWad(t) {
    const s = new qs(t);
    this.wads.push(s), this.events.emit("loadstart", s);
    const n = (u, c) => {
      s.progress = c, this.events.emit("progress", s);
    }, i = this.config.getWadsPath(), o = await Te(`${i}/${t}`, {
      method: "GET",
      isBinary: !0,
      progressCallback: n
    }).catch((u) => {
      s.error(), this.events.emit("error", u, s), this.checkStatus();
    });
    if (s.isError())
      return;
    const a = Lt.parse(o);
    if (s.done(a), !this.map || !this.map.data)
      return;
    const r = this.map.data, l = (u, c) => u.toLowerCase() === c.toLowerCase();
    for (const u of a.entries) {
      if (u.type !== "texture")
        return;
      for (const c of r.textures)
        l(u.name, c.name) && (c.width = u.width, c.height = u.height, c.data = u.data);
    }
    this.events.emit("load", s), this.checkStatus();
  }
  async loadSound(t, s) {
    const n = new Zs(t);
    this.sounds.push(n), this.events.emit("loadstart", n);
    const i = (l, u) => {
      n.progress = u, this.events.emit("progress", n);
    }, o = this.config.getSoundsPath(), a = await Te(`${o}/${t}`, {
      method: "GET",
      isBinary: !0,
      progressCallback: i
    }).catch((l) => {
      n.error(), this.events.emit("error", l, n), this.checkStatus();
    });
    if (n.isError())
      return;
    const r = await Rt.create(a).catch((l) => {
      n.error(), this.events.emit("error", l, n), this.checkStatus();
    });
    !r || n.isError() || (r.index = s, r.name = t, n.done(r), this.events.emit("load", n), this.checkStatus());
  }
}
class Js {
  constructor() {
    f(this, "click", !1);
    f(this, "leftClick", !1);
    f(this, "rightClick", !1);
    f(this, "position", Re());
    f(this, "delta", Re());
  }
}
class Qs {
  constructor() {
    f(this, "pressed", !1);
    f(this, "position", Re());
    f(this, "delta", Re());
  }
}
class Nt {
  constructor(t) {
    f(this, "projectionMatrix", xt());
    f(this, "aspect");
    f(this, "fov", je(60));
    f(this, "near", 1);
    f(this, "far", 8192);
    f(this, "viewMatrix", xt());
    f(this, "position", he());
    f(this, "rotation", he());
    this.aspect = t, this.updateProjectionMatrix();
  }
  static init(t) {
    return new Nt(t);
  }
  updateProjectionMatrix() {
    Ds(
      this.projectionMatrix,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }
  updateViewMatrix() {
    xe(this.viewMatrix), ge(
      this.viewMatrix,
      this.viewMatrix,
      this.rotation[0] - Math.PI / 2
    ), q(
      this.viewMatrix,
      this.viewMatrix,
      Math.PI / 2 - this.rotation[1]
    ), Ie(this.viewMatrix, this.viewMatrix, [
      -this.position[0],
      -this.position[1],
      -this.position[2]
    ]);
  }
}
class se {
  constructor() {
    f(this, "keys");
    this.keys = new Uint8Array(256);
    for (let t = 0; t < 256; ++t)
      this.keys[0] = 0;
  }
}
((e) => {
  ((t) => {
    t[t.A = 65] = "A", t[t.B = 66] = "B", t[t.C = 67] = "C", t[t.D = 68] = "D", t[t.E = 69] = "E", t[t.F = 70] = "F", t[t.G = 71] = "G", t[t.H = 72] = "H", t[t.I = 73] = "I", t[t.J = 74] = "J", t[t.K = 75] = "K", t[t.L = 76] = "L", t[t.M = 77] = "M", t[t.N = 78] = "N", t[t.O = 79] = "O", t[t.P = 80] = "P", t[t.Q = 81] = "Q", t[t.R = 82] = "R", t[t.S = 83] = "S", t[t.T = 84] = "T", t[t.U = 85] = "U", t[t.V = 86] = "V", t[t.W = 87] = "W", t[t.X = 88] = "X", t[t.Y = 89] = "Y", t[t.Z = 90] = "Z", t[t.CTRL = 17] = "CTRL", t[t.ALT = 18] = "ALT", t[t.SPACE = 32] = "SPACE";
  })(e.KEYS || (e.KEYS = {}));
})(se || (se = {}));
class Ze {
  constructor(t) {
    f(this, "gl");
    this.gl = t;
  }
  static init(t) {
    const s = t.getContext("webgl", {
      alpha: !1
    });
    return s ? new Ze(s) : (console.error("Failed to get WebGL context"), null);
  }
  static checkWebGLSupport() {
    const t = {
      BAD_BROWSER: "Your browser does not seem to support WebGL",
      BAD_GPU: "Your graphics card does not seem to support WebGL"
    };
    if (!window.WebGLRenderingContext)
      return {
        hasSupport: !1,
        message: t.BAD_BROWSER
      };
    const s = document.createElement("canvas");
    try {
      return s.getContext("webgl") || s.getContext("experimental-webgl") ? {
        hasSupport: !0,
        message: ""
      } : {
        hasSupport: !1,
        message: t.BAD_GPU
      };
    } catch {
      return {
        hasSupport: !1,
        message: t.BAD_GPU
      };
    }
  }
  createProgram(t) {
    const s = this.gl, n = s.createProgram();
    if (!n)
      return console.error("Failed to create WebGL program"), null;
    const i = this.createShader({
      source: t.vertexShaderSrc,
      type: 0
      /* VERTEX */
    });
    if (!i)
      return console.error("Failed to compile vertex shader"), null;
    const o = this.createShader({
      source: t.fragmentShaderSrc,
      type: 1
      /* FRAGMENT */
    });
    if (!o)
      return console.error("Failed to compile fragment shader"), null;
    if (s.attachShader(n, i), s.attachShader(n, o), s.linkProgram(n), s.validateProgram(n), !s.getProgramParameter(n, s.LINK_STATUS)) {
      s.deleteProgram(n), s.deleteShader(i), s.deleteShader(o);
      const l = s.getProgramInfoLog(n);
      return console.error(`Could not initialize shader: ${l}`), null;
    }
    if (!s.getProgramParameter(n, s.VALIDATE_STATUS)) {
      s.deleteProgram(n), s.deleteShader(i), s.deleteShader(o);
      const l = s.getProgramInfoLog(n);
      return console.error(`Could not initialize shader: ${l}`), null;
    }
    s.useProgram(n);
    const a = {};
    for (let l = 0; l < t.attributeNames.length; ++l) {
      const u = t.attributeNames[l], c = s.getAttribLocation(n, u);
      if (c === -1)
        return console.error(`gl.getAttribLocation failed for attrib named "${u}"`), s.deleteProgram(n), null;
      a[u] = c;
    }
    const r = {};
    for (let l = 0; l < t.uniformNames.length; ++l) {
      const u = t.uniformNames[l], c = s.getUniformLocation(n, u);
      if (c === null)
        return console.error(`gl.getUniformLocation failed for uniform named "${u}"`), s.deleteProgram(n), null;
      r[u] = c;
    }
    return {
      handle: n,
      attributes: a,
      uniforms: r
    };
  }
  createShader(t) {
    const s = this.gl, n = t.type === 0 ? s.createShader(s.VERTEX_SHADER) : s.createShader(s.FRAGMENT_SHADER);
    return n ? (s.shaderSource(n, t.source), s.compileShader(n), s.getShaderParameter(n, s.COMPILE_STATUS) ? n : (console.error(s.getShaderInfoLog(n)), s.deleteShader(n), null)) : (console.error("Failed to create shader program"), null);
  }
  getAnisotropyExtension() {
    return this.gl.getExtension("EXT_texture_filter_anisotropic") || this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic") || this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  }
  getMaxAnisotropy(t) {
    return this.gl.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
  }
}
const Zt = (e, t) => {
  e.camera.position[0] = t.cameraPos[0], e.camera.position[1] = t.cameraPos[1], e.camera.position[2] = t.cameraPos[2], e.camera.rotation[0] = je(t.cameraRot[0]), e.camera.rotation[1] = je(t.cameraRot[1]), e.camera.rotation[2] = je(t.cameraRot[2]);
};
class Ks {
  constructor(t) {
    f(this, "game");
    f(this, "state");
    f(this, "replay");
    f(this, "events");
    f(this, "currentMap", 0);
    f(this, "currentChunk", 0);
    f(this, "currentTime", 0);
    f(this, "currentTick", 0);
    f(this, "isPlaying", !1);
    f(this, "isPaused", !1);
    f(this, "speed", 1);
    this.reset(), this.game = t, this.state = new ot(), this.replay = null, this.events = it();
  }
  reset() {
    if (this.currentMap = 0, this.currentChunk = 0, this.currentTime = 0, this.currentTick = 0, this.isPlaying = !1, this.isPaused = !1, this.speed = 1, this.replay) {
      const t = this.replay.maps[0].chunks[0];
      t.reader.seek(0), this.state = t.state.clone();
    }
  }
  changeReplay(t) {
    this.replay = t, this.reset();
  }
  play() {
    this.isPlaying ? this.isPaused && (this.isPaused = !1) : this.isPlaying = !0, this.events.emit("play", this.currentTime);
  }
  pause() {
    this.isPlaying && (this.isPaused = !0), this.events.emit("pause", this.currentTime);
  }
  stop() {
    this.reset(), this.events.emit("stop", 0);
  }
  speedUp() {
    this.speed = Math.min(this.speed * 2, 4);
  }
  speedDown() {
    this.speed = Math.max(this.speed / 2, 0.25);
  }
  seek(t) {
    const s = Math.max(0, Math.min(this.replay.length, t)), n = this.replay.maps;
    for (let i = 0; i < n.length; ++i) {
      const o = n[i].chunks;
      for (let a = 0; a < o.length; ++a) {
        const r = o[a], l = r.startTime, u = l + r.timeLength;
        if (s >= l && s < u) {
          this.currentMap = i, this.currentChunk = a, this.currentTime = s, this.state = r.state.clone();
          const c = this.replay.deltaDecoders, h = this.replay.customMessages, d = r.reader;
          for (d.seek(0); ; ) {
            const g = d.tell(), m = be.readFrame(d, c, h);
            if (m.time <= s)
              this.state.feedFrame(m), this.currentTick = m.tick;
            else {
              d.seek(g);
              break;
            }
          }
          this.events.emit("seek", s), Zt(this.game, this.state);
          return;
        }
      }
    }
  }
  seekByPercent(t) {
    this.seek(Math.max(0, Math.min(t, 100)) / 100 * this.replay.length);
  }
  update(t) {
    if (!this.isPlaying || this.isPaused)
      return;
    const s = this.replay.deltaDecoders, n = this.replay.customMessages;
    let i = this.replay.maps[this.currentMap], o = i.chunks[this.currentChunk], a = o.reader;
    const r = this.currentTime + t * this.speed;
    let l = !1;
    for (; ; ) {
      let u = a.tell();
      if (u >= o.data.length) {
        if (this.currentChunk === i.chunks.length - 1) {
          if (this.currentMap === this.replay.maps.length - 1) {
            l = !0;
            break;
          }
          this.currentChunk = 0, this.currentMap++, i = this.replay.maps[this.currentMap], o = i.chunks[this.currentChunk];
        } else
          this.currentChunk++, o = i.chunks[this.currentChunk];
        a = o.reader, a.seek(0), u = 0;
        continue;
      }
      const c = be.readFrame(a, s, n);
      if (c.time <= r) {
        if (this.state.feedFrame(c), this.currentTick = c.tick, c.type === 0 || c.type === 1) {
          const h = c.camera.position, d = c.time;
          if (this.state.prevCameraPos) {
            const g = d - this.state.prevTime;
            g > 0 && (this.state.velocity = [
              (h[0] - this.state.prevCameraPos[0]) / g,
              (h[1] - this.state.prevCameraPos[1]) / g,
              (h[2] - this.state.prevCameraPos[2]) / g
            ], this.state.speed = Math.sqrt(
              this.state.velocity[0] * this.state.velocity[0] + this.state.velocity[1] * this.state.velocity[1]
            ));
          }
          this.state.prevCameraPos = [h[0], h[1], h[2]], this.state.prevTime = d;
        }
      } else {
        a.seek(u);
        break;
      }
    }
    Zt(this.game, this.state), this.currentTime = r, l && this.stop();
  }
}
class Ot {
  constructor(t) {
    f(this, "context");
    f(this, "draw", () => {
      const t = this.context.gl;
      t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT);
    });
    this.context = t.context;
  }
  static init(t) {
    const s = t.gl;
    return s.clearColor(0, 0, 0, 1), s.clearDepth(1), s.enable(s.DEPTH_TEST), s.depthFunc(s.LEQUAL), s.enable(s.BLEND), s.blendFunc(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA), s.enable(s.CULL_FACE), s.cullFace(s.FRONT), new Ot({ context: t });
  }
}
const en = `#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D diffuse;

varying vec2 vTexCoord;

void main(void) {
  vec4 diffuseColor = texture2D(diffuse, vTexCoord);
  gl_FragColor = vec4(diffuseColor.rgb, 1.0);
}`, tn = `#ifdef GL_ES
precision highp float;
#endif

attribute vec3 position;
attribute vec2 texCoord;

varying vec2 vTexCoord;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
  vTexCoord = texCoord;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1);
}`;
class Dt {
  constructor(t) {
    f(this, "program");
    f(this, "aPosition");
    f(this, "aTexCoord");
    f(this, "uViewMx");
    f(this, "uProjectionMx");
    f(this, "uDiffuse");
    this.program = t.handle, this.aPosition = t.attributes.position, this.aTexCoord = t.attributes.texCoord, this.uViewMx = t.uniforms.viewMatrix, this.uProjectionMx = t.uniforms.projectionMatrix, this.uDiffuse = t.uniforms.diffuse;
  }
  static init(t) {
    const s = ["position", "texCoord"], n = ["viewMatrix", "projectionMatrix", "diffuse"], i = t.createProgram({
      vertexShaderSrc: tn,
      fragmentShaderSrc: en,
      attributeNames: s,
      uniformNames: n
    });
    return i ? new Dt(i) : (console.error("Failed to create sky shader program"), null);
  }
  useProgram(t) {
    t.useProgram(this.program);
  }
  setViewMatrix(t, s) {
    t.uniformMatrix4fv(this.uViewMx, !1, s);
  }
  setProjectionMatrix(t, s) {
    t.uniformMatrix4fv(this.uProjectionMx, !1, s);
  }
  setDiffuse(t, s) {
    t.uniform1i(this.uDiffuse, s);
  }
  enableVertexAttribs(t) {
    t.enableVertexAttribArray(this.aPosition), t.enableVertexAttribArray(this.aTexCoord);
  }
  setVertexAttribPointers(t) {
    t.vertexAttribPointer(this.aPosition, 3, t.FLOAT, !1, 5 * 4, 0), t.vertexAttribPointer(this.aTexCoord, 2, t.FLOAT, !1, 5 * 4, 3 * 4);
  }
}
class Bt {
  constructor(t) {
    f(this, "context");
    f(this, "shader");
    f(this, "vertexBuffer", null);
    f(this, "indexBuffer", null);
    f(this, "texture", null);
    f(this, "isReady", !1);
    this.context = t.context, this.shader = t.shader;
  }
  static init(t) {
    const s = Dt.init(t);
    return s ? new Bt({ context: t, shader: s }) : (console.error("skyscenen't"), null);
  }
  changeMap(t) {
    if (t.skies.length !== 6) {
      this.isReady = !1;
      return;
    }
    const s = this.context.gl, n = s.createBuffer(), i = s.createBuffer(), o = s.createTexture();
    if (!n || !i || !o)
      throw new Error("shouldnt happen");
    const a = new Uint8Array([
      0,
      1,
      2,
      0,
      2,
      3,
      // front
      4,
      5,
      6,
      4,
      6,
      7,
      // back
      8,
      9,
      10,
      8,
      10,
      11,
      // top
      12,
      13,
      14,
      12,
      14,
      15,
      // bottom
      16,
      17,
      18,
      16,
      18,
      19,
      // right
      20,
      21,
      22,
      20,
      22,
      23
      // left
    ]), r = new Float32Array([
      // Top face
      -1,
      -1,
      1,
      0.499,
      1e-3,
      1,
      -1,
      1,
      0.499,
      0.249,
      1,
      1,
      1,
      1e-3,
      0.249,
      -1,
      1,
      1,
      1e-3,
      1e-3,
      // Bottom face
      -1,
      -1,
      -1,
      0.499,
      0.749,
      -1,
      1,
      -1,
      1e-3,
      0.749,
      1,
      1,
      -1,
      1e-3,
      0.501,
      1,
      -1,
      -1,
      0.499,
      0.501,
      // Front face
      -1,
      1,
      -1,
      0.501,
      0.749,
      -1,
      1,
      1,
      0.501,
      0.501,
      1,
      1,
      1,
      0.999,
      0.501,
      1,
      1,
      -1,
      0.999,
      0.749,
      // Back face
      -1,
      -1,
      -1,
      0.999,
      0.249,
      1,
      -1,
      -1,
      0.501,
      0.249,
      1,
      -1,
      1,
      0.501,
      1e-3,
      -1,
      -1,
      1,
      0.999,
      1e-3,
      // Right face
      1,
      -1,
      -1,
      0.499,
      0.499,
      1,
      1,
      -1,
      1e-3,
      0.499,
      1,
      1,
      1,
      1e-3,
      0.251,
      1,
      -1,
      1,
      0.499,
      0.251,
      // Left face
      -1,
      -1,
      -1,
      0.501,
      0.499,
      -1,
      -1,
      1,
      0.501,
      0.251,
      -1,
      1,
      1,
      0.999,
      0.251,
      -1,
      1,
      -1,
      0.999,
      0.499
    ].map((g, m) => m % 5 < 3 ? g * 4096 : g));
    s.bindBuffer(s.ARRAY_BUFFER, n), s.bufferData(s.ARRAY_BUFFER, r, s.STATIC_DRAW), s.enableVertexAttribArray(0), s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, i), s.bufferData(s.ELEMENT_ARRAY_BUFFER, a, s.STATIC_DRAW);
    const l = document.createElement("canvas");
    l.width = 512, l.height = 1024;
    const u = l.getContext("2d");
    if (!u)
      throw new Error("sky ctx fail");
    const c = {
      up: [0, 0],
      rt: [0, 256],
      dn: [0, 512],
      ft: [256, 0],
      lf: [256, 256],
      bk: [256, 512]
    };
    for (const g of t.skies) {
      const m = document.createElement("canvas"), p = m.getContext("2d");
      if (!p)
        throw new Error("Runtime error.");
      m.width = g.width, m.height = g.height;
      const E = p.getImageData(0, 0, m.width, m.height);
      for (let w = 0; w < g.data.length; ++w)
        E.data[w] = g.data[w];
      p.putImageData(E, 0, 0);
      const v = g.name.slice(-2), y = c[v] ? c[v] : [];
      if (!u)
        throw new Error("Runtime error.");
      u.drawImage(m, y[0], y[1]);
    }
    const h = u.getImageData(0, 0, 512, 1024).data;
    s.bindTexture(s.TEXTURE_2D, o), s.texImage2D(
      s.TEXTURE_2D,
      0,
      s.RGBA,
      512,
      1024,
      0,
      s.RGBA,
      s.UNSIGNED_BYTE,
      new Uint8Array(h)
    ), s.generateMipmap(s.TEXTURE_2D), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.REPEAT), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.REPEAT), s.texParameteri(
      s.TEXTURE_2D,
      s.TEXTURE_MIN_FILTER,
      s.LINEAR_MIPMAP_LINEAR
    ), s.texParameterf(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR);
    const d = this.context.getAnisotropyExtension();
    d && s.texParameteri(
      s.TEXTURE_2D,
      d.TEXTURE_MAX_ANISOTROPY_EXT,
      this.context.getMaxAnisotropy(d)
    ), this.vertexBuffer = n, this.indexBuffer = i, this.texture = o, this.isReady = !0;
  }
  draw(t) {
    if (!this.isReady)
      return;
    const s = this.context.gl, n = this.shader;
    n.useProgram(s), s.bindTexture(s.TEXTURE_2D, this.texture), s.bindBuffer(s.ARRAY_BUFFER, this.vertexBuffer), s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, this.indexBuffer), n.enableVertexAttribs(s), n.setVertexAttribPointers(s), n.setDiffuse(s, 0);
    const i = t.position[0], o = t.position[1], a = t.position[2];
    t.position[0] = 0, t.position[1] = 0, t.position[2] = 0, t.updateViewMatrix(), t.position[0] = i, t.position[1] = o, t.position[2] = a, n.setViewMatrix(s, t.viewMatrix), n.setProjectionMatrix(s, t.projectionMatrix), s.drawElements(s.TRIANGLES, 36, s.UNSIGNED_BYTE, 0), s.clear(s.DEPTH_BUFFER_BIT);
  }
}
const sn = `#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D diffuse;
uniform sampler2D lightmap;
uniform float opacity;

varying vec2 vTexCoord;
varying vec2 vLightmapCoord;

void main(void) {
  vec4 diffuseColor = texture2D(diffuse, vTexCoord);
  vec4 lightColor = texture2D(lightmap, vLightmapCoord);

  gl_FragColor = vec4(diffuseColor.rgb * lightColor.rgb, diffuseColor.a * opacity);
}`, nn = `#ifdef GL_ES
precision highp float;
#endif

attribute vec3 position;
attribute vec2 texCoord;
attribute vec2 texCoord2;

varying vec2 vTexCoord;
varying vec2 vLightmapCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
  vTexCoord = texCoord;
  vLightmapCoord = texCoord2;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}`;
class Ut {
  constructor(t) {
    f(this, "program");
    f(this, "aPosition");
    f(this, "aTexCoord");
    f(this, "aTexCoord2");
    f(this, "uModelMx");
    f(this, "uViewMx");
    f(this, "uProjectionMx");
    f(this, "uDiffuse");
    f(this, "uLightmap");
    f(this, "uOpacity");
    this.program = t.handle, this.aPosition = t.attributes.position, this.aTexCoord = t.attributes.texCoord, this.aTexCoord2 = t.attributes.texCoord2, this.uModelMx = t.uniforms.modelMatrix, this.uViewMx = t.uniforms.viewMatrix, this.uProjectionMx = t.uniforms.projectionMatrix, this.uDiffuse = t.uniforms.diffuse, this.uLightmap = t.uniforms.lightmap, this.uOpacity = t.uniforms.opacity;
  }
  static init(t) {
    const s = ["position", "texCoord", "texCoord2"], n = [
      "modelMatrix",
      "viewMatrix",
      "projectionMatrix",
      "diffuse",
      "lightmap",
      "opacity"
    ], i = t.createProgram({
      vertexShaderSrc: nn,
      fragmentShaderSrc: sn,
      attributeNames: s,
      uniformNames: n
    });
    return i ? new Ut(i) : (console.error("Failed to create MainShader program"), null);
  }
  useProgram(t) {
    t.useProgram(this.program);
  }
  setModelMatrix(t, s) {
    t.uniformMatrix4fv(this.uModelMx, !1, s);
  }
  setViewMatrix(t, s) {
    t.uniformMatrix4fv(this.uViewMx, !1, s);
  }
  setProjectionMatrix(t, s) {
    t.uniformMatrix4fv(this.uProjectionMx, !1, s);
  }
  setDiffuse(t, s) {
    t.uniform1i(this.uDiffuse, s);
  }
  setLightmap(t, s) {
    t.uniform1i(this.uLightmap, s);
  }
  setOpacity(t, s) {
    t.uniform1f(this.uOpacity, s);
  }
  enableVertexAttribs(t) {
    t.enableVertexAttribArray(this.aPosition), t.enableVertexAttribArray(this.aTexCoord), t.enableVertexAttribArray(this.aTexCoord2);
  }
  setVertexAttribPointers(t) {
    t.vertexAttribPointer(this.aPosition, 3, t.FLOAT, !1, 7 * 4, 0), t.vertexAttribPointer(this.aTexCoord, 2, t.FLOAT, !1, 7 * 4, 3 * 4), t.vertexAttribPointer(this.aTexCoord2, 2, t.FLOAT, !1, 7 * 4, 5 * 4);
  }
}
var R = /* @__PURE__ */ ((e) => (e[e.Normal = 0] = "Normal", e[e.Color = 1] = "Color", e[e.Texture = 2] = "Texture", e[e.Glow = 3] = "Glow", e[e.Solid = 4] = "Solid", e[e.Additive = 5] = "Additive", e))(R || {});
const Vt = (e, t, s, n, i) => {
  const o = document.createElement("canvas"), a = o.getContext("2d");
  if (!a)
    throw new Error("Runtime error.");
  o.width = t, o.height = s;
  const r = document.createElement("canvas"), l = r.getContext("2d");
  if (!l)
    throw new Error("Runtime error.");
  r.width = n, r.height = i;
  const u = a.createImageData(t, s);
  for (let c = 0, h = t * s * 4; c < h; c += 4)
    u.data[c] = e[c], u.data[c + 1] = e[c + 1], u.data[c + 2] = e[c + 2], u.data[c + 3] = e[c + 3];
  return a.putImageData(u, 0, 0), l.drawImage(o, 0, 0, n, i), new Uint8Array(l.getImageData(0, 0, n, i).data);
}, He = (e) => (e & e - 1) === 0, We = (e) => {
  let t = e;
  --t;
  for (let s = 1; s < 32; s <<= 1)
    t = t | t >> s;
  return t + 1;
};
class Ct {
  constructor(t) {
    f(this, "buffer");
    f(this, "context");
    f(this, "shader");
    f(this, "modelMatrix", xt());
    f(this, "sceneInfo", {
      length: 0,
      data: new Float32Array(0),
      models: []
    });
    f(this, "bsp", null);
    f(this, "textures", []);
    f(this, "sprites", {});
    f(this, "lightmap", null);
    this.buffer = t.buffer, this.context = t.context, this.shader = t.shader;
  }
  static init(t) {
    const s = Ut.init(t);
    if (!s)
      return console.error("Failed to init MainShader"), null;
    s.useProgram(t.gl);
    const n = t.gl.createBuffer();
    return n ? new Ct({ buffer: n, context: t, shader: s }) : (console.error("Failed to create WebGL buffer"), null);
  }
  changeMap(t) {
    this.fillBuffer(t), this.loadTextures(t), this.loadSpriteTextures(t), this.loadLightmap(t), this.bsp = t;
  }
  fillBuffer(t) {
    const s = this.context.gl, n = t.models, i = [
      "aaatrigger",
      "clip",
      "null",
      "hint",
      "nodraw",
      "invisible",
      "skip",
      "trigger",
      "sky",
      "fog"
    ];
    let o = 0;
    for (let u = 0; u < n.length; ++u) {
      const c = n[u];
      for (let h = 0; h < c.faces.length; ++h) {
        const d = t.textures[c.faces[h].textureIndex];
        i.indexOf(d.name) > -1 || (o += c.faces[h].buffer.length);
      }
    }
    o += 7 * 6;
    const a = {
      length: o,
      data: new Float32Array(o),
      models: []
    };
    let r = 0;
    for (let u = 0; u < t.models.length; ++u) {
      const c = t.models[u], h = {
        origin: c.origin,
        offset: r,
        length: 0,
        isTransparent: !1,
        faces: []
      };
      for (let d = 0; d < c.faces.length; ++d) {
        const g = t.textures[c.faces[d].textureIndex];
        if (i.indexOf(g.name) > -1)
          continue;
        const m = {
          offset: r,
          length: 0,
          textureIndex: -1
        };
        for (let p = 0; p < c.faces[d].buffer.length; ++p)
          a.data[r++] = c.faces[d].buffer[p];
        !h.isTransparent && t.textures[c.faces[d].textureIndex].name[0] === "{" && (h.isTransparent = !0), m.textureIndex = c.faces[d].textureIndex, m.length = r - m.offset, h.faces.push(m);
      }
      h.length = r - h.offset, a.models.push(h);
    }
    a.models.push({
      origin: [0, 0, 0],
      offset: r,
      length: 4,
      isTransparent: !1,
      // unused
      faces: [
        {
          offset: r,
          length: 4,
          textureIndex: 0
          // unused
        }
      ]
    }), a.data[r++] = -0.5, a.data[r++] = 0, a.data[r++] = -0.5, a.data[r++] = 1, a.data[r++] = 1, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0.5, a.data[r++] = 0, a.data[r++] = 0.5, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = -0.5, a.data[r++] = 0, a.data[r++] = 0.5, a.data[r++] = 1, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = -0.5, a.data[r++] = 0, a.data[r++] = -0.5, a.data[r++] = 1, a.data[r++] = 1, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0.5, a.data[r++] = 0, a.data[r++] = -0.5, a.data[r++] = 0, a.data[r++] = 1, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0.5, a.data[r++] = 0, a.data[r++] = 0.5, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0, a.data[r++] = 0, r = 0;
    const l = {
      data: new Float32Array(a.data),
      length: a.length,
      models: a.models.map((u) => ({
        origin: Bs(u.origin),
        offset: u.offset,
        length: u.length,
        isTransparent: u.isTransparent,
        faces: u.faces.map((c) => ({
          offset: c.offset,
          length: c.length,
          textureIndex: c.textureIndex
        }))
      }))
    };
    for (let u = 0; u < l.models.length; ++u) {
      const c = l.models[u];
      c.faces.sort((g, m) => g.textureIndex - m.textureIndex);
      for (let g = 0; g < c.faces.length; ++g) {
        const m = c.faces[g], p = r;
        for (let E = 0; E < m.length; ++E)
          l.data[r] = a.data[m.offset + E], r += 1;
        m.offset = p;
      }
      const h = [];
      let d = -1;
      for (let g = 0; g < c.faces.length; ++g) {
        const m = c.faces[g];
        m.textureIndex === d ? h[h.length - 1].length += m.length : (h.push({
          offset: m.offset,
          length: m.length,
          textureIndex: m.textureIndex
        }), d = m.textureIndex);
      }
      c.faces = h;
    }
    this.sceneInfo = l, s.bindBuffer(s.ARRAY_BUFFER, this.buffer), s.bufferData(s.ARRAY_BUFFER, this.sceneInfo.data, s.STATIC_DRAW);
  }
  loadTextures(t) {
    const s = this.context.gl;
    for (let n = 0; n < t.textures.length; ++n) {
      const i = s.createTexture();
      if (!i)
        throw new Error("fatal error");
      const o = t.textures[n];
      if (!He(o.width) || !He(o.height)) {
        const r = o.width, l = o.height, u = We(o.width), c = We(o.height);
        o.data = Vt(o.data, r, l, u, c), o.width = u, o.height = c;
      }
      s.bindTexture(s.TEXTURE_2D, i), s.texImage2D(
        s.TEXTURE_2D,
        0,
        s.RGBA,
        o.width,
        o.height,
        0,
        s.RGBA,
        s.UNSIGNED_BYTE,
        o.data
      ), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR_MIPMAP_LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.REPEAT), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.REPEAT), s.generateMipmap(s.TEXTURE_2D);
      const a = this.context.getAnisotropyExtension();
      a && s.texParameteri(
        s.TEXTURE_2D,
        a.TEXTURE_MAX_ANISOTROPY_EXT,
        this.context.getMaxAnisotropy(a)
      ), this.textures.push({
        name: o.name,
        width: o.width,
        height: o.height,
        data: o.data,
        handle: i
      });
    }
  }
  loadSpriteTextures(t) {
    const s = this.context.gl;
    for (const [n, i] of Object.entries(t.sprites)) {
      const o = s.createTexture();
      if (!o)
        throw new Error("fatal error");
      const a = i.frames[0];
      if (!He(a.width) || !He(a.height)) {
        const l = a.width, u = a.height, c = We(a.width), h = We(a.height);
        a.data = Vt(a.data, l, u, c, h), a.width = c, a.height = h;
      }
      s.bindTexture(s.TEXTURE_2D, o), s.texImage2D(
        s.TEXTURE_2D,
        0,
        s.RGBA,
        a.width,
        a.height,
        0,
        s.RGBA,
        s.UNSIGNED_BYTE,
        a.data
      ), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR_MIPMAP_LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.REPEAT), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.REPEAT), s.generateMipmap(s.TEXTURE_2D);
      const r = this.context.getAnisotropyExtension();
      r && s.texParameteri(
        s.TEXTURE_2D,
        r.TEXTURE_MAX_ANISOTROPY_EXT,
        this.context.getMaxAnisotropy(r)
      ), this.textures.push({
        name: n,
        width: a.width,
        height: a.height,
        data: a.data,
        handle: o
      }), this.sprites[n] = i;
    }
  }
  loadLightmap(t) {
    const s = this.context.gl, n = s.createTexture();
    if (!n)
      throw new Error("fatal error");
    s.bindTexture(s.TEXTURE_2D, n), s.texImage2D(
      s.TEXTURE_2D,
      0,
      s.RGBA,
      t.lightmap.width,
      t.lightmap.height,
      0,
      s.RGBA,
      s.UNSIGNED_BYTE,
      t.lightmap.data
    ), s.generateMipmap(s.TEXTURE_2D), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR_MIPMAP_LINEAR), this.lightmap = {
      data: t.lightmap.data,
      handle: n
    };
  }
  draw(t, s) {
    if (!this.bsp || !this.lightmap)
      return;
    const n = this.context.gl, i = this.shader;
    i.useProgram(n), t.updateProjectionMatrix(), t.updateViewMatrix(), i.setViewMatrix(n, t.viewMatrix), i.setProjectionMatrix(n, t.projectionMatrix), n.bindBuffer(n.ARRAY_BUFFER, this.buffer), i.enableVertexAttribs(n), i.setVertexAttribPointers(n), i.setDiffuse(n, 0), i.setLightmap(n, 1), n.activeTexture(n.TEXTURE1), n.bindTexture(n.TEXTURE_2D, this.lightmap.handle), n.activeTexture(n.TEXTURE0);
    const o = [], a = [];
    for (let r = 1; r < s.length; ++r) {
      const l = s[r];
      if (l.model)
        if (!l.rendermode || l.rendermode === R.Normal || l.rendermode === R.Solid) {
          if (l.model[0] === "*") {
            if (this.sceneInfo.models[Number.parseInt(l.model.substr(1))].isTransparent) {
              a.push(l);
              continue;
            }
          } else if (l.model.indexOf(".spr") > -1) {
            a.push(l);
            continue;
          }
          o.push(l);
        } else l.rendermode, R.Additive, a.push(l);
    }
    i.setOpacity(n, 1), this.renderWorldSpawn(), this.renderOpaqueEntities(t, o), a.length && (n.depthMask(!1), this.renderTransparentEntities(a, t), n.depthMask(!0));
  }
  renderWorldSpawn() {
    const t = this.sceneInfo.models[0], s = this.context.gl;
    xe(this.modelMatrix), this.shader.setModelMatrix(s, this.modelMatrix);
    for (let n = 0; n < t.faces.length; ++n) {
      const i = t.faces[n];
      s.bindTexture(s.TEXTURE_2D, this.textures[i.textureIndex].handle), s.drawArrays(s.TRIANGLES, i.offset / 7, i.length / 7);
    }
  }
  renderOpaqueEntities(t, s) {
    const n = this.context.gl, i = this.shader, o = this.modelMatrix;
    for (let a = 0; a < s.length; ++a) {
      const r = s[a], l = Number.parseInt(r.model.substr(1)), u = this.sceneInfo.models[l];
      if (u) {
        const c = r.angles || [0, 0, 0], h = r.origin ? te(r.origin[0], r.origin[1], r.origin[2]) : he();
        Us(h, h, u.origin), xe(o), Ie(o, o, h), q(o, o, c[1] * Math.PI / 180), ge(this.modelMatrix, this.modelMatrix, c[2] * Math.PI / 180), i.setModelMatrix(n, this.modelMatrix);
        for (let d = 0; d < u.faces.length; ++d) {
          const g = u.faces[d];
          n.bindTexture(n.TEXTURE_2D, this.textures[g.textureIndex].handle), n.drawArrays(n.TRIANGLES, g.offset / 7, g.length / 7);
        }
      } else if (r.model.indexOf(".spr") > -1) {
        const c = this.textures.find((d) => d.name === r.model), h = this.sprites[r.model];
        if (c && h) {
          const d = r.origin ? te(r.origin[0], r.origin[1], r.origin[2]) : he(), g = te(c.width, 1, c.height), m = r.angles ? te(r.angles[0], r.angles[2], r.angles[1]) : he();
          switch (qt(g, g, r.scale || 1), xe(o), Ie(o, o, d), h.header.type) {
            case J.VP_PARALLEL_UPRIGHT: {
              q(o, o, t.rotation[1] + Math.PI / 2);
              break;
            }
            case J.FACING_UPRIGHT: {
              q(o, o, t.rotation[1] + Math.PI / 2);
              break;
            }
            case J.VP_PARALLEL: {
              q(
                o,
                o,
                Math.atan2(d[1] - t.position[1], d[0] - t.position[0]) + Math.PI / 2
              ), ge(
                o,
                o,
                Math.atan2(
                  t.position[2] - d[2],
                  Math.sqrt((t.position[0] - d[0]) ** 2 + (t.position[1] - d[1]) ** 2)
                )
              );
              break;
            }
            case J.ORIENTED: {
              Xe(o, o, m[0] * Math.PI / 180 + Math.PI), q(o, o, m[1] * Math.PI / 180 + Math.PI), ge(o, o, m[2] * Math.PI / 180 - Math.PI / 2);
              break;
            }
            case J.VP_PARALLEL_ORIENTED: {
              Xe(o, o, m[0] * Math.PI / 180 + Math.PI), q(o, o, m[1] * Math.PI / 180 + Math.PI);
              break;
            }
            default:
              throw new Error("Invalid sprite type");
          }
          switch (zt(o, o, g), i.setModelMatrix(n, o), i.setOpacity(n, (r.renderamt || 255) / 255), r.rendermode || R.Normal) {
            case R.Normal: {
              i.setOpacity(n, 1), n.bindTexture(n.TEXTURE_2D, c.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Color: {
              i.setOpacity(n, (r.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, c.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Texture: {
              i.setOpacity(n, (r.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, c.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Glow: {
              n.blendFunc(n.SRC_ALPHA, n.DST_ALPHA), i.setOpacity(n, (r.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, c.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA);
              break;
            }
            case R.Solid: {
              i.setOpacity(n, (r.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, c.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Additive: {
              n.blendFunc(n.SRC_ALPHA, n.DST_ALPHA), i.setOpacity(n, (r.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, c.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA);
              break;
            }
          }
        }
      }
    }
  }
  renderTransparentEntities(t, s) {
    const n = this.context.gl, i = this.shader, o = this.modelMatrix, a = t.map((r, l) => ({
      index: l,
      distance: Fs(s.position, r.origin || [0, 0, 0])
    })).sort((r, l) => r.distance - l.distance);
    for (let r = 0; r < a.length; ++r) {
      const l = t[a[r].index], u = Number.parseInt(l.model.substr(1)), c = this.sceneInfo.models[u];
      if (c) {
        const h = l.angles || [0, 0, 0], d = l.origin || [0, 0, 0];
        switch (d[0] += c.origin[0], d[1] += c.origin[1], d[2] += c.origin[2], xe(o), Ie(o, o, d), q(o, o, h[1] * Math.PI / 180), ge(this.modelMatrix, this.modelMatrix, h[2] * Math.PI / 180), i.setModelMatrix(n, this.modelMatrix), l.rendermode || R.Normal) {
          case R.Normal: {
            i.setOpacity(n, 1);
            for (let m = 0; m < c.faces.length; ++m) {
              const p = c.faces[m];
              n.bindTexture(n.TEXTURE_2D, this.textures[p.textureIndex].handle), n.drawArrays(n.TRIANGLES, p.offset / 7, p.length / 7);
            }
            break;
          }
          case R.Color: {
            i.setOpacity(n, (l.renderamt || 255) / 255);
            for (let m = 0; m < c.faces.length; ++m) {
              const p = c.faces[m];
              n.bindTexture(n.TEXTURE_2D, this.textures[p.textureIndex].handle), n.drawArrays(n.TRIANGLES, p.offset / 7, p.length / 7);
            }
            break;
          }
          case R.Texture: {
            i.setOpacity(n, (l.renderamt || 255) / 255);
            for (let m = 0; m < c.faces.length; ++m) {
              const p = c.faces[m];
              n.bindTexture(n.TEXTURE_2D, this.textures[p.textureIndex].handle), n.drawArrays(n.TRIANGLES, p.offset / 7, p.length / 7);
            }
            break;
          }
          case R.Glow: {
            i.setOpacity(n, (l.renderamt || 255) / 255);
            for (let m = 0; m < c.faces.length; ++m) {
              const p = c.faces[m];
              n.bindTexture(n.TEXTURE_2D, this.textures[p.textureIndex].handle), n.drawArrays(n.TRIANGLES, p.offset / 7, p.length / 7);
            }
            break;
          }
          case R.Solid: {
            i.setOpacity(n, (l.renderamt || 255) / 255);
            for (let m = 0; m < c.faces.length; ++m) {
              const p = c.faces[m];
              n.bindTexture(n.TEXTURE_2D, this.textures[p.textureIndex].handle), n.drawArrays(n.TRIANGLES, p.offset / 7, p.length / 7);
            }
            break;
          }
          case R.Additive: {
            n.blendFunc(n.SRC_ALPHA, n.DST_ALPHA), i.setOpacity(n, (l.renderamt || 255) / 255);
            for (let m = 0; m < c.faces.length; ++m) {
              const p = c.faces[m];
              n.bindTexture(n.TEXTURE_2D, this.textures[p.textureIndex].handle), n.drawArrays(n.TRIANGLES, p.offset / 7, p.length / 7);
            }
            n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA);
            break;
          }
        }
      } else if (l.model.indexOf(".spr") > -1) {
        const h = this.textures.find((g) => g.name === l.model), d = this.sprites[l.model];
        if (h && d) {
          const g = l.origin ? te(l.origin[0], l.origin[1], l.origin[2]) : he(), m = te(h.width, 1, h.height), p = l.angles ? te(l.angles[0], l.angles[2], l.angles[1]) : he();
          switch (qt(m, m, l.scale || 1), xe(o), Ie(o, o, g), d.header.type) {
            case J.VP_PARALLEL_UPRIGHT: {
              q(o, o, s.rotation[1] + Math.PI / 2);
              break;
            }
            case J.FACING_UPRIGHT: {
              q(o, o, s.rotation[1] + Math.PI / 2);
              break;
            }
            case J.VP_PARALLEL: {
              q(
                o,
                o,
                Math.atan2(g[1] - s.position[1], g[0] - s.position[0]) + Math.PI / 2
              ), ge(
                o,
                o,
                Math.atan2(
                  s.position[2] - g[2],
                  Math.sqrt((s.position[0] - g[0]) ** 2 + (s.position[1] - g[1]) ** 2)
                )
              );
              break;
            }
            case J.ORIENTED: {
              Xe(o, o, p[0] * Math.PI / 180 + Math.PI), q(o, o, p[1] * Math.PI / 180 + Math.PI), ge(o, o, p[2] * Math.PI / 180 - Math.PI / 2);
              break;
            }
            case J.VP_PARALLEL_ORIENTED: {
              Xe(o, o, p[0] * Math.PI / 180 + Math.PI), q(o, o, p[1] * Math.PI / 180 + Math.PI);
              break;
            }
            default:
              throw new Error("Invalid sprite type");
          }
          switch (zt(o, o, m), i.setModelMatrix(n, o), i.setOpacity(n, (l.renderamt || 255) / 255), l.rendermode || R.Normal) {
            case R.Normal: {
              i.setOpacity(n, 1), n.bindTexture(n.TEXTURE_2D, h.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Color: {
              i.setOpacity(n, (l.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, h.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Texture: {
              i.setOpacity(n, (l.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, h.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Glow: {
              n.blendFunc(n.SRC_ALPHA, n.DST_ALPHA), i.setOpacity(n, (l.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, h.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA);
              break;
            }
            case R.Solid: {
              i.setOpacity(n, (l.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, h.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6);
              break;
            }
            case R.Additive: {
              n.blendFunc(n.SRC_ALPHA, n.DST_ALPHA), i.setOpacity(n, (l.renderamt || 255) / 255), n.bindTexture(n.TEXTURE_2D, h.handle), n.drawArrays(n.TRIANGLES, this.sceneInfo.models[this.sceneInfo.models.length - 1].offset / 7, 6), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA);
              break;
            }
          }
        }
      }
    }
  }
}
var X = /* @__PURE__ */ ((e) => (e[e.FREE = 0] = "FREE", e[e.REPLAY = 1] = "REPLAY", e))(X || {});
class Ft {
  constructor(t) {
    f(this, "config");
    f(this, "pauseTime", 0);
    f(this, "isPaused", !1);
    f(this, "lastTime", 0);
    f(this, "accumTime", 0);
    f(this, "timeStep", 1 / 60);
    f(this, "title", "");
    f(this, "mode");
    f(this, "pointerLocked", !1);
    f(this, "touch", new Qs());
    f(this, "mouse", new Js());
    f(this, "keyboard", new se());
    f(this, "loader");
    f(this, "entities", []);
    f(this, "sounds");
    f(this, "soundSystem");
    f(this, "events");
    f(this, "player");
    f(this, "canvas");
    f(this, "mapName");
    f(this, "context");
    f(this, "camera");
    f(this, "renderer");
    f(this, "worldScene");
    f(this, "skyScene");
    f(this, "onLoadAll", (t) => {
      if (t != null && t.replay && (this.changeReplay(t.replay.data), this.changeMode(
        1
        /* REPLAY */
      )), !t.map || !t.map.data)
        return;
      const s = t.map.data, n = t.skies;
      let i = !0;
      for (const o of n)
        i = i && o.isDone();
      if (i)
        for (const o of n)
          o.data && s.skies.push(o.data);
      for (const [o, a] of Object.entries(t.sprites))
        a.data && (s.sprites[o] = a.data);
      if (t.sounds.length > 0)
        for (const o of t.sounds)
          o.data && this.sounds.push(o.data);
      this.changeMap(s), this.events.emit("load", t);
    });
    f(this, "draw", () => {
      requestAnimationFrame(this.draw);
      const t = this.canvas, s = t.parentElement;
      if (s) {
        const o = s.clientWidth, a = s.clientHeight;
        (t.width !== o || t.height !== a) && (t.width = o, t.height = a, this.camera.aspect = t.clientWidth / t.clientHeight, this.camera.updateProjectionMatrix(), this.context.gl.viewport(0, 0, this.context.gl.drawingBufferWidth, this.context.gl.drawingBufferHeight)), (t.clientWidth !== t.width || t.clientHeight !== t.height) && (t.width = t.clientWidth, t.height = t.clientHeight, this.camera.aspect = t.clientWidth / t.clientHeight, this.camera.updateProjectionMatrix(), this.context.gl.viewport(0, 0, this.context.gl.drawingBufferWidth, this.context.gl.drawingBufferHeight));
      }
      if (this.isPaused)
        return;
      const n = dt() / 1e3, i = n - this.lastTime;
      for (this.accumTime += i; this.accumTime > this.timeStep; )
        this.update(this.timeStep), this.accumTime -= this.timeStep;
      this.renderer.draw(), this.mapName !== "" && (this.skyScene.draw(this.camera), this.worldScene.draw(this.camera, this.entities)), this.lastTime = n;
    });
    f(this, "onTouchStart", (t) => {
      const s = t.touches.item(0);
      s && (this.touch.pressed = !0, this.touch.position[0] = s.clientX, this.touch.position[1] = s.clientY);
    });
    f(this, "onTouchEnd", () => {
      this.touch.pressed = !1, this.touch.delta[0] = 0, this.touch.delta[1] = 0;
    });
    f(this, "onTouchMove", (t) => {
      const s = t.touches.item(0);
      s && this.touch.pressed && (this.touch.delta[0], this.touch.delta[0] = s.clientX - this.touch.position[0], this.touch.delta[1] = s.clientY - this.touch.position[1], this.touch.position[0] = s.clientX, this.touch.position[1] = s.clientY);
    });
    f(this, "onMouseMove", (t) => {
      this.pointerLocked && (this.mouse.delta[0] = t.movementX * 0.5, this.mouse.delta[1] = t.movementY * 0.5, this.mouse.position[0] = t.pageX, this.mouse.position[1] = t.pageY);
    });
    f(this, "keyDown", (t) => (this.keyboard.keys[t.which] = 1, this.pointerLocked ? (t.preventDefault(), !1) : !0));
    f(this, "keyUp", (t) => (this.keyboard.keys[t.which] = 0, this.pointerLocked ? (t.preventDefault(), !1) : !0));
    f(this, "onVisibilityChange", () => {
      if (document.hidden) {
        if (this.isPaused)
          return;
        this.pauseTime = dt() / 1e3, this.isPaused = !0;
      } else {
        if (!this.isPaused)
          return;
        this.lastTime = dt() / 1e3 - this.pauseTime + this.lastTime, this.isPaused = !1;
      }
    });
    this.sounds = [], this.soundSystem = new Kt(), this.config = t.config, this.loader = new Ys(this.config), this.loader.events.on("loadall", this.onLoadAll), document.addEventListener("touchstart", this.onTouchStart, !1), document.addEventListener("touchend", this.onTouchEnd, !1), document.addEventListener("touchcancel", this.onTouchEnd, !1), document.addEventListener("touchmove", this.onTouchMove, !1), document.addEventListener("mousemove", this.onMouseMove, !1), window.addEventListener("keydown", this.keyDown), window.addEventListener("keyup", this.keyUp), window.addEventListener("visibilitychange", this.onVisibilityChange), this.canvas = t.canvas, this.camera = Nt.init(this.canvas.width / this.canvas.height), this.context = t.context, this.renderer = t.renderer, this.worldScene = t.worldScene, this.skyScene = t.skyScene, this.mode = 0, this.player = new Ks(this), this.events = it(), this.mapName = "";
  }
  static init(t) {
    if (!Ze.checkWebGLSupport().hasSupport)
      return {
        status: "error",
        message: "No WebGL support!"
      };
    const n = document.createElement("canvas");
    if (!n)
      return {
        status: "error",
        message: "Failed to create <canvas> element!"
      };
    const i = Ze.init(n);
    if (!i)
      return {
        status: "error",
        message: "Failed to initialize WebGL context"
      };
    const o = Ot.init(i);
    if (!o)
      return {
        status: "error",
        message: "Failed to initialize renderer"
      };
    const a = Ct.init(i);
    if (!a)
      return {
        status: "error",
        message: "Failed to initialize world scene"
      };
    const r = Bt.init(i);
    return r ? {
      status: "success",
      game: new Ft({
        canvas: n,
        config: t,
        context: i,
        renderer: o,
        worldScene: a,
        skyScene: r
      })
    } : {
      status: "error",
      message: "Failed to initialize sky scene"
    };
  }
  getCanvas() {
    return this.canvas;
  }
  load(t) {
    this.events.emit("loadstart"), this.loader.load(t);
  }
  changeMap(t) {
    if (this.mapName.toLowerCase() === t.name.toLowerCase())
      return;
    this.mapName = t.name, this.worldScene.changeMap(t), this.skyScene.changeMap(t), this.entities = t.entities;
    const s = t.entities.find((n) => n.classname === "info_player_start");
    s ? (this.camera.position[0] = s.origin[0], this.camera.position[1] = s.origin[1], this.camera.position[2] = s.origin[2]) : (this.camera.position[0] = 0, this.camera.position[1] = 0, this.camera.position[2] = 0), this.camera.rotation[0] = 0, this.camera.rotation[1] = 0, this.camera.rotation[2] = 0;
  }
  changeReplay(t) {
    this.events.emit("prereplaychange", this, t), this.player.changeReplay(t), this.events.emit("postreplaychange", this, t);
  }
  changeMode(t) {
    this.mode = t, this.events.emit("modechange", t);
  }
  setTitle(t) {
    this.title = t, this.events.emit("titlechange", t);
  }
  getTitle() {
    return this.title;
  }
  update(t) {
    this.events.emit("preupdate", this);
    const s = this.camera, n = this.keyboard, i = this.mouse, o = this.touch;
    if (this.mode === 1)
      this.player.update(t);
    else if (this.mode === 0) {
      this.touch.pressed ? (s.rotation[0] = Math.min(Math.max(s.rotation[0] + o.delta[1] / 100, -Math.PI / 2), Math.PI / 2), s.rotation[1] -= o.delta[0] / 100) : (s.rotation[0] = Math.min(Math.max(s.rotation[0] + i.delta[1] / 100, -Math.PI / 2), Math.PI / 2), s.rotation[1] -= i.delta[0] / 100);
      const r = 500 * t, l = se.KEYS.W, u = se.KEYS.S, c = se.KEYS.A, h = se.KEYS.D, d = se.KEYS.C, g = se.KEYS.SPACE;
      n.keys[l] !== n.keys[u] && (n.keys[l] ? (s.position[1] -= Math.cos(s.rotation[1] + Math.PI / 2) * r, s.position[0] += Math.sin(s.rotation[1] + Math.PI / 2) * r) : n.keys[u] && (s.position[1] -= Math.cos(s.rotation[1] - Math.PI / 2) * r, s.position[0] += Math.sin(s.rotation[1] - Math.PI / 2) * r)), n.keys[c] !== n.keys[h] && (n.keys[c] ? (s.position[1] += Math.cos(s.rotation[1]) * r, s.position[0] -= Math.sin(s.rotation[1]) * r) : n.keys[h] && (s.position[1] -= Math.cos(s.rotation[1]) * r, s.position[0] += Math.sin(s.rotation[1]) * r)), n.keys[g] !== n.keys[d] && (n.keys[g] ? s.position[2] += r : n.keys[d] && (s.position[2] -= r));
    }
    i.delta[0] = 0, i.delta[1] = 0, this.events.emit("postupdate", this);
  }
}
class Ve {
  constructor(t) {
    f(this, "paths");
    this.paths = { ...t.paths };
  }
  static init(t) {
    var s, n, i, o, a, r;
    return typeof t == "string" ? new Ve({
      paths: {
        base: t,
        replays: `${t}/replays`,
        maps: `${t}/maps`,
        wads: `${t}/wads`,
        skies: `${t}/skies`,
        sounds: `${t}/sounds`
      }
    }) : new Ve({
      paths: {
        base: ((s = t == null ? void 0 : t.paths) == null ? void 0 : s.base) || "",
        replays: ((n = t == null ? void 0 : t.paths) == null ? void 0 : n.replays) || "/replays",
        maps: ((i = t == null ? void 0 : t.paths) == null ? void 0 : i.maps) || "/maps",
        wads: ((o = t == null ? void 0 : t.paths) == null ? void 0 : o.wads) || "/wads",
        skies: ((a = t == null ? void 0 : t.paths) == null ? void 0 : a.skies) || "/skies",
        sounds: ((r = t == null ? void 0 : t.paths) == null ? void 0 : r.sounds) || "/sounds"
      }
    });
  }
  getBasePath() {
    return this.paths.base;
  }
  getReplaysPath() {
    return this.paths.replays;
  }
  getMapsPath() {
    return this.paths.maps;
  }
  getWadsPath() {
    return this.paths.wads;
  }
  getSkiesPath() {
    return this.paths.skies;
  }
  getSoundsPath() {
    return this.paths.sounds;
  }
}
const rn = (e, t) => e === t, pe = Symbol("solid-proxy"), wt = Symbol("solid-track"), Ye = {
  equals: rn
};
let ss = os;
const me = 1, Je = 2, ns = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var L = null;
let Et = null, on = null, O = null, G = null, re = null, at = 0;
function ze(e, t) {
  const s = O, n = L, i = e.length === 0, o = t === void 0 ? n : t, a = i ? ns : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, r = i ? e : () => e(() => ae(() => ct(a)));
  L = a, O = null;
  try {
    return Ae(r, !0);
  } finally {
    O = s, L = n;
  }
}
function W(e, t) {
  t = t ? Object.assign({}, Ye, t) : Ye;
  const s = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, n = (i) => (typeof i == "function" && (i = i(s.value)), rs(s, i));
  return [is.bind(s), n];
}
function V(e, t, s) {
  const n = $t(e, t, !1, me);
  Ne(n);
}
function an(e, t, s) {
  ss = mn;
  const n = $t(e, t, !1, me);
  n.user = !0, re ? re.push(n) : Ne(n);
}
function oe(e, t, s) {
  s = s ? Object.assign({}, Ye, s) : Ye;
  const n = $t(e, t, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = s.equals || void 0, Ne(n), is.bind(n);
}
function ln(e) {
  return Ae(e, !1);
}
function ae(e) {
  if (O === null) return e();
  const t = O;
  O = null;
  try {
    return e();
  } finally {
    O = t;
  }
}
function lt(e) {
  an(() => ae(e));
}
function ke(e) {
  return L === null || (L.cleanups === null ? L.cleanups = [e] : L.cleanups.push(e)), e;
}
function bt() {
  return O;
}
function cn(e, t) {
  const s = Symbol("context");
  return {
    id: s,
    Provider: pn(s),
    defaultValue: e
  };
}
function un(e) {
  let t;
  return L && L.context && (t = L.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function hn(e) {
  const t = oe(e), s = oe(() => yt(t()));
  return s.toArray = () => {
    const n = s();
    return Array.isArray(n) ? n : n != null ? [n] : [];
  }, s;
}
function is() {
  if (this.sources && this.state)
    if (this.state === me) Ne(this);
    else {
      const e = G;
      G = null, Ae(() => Ke(this), !1), G = e;
    }
  if (O) {
    const e = this.observers ? this.observers.length : 0;
    O.sources ? (O.sources.push(this), O.sourceSlots.push(e)) : (O.sources = [this], O.sourceSlots = [e]), this.observers ? (this.observers.push(O), this.observerSlots.push(O.sources.length - 1)) : (this.observers = [O], this.observerSlots = [O.sources.length - 1]);
  }
  return this.value;
}
function rs(e, t, s) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, t)) && (e.value = t, e.observers && e.observers.length && Ae(() => {
    for (let i = 0; i < e.observers.length; i += 1) {
      const o = e.observers[i], a = Et && Et.running;
      a && Et.disposed.has(o), (a ? !o.tState : !o.state) && (o.pure ? G.push(o) : re.push(o), o.observers && as(o)), a || (o.state = me);
    }
    if (G.length > 1e6)
      throw G = [], new Error();
  }, !1)), t;
}
function Ne(e) {
  if (!e.fn) return;
  ct(e);
  const t = at;
  fn(e, e.value, t);
}
function fn(e, t, s) {
  let n;
  const i = L, o = O;
  O = L = e;
  try {
    n = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = me, e.owned && e.owned.forEach(ct), e.owned = null), e.updatedAt = s + 1, ls(a);
  } finally {
    O = o, L = i;
  }
  (!e.updatedAt || e.updatedAt <= s) && (e.updatedAt != null && "observers" in e ? rs(e, n) : e.value = n, e.updatedAt = s);
}
function $t(e, t, s, n = me, i) {
  const o = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: L,
    context: L ? L.context : null,
    pure: s
  };
  return L === null || L !== ns && (L.owned ? L.owned.push(o) : L.owned = [o]), o;
}
function Qe(e) {
  if (e.state === 0) return;
  if (e.state === Je) return Ke(e);
  if (e.suspense && ae(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < at); )
    e.state && t.push(e);
  for (let s = t.length - 1; s >= 0; s--)
    if (e = t[s], e.state === me)
      Ne(e);
    else if (e.state === Je) {
      const n = G;
      G = null, Ae(() => Ke(e, t[0]), !1), G = n;
    }
}
function Ae(e, t) {
  if (G) return e();
  let s = !1;
  t || (G = []), re ? s = !0 : re = [], at++;
  try {
    const n = e();
    return dn(s), n;
  } catch (n) {
    s || (re = null), G = null, ls(n);
  }
}
function dn(e) {
  if (G && (os(G), G = null), e) return;
  const t = re;
  re = null, t.length && Ae(() => ss(t), !1);
}
function os(e) {
  for (let t = 0; t < e.length; t++) Qe(e[t]);
}
function mn(e) {
  let t, s = 0;
  for (t = 0; t < e.length; t++) {
    const n = e[t];
    n.user ? e[s++] = n : Qe(n);
  }
  for (t = 0; t < s; t++) Qe(e[t]);
}
function Ke(e, t) {
  e.state = 0;
  for (let s = 0; s < e.sources.length; s += 1) {
    const n = e.sources[s];
    if (n.sources) {
      const i = n.state;
      i === me ? n !== t && (!n.updatedAt || n.updatedAt < at) && Qe(n) : i === Je && Ke(n, t);
    }
  }
}
function as(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const s = e.observers[t];
    s.state || (s.state = Je, s.pure ? G.push(s) : re.push(s), s.observers && as(s));
  }
}
function ct(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const s = e.sources.pop(), n = e.sourceSlots.pop(), i = s.observers;
      if (i && i.length) {
        const o = i.pop(), a = s.observerSlots.pop();
        n < i.length && (o.sourceSlots[a] = n, i[n] = o, s.observerSlots[n] = a);
      }
    }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) ct(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function gn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function ls(e, t = L) {
  throw gn(e);
}
function yt(e) {
  if (typeof e == "function" && !e.length) return yt(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let s = 0; s < e.length; s++) {
      const n = yt(e[s]);
      Array.isArray(n) ? t.push.apply(t, n) : t.push(n);
    }
    return t;
  }
  return e;
}
function pn(e, t) {
  return function(n) {
    let i;
    return V(() => i = ae(() => (L.context = {
      ...L.context,
      [e]: n.value
    }, hn(() => n.children))), void 0), i;
  };
}
const En = Symbol("fallback");
function Yt(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Tn(e, t, s = {}) {
  let n = [], i = [], o = [], a = 0, r = t.length > 1 ? [] : null;
  return ke(() => Yt(o)), () => {
    let l = e() || [], u = l.length, c, h;
    return l[wt], ae(() => {
      let g, m, p, E, v, y, w, x, N;
      if (u === 0)
        a !== 0 && (Yt(o), o = [], n = [], i = [], a = 0, r && (r = [])), s.fallback && (n = [En], i[0] = ze((F) => (o[0] = F, s.fallback())), a = 1);
      else if (a === 0) {
        for (i = new Array(u), h = 0; h < u; h++)
          n[h] = l[h], i[h] = ze(d);
        a = u;
      } else {
        for (p = new Array(u), E = new Array(u), r && (v = new Array(u)), y = 0, w = Math.min(a, u); y < w && n[y] === l[y]; y++) ;
        for (w = a - 1, x = u - 1; w >= y && x >= y && n[w] === l[x]; w--, x--)
          p[x] = i[w], E[x] = o[w], r && (v[x] = r[w]);
        for (g = /* @__PURE__ */ new Map(), m = new Array(x + 1), h = x; h >= y; h--)
          N = l[h], c = g.get(N), m[h] = c === void 0 ? -1 : c, g.set(N, h);
        for (c = y; c <= w; c++)
          N = n[c], h = g.get(N), h !== void 0 && h !== -1 ? (p[h] = i[c], E[h] = o[c], r && (v[h] = r[c]), h = m[h], g.set(N, h)) : o[c]();
        for (h = y; h < u; h++)
          h in p ? (i[h] = p[h], o[h] = E[h], r && (r[h] = v[h], r[h](h))) : i[h] = ze(d);
        i = i.slice(0, a = u), n = l.slice(0);
      }
      return i;
    });
    function d(g) {
      if (o[h] = g, r) {
        const [m, p] = W(h);
        return r[h] = p, t(l[h], m);
      }
      return t(l[h]);
    }
  };
}
function P(e, t) {
  return ae(() => e(t || {}));
}
const vn = (e) => `Stale read from <${e}>.`;
function xn(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return oe(Tn(() => e.each, e.children, t || void 0));
}
function kt(e) {
  const t = e.keyed, s = oe(() => e.when, void 0, {
    equals: (n, i) => t ? n === i : !n == !i
  });
  return oe(() => {
    const n = s();
    if (n) {
      const i = e.children;
      return typeof i == "function" && i.length > 0 ? ae(() => i(t ? n : () => {
        if (!ae(s)) throw vn("Show");
        return e.when;
      })) : i;
    }
    return e.fallback;
  }, void 0, void 0);
}
function wn(e, t, s) {
  let n = s.length, i = t.length, o = n, a = 0, r = 0, l = t[i - 1].nextSibling, u = null;
  for (; a < i || r < o; ) {
    if (t[a] === s[r]) {
      a++, r++;
      continue;
    }
    for (; t[i - 1] === s[o - 1]; )
      i--, o--;
    if (i === a) {
      const c = o < n ? r ? s[r - 1].nextSibling : s[o - r] : l;
      for (; r < o; ) e.insertBefore(s[r++], c);
    } else if (o === r)
      for (; a < i; )
        (!u || !u.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === s[o - 1] && s[r] === t[i - 1]) {
      const c = t[--i].nextSibling;
      e.insertBefore(s[r++], t[a++].nextSibling), e.insertBefore(s[--o], c), t[i] = s[o];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let h = r;
        for (; h < o; ) u.set(s[h], h++);
      }
      const c = u.get(t[a]);
      if (c != null)
        if (r < c && c < o) {
          let h = a, d = 1, g;
          for (; ++h < i && h < o && !((g = u.get(t[h])) == null || g !== c + d); )
            d++;
          if (d > c - r) {
            const m = t[a];
            for (; r < c; ) e.insertBefore(s[r++], m);
          } else e.replaceChild(s[r++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const Jt = "_$DX_DELEGATE";
function bn(e, t, s, n = {}) {
  let i;
  return ze((o) => {
    i = o, t === document ? e() : M(t, e(), t.firstChild ? null : void 0, s);
  }, n.owner), () => {
    i(), t.textContent = "";
  };
}
function S(e, t, s) {
  let n;
  const i = () => {
    const a = document.createElement("template");
    return a.innerHTML = e, a.content.firstChild;
  }, o = () => (n || (n = i())).cloneNode(!0);
  return o.cloneNode = o, o;
}
function K(e, t = window.document) {
  const s = t[Jt] || (t[Jt] = /* @__PURE__ */ new Set());
  for (let n = 0, i = e.length; n < i; n++) {
    const o = e[n];
    s.has(o) || (s.add(o), t.addEventListener(o, kn));
  }
}
function cs(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function yn(e, t, s) {
  return ae(() => e(t, s));
}
function M(e, t, s, n) {
  if (s !== void 0 && !n && (n = []), typeof t != "function") return et(e, t, n, s);
  V((i) => et(e, t(), i, s), n);
}
function kn(e) {
  const t = `$$${e.type}`;
  let s = e.composedPath && e.composedPath()[0] || e.target;
  for (e.target !== s && Object.defineProperty(e, "target", {
    configurable: !0,
    value: s
  }), Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return s || document;
    }
  }); s; ) {
    const n = s[t];
    if (n && !s.disabled) {
      const i = s[`${t}Data`];
      if (i !== void 0 ? n.call(s, i, e) : n.call(s, e), e.cancelBubble) return;
    }
    s = s._$host || s.parentNode || s.host;
  }
}
function et(e, t, s, n, i) {
  for (; typeof s == "function"; ) s = s();
  if (t === s) return s;
  const o = typeof t, a = n !== void 0;
  if (e = a && s[0] && s[0].parentNode || e, o === "string" || o === "number") {
    if (o === "number" && (t = t.toString(), t === s))
      return s;
    if (a) {
      let r = s[0];
      r && r.nodeType === 3 ? r.data !== t && (r.data = t) : r = document.createTextNode(t), s = ve(e, s, n, r);
    } else
      s !== "" && typeof s == "string" ? s = e.firstChild.data = t : s = e.textContent = t;
  } else if (t == null || o === "boolean")
    s = ve(e, s, n);
  else {
    if (o === "function")
      return V(() => {
        let r = t();
        for (; typeof r == "function"; ) r = r();
        s = et(e, r, s, n);
      }), () => s;
    if (Array.isArray(t)) {
      const r = [], l = s && Array.isArray(s);
      if (At(r, t, s, i))
        return V(() => s = et(e, r, s, n, !0)), () => s;
      if (r.length === 0) {
        if (s = ve(e, s, n), a) return s;
      } else l ? s.length === 0 ? Qt(e, r, n) : wn(e, s, r) : (s && ve(e), Qt(e, r));
      s = r;
    } else if (t.nodeType) {
      if (Array.isArray(s)) {
        if (a) return s = ve(e, s, n, t);
        ve(e, s, null, t);
      } else s == null || s === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      s = t;
    }
  }
  return s;
}
function At(e, t, s, n) {
  let i = !1;
  for (let o = 0, a = t.length; o < a; o++) {
    let r = t[o], l = s && s[e.length], u;
    if (!(r == null || r === !0 || r === !1)) if ((u = typeof r) == "object" && r.nodeType)
      e.push(r);
    else if (Array.isArray(r))
      i = At(e, r, l) || i;
    else if (u === "function")
      if (n) {
        for (; typeof r == "function"; ) r = r();
        i = At(e, Array.isArray(r) ? r : [r], Array.isArray(l) ? l : [l]) || i;
      } else
        e.push(r), i = !0;
    else {
      const c = String(r);
      l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
    }
  }
  return i;
}
function Qt(e, t, s = null) {
  for (let n = 0, i = t.length; n < i; n++) e.insertBefore(t[n], s);
}
function ve(e, t, s, n) {
  if (s === void 0) return e.textContent = "";
  const i = n || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const r = t[a];
      if (i !== r) {
        const l = r.parentNode === e;
        !o && !a ? l ? e.replaceChild(i, r) : e.insertBefore(i, s) : l && r.remove();
      } else o = !0;
    }
  } else e.insertBefore(i, s);
  return [i];
}
const It = Symbol("store-raw"), we = Symbol("store-node"), ie = Symbol("store-has"), us = Symbol("store-self");
function hs(e) {
  let t = e[pe];
  if (!t && (Object.defineProperty(e, pe, {
    value: t = new Proxy(e, _n)
  }), !Array.isArray(e))) {
    const s = Object.keys(e), n = Object.getOwnPropertyDescriptors(e);
    for (let i = 0, o = s.length; i < o; i++) {
      const a = s[i];
      n[a].get && Object.defineProperty(e, a, {
        enumerable: n[a].enumerable,
        get: n[a].get.bind(t)
      });
    }
  }
  return t;
}
function tt(e) {
  let t;
  return e != null && typeof e == "object" && (e[pe] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function Pe(e, t = /* @__PURE__ */ new Set()) {
  let s, n, i, o;
  if (s = e != null && e[It]) return s;
  if (!tt(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let a = 0, r = e.length; a < r; a++)
      i = e[a], (n = Pe(i, t)) !== i && (e[a] = n);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    const a = Object.keys(e), r = Object.getOwnPropertyDescriptors(e);
    for (let l = 0, u = a.length; l < u; l++)
      o = a[l], !r[o].get && (i = e[o], (n = Pe(i, t)) !== i && (e[o] = n));
  }
  return e;
}
function st(e, t) {
  let s = e[t];
  return s || Object.defineProperty(e, t, {
    value: s = /* @__PURE__ */ Object.create(null)
  }), s;
}
function Le(e, t, s) {
  if (e[t]) return e[t];
  const [n, i] = W(s, {
    equals: !1,
    internal: !0
  });
  return n.$ = i, e[t] = n;
}
function An(e, t) {
  const s = Reflect.getOwnPropertyDescriptor(e, t);
  return !s || s.get || !s.configurable || t === pe || t === we || (delete s.value, delete s.writable, s.get = () => e[pe][t]), s;
}
function fs(e) {
  bt() && Le(st(e, we), us)();
}
function In(e) {
  return fs(e), Reflect.ownKeys(e);
}
const _n = {
  get(e, t, s) {
    if (t === It) return e;
    if (t === pe) return s;
    if (t === wt)
      return fs(e), s;
    const n = st(e, we), i = n[t];
    let o = i ? i() : e[t];
    if (t === we || t === ie || t === "__proto__") return o;
    if (!i) {
      const a = Object.getOwnPropertyDescriptor(e, t);
      bt() && (typeof o != "function" || e.hasOwnProperty(t)) && !(a && a.get) && (o = Le(n, t, o)());
    }
    return tt(o) ? hs(o) : o;
  },
  has(e, t) {
    return t === It || t === pe || t === wt || t === we || t === ie || t === "__proto__" ? !0 : (bt() && Le(st(e, ie), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: In,
  getOwnPropertyDescriptor: An
};
function nt(e, t, s, n = !1) {
  if (!n && e[t] === s) return;
  const i = e[t], o = e.length;
  s === void 0 ? (delete e[t], e[ie] && e[ie][t] && i !== void 0 && e[ie][t].$()) : (e[t] = s, e[ie] && e[ie][t] && i === void 0 && e[ie][t].$());
  let a = st(e, we), r;
  if ((r = Le(a, t, i)) && r.$(() => s), Array.isArray(e) && e.length !== o) {
    for (let l = e.length; l < o; l++) (r = a[l]) && r.$();
    (r = Le(a, "length", o)) && r.$(e.length);
  }
  (r = a[us]) && r.$();
}
function ds(e, t) {
  const s = Object.keys(t);
  for (let n = 0; n < s.length; n += 1) {
    const i = s[n];
    nt(e, i, t[i]);
  }
}
function Mn(e, t) {
  if (typeof t == "function" && (t = t(e)), t = Pe(t), Array.isArray(t)) {
    if (e === t) return;
    let s = 0, n = t.length;
    for (; s < n; s++) {
      const i = t[s];
      e[s] !== i && nt(e, s, i);
    }
    nt(e, "length", n);
  } else ds(e, t);
}
function _e(e, t, s = []) {
  let n, i = e;
  if (t.length > 1) {
    n = t.shift();
    const a = typeof n, r = Array.isArray(e);
    if (Array.isArray(n)) {
      for (let l = 0; l < n.length; l++)
        _e(e, [n[l]].concat(t), s);
      return;
    } else if (r && a === "function") {
      for (let l = 0; l < e.length; l++)
        n(e[l], l) && _e(e, [l].concat(t), s);
      return;
    } else if (r && a === "object") {
      const {
        from: l = 0,
        to: u = e.length - 1,
        by: c = 1
      } = n;
      for (let h = l; h <= u; h += c)
        _e(e, [h].concat(t), s);
      return;
    } else if (t.length > 1) {
      _e(e[n], t, [n].concat(s));
      return;
    }
    i = e[n], s = [n].concat(s);
  }
  let o = t[0];
  typeof o == "function" && (o = o(i, s), o === i) || n === void 0 && o == null || (o = Pe(o), n === void 0 || tt(i) && tt(o) && !Array.isArray(o) ? ds(i, o) : nt(e, n, o));
}
function ms(...[e, t]) {
  const s = Pe(e || {}), n = Array.isArray(s), i = hs(s);
  function o(...a) {
    ln(() => {
      n && a.length === 1 ? Mn(s, a[0]) : _e(s, a);
    });
  }
  return [i, o];
}
var Rn = /* @__PURE__ */ S('<div class=hlv-loading><div class=hlv-loading-spinner><svg xmlns=http://www.w3.org/2000/svg x=0px y=0px width=80px height=80px viewBox="0 0 80 80"><title>Loading</title><path fill=#ffffff d=M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z></path></svg></div><div class=hlv-loading-log>'), Pn = /* @__PURE__ */ S("<div class=hlv-loading-log-item>");
const Ln = {
  replay: "Replay",
  bsp: "Map",
  sound: "Sounds",
  sky: "Skybox",
  sprite: "Sprites",
  wad: "Wads"
};
function Sn(e) {
  const [t, s] = ms({});
  lt(() => {
    const a = e.game.loader.events, r = a.on("loadstart", n), l = a.on("progress", i);
    ke(() => {
      r == null || r(), l == null || l();
    });
  });
  const n = (a) => {
    const r = t[a.type] ? t[a.type] : [];
    for (let l = 0; l < r.length; ++l)
      if (r[l] === a)
        return;
    r.push({
      name: a.name,
      progress: 0
    }), s(a.type, r);
  }, i = (a) => {
    if (!t[a.type])
      return;
    const r = t[a.type];
    for (let l = 0; l < r.length; ++l)
      if (r[l].name === a.name) {
        s(a.type, l, {
          progress: a.progress
        });
        break;
      }
  }, o = (a, r) => {
    let l = a;
    l = Ln[l];
    const u = `${Math.round(r * 100)}%`;
    let c = 29 - l.length - u.length;
    c < 2 && (c = 9 - u.length);
    const h = Array(c).join(".");
    return `${l}${h}${u}`;
  };
  return (() => {
    var a = Rn(), r = a.firstChild, l = r.nextSibling;
    return M(l, P(xn, {
      get each() {
        return Object.entries(t);
      },
      children: ([u, c]) => (() => {
        var h = Pn();
        return M(h, () => o(u, c.reduce((d, g) => d + g.progress, 0) / c.length)), h;
      })()
    })), V(() => a.classList.toggle("visible", !!e.visible)), a;
  })();
}
var Nn = /* @__PURE__ */ S('<div class=hlv-settings><button type=button class=hlv-button><svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Toggle</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path></svg></button><div class=hlv-settings-menu><span class=hlv-settings-menu-title>Mode</span><button type=button class=hlv-settings-menu-item>Free Move</button><button type=button class=hlv-settings-menu-item>Show Speed'), On = /* @__PURE__ */ S("<button type=button class=hlv-settings-menu-item>Replay"), Dn = /* @__PURE__ */ S("<span>");
const [_t, Bn] = W(!0);
function gs(e) {
  const [t, s] = W(!1), n = !!e.game.player.replay, i = () => {
    e.game.mode !== X.FREE && (e.game.changeMode(X.FREE), e.game.player.pause());
  }, o = () => {
    e.game.mode !== X.REPLAY && e.game.changeMode(X.REPLAY);
  };
  return (() => {
    var a = Nn(), r = a.firstChild, l = r.nextSibling, u = l.firstChild, c = u.nextSibling, h = c.nextSibling;
    return r.$$click = () => s(!t()), M(l, n ? (() => {
      var d = On();
      return d.$$click = () => o(), V(() => d.classList.toggle("selected", e.game.mode === X.REPLAY)), d;
    })() : Dn(), c), c.$$click = () => i(), h.$$click = () => Bn(!_t()), V((d) => {
      var g = !!t(), m = e.game.mode === X.FREE, p = !!_t();
      return g !== d.e && a.classList.toggle("open", d.e = g), m !== d.t && c.classList.toggle("selected", d.t = m), p !== d.a && h.classList.toggle("selected", d.a = p), d;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), a;
  })();
}
K(["click"]);
const ne = [
  {
    enabled: "fullscreenEnabled",
    element: "fullscreenElement",
    request: "requestFullscreen",
    exit: "exitFullscreen",
    change: "fullscreenchange",
    error: "fullscreenerror"
  },
  {
    enabled: "mozFullScreenEnabled",
    element: "mozFullScreenElement",
    request: "mozRequestFullScreen",
    exit: "mozCancelFullScreen",
    change: "mozfullscreenchange",
    error: "mozfullscreenerror"
  },
  {
    enabled: "webkitFullscreenEnabled",
    element: "webkitCurrentFullScreenElement",
    request: "webkitRequestFullscreen",
    exit: "webkitExitFullscreen",
    change: "webkitfullscreenchange",
    error: "webkitfullscreenerror"
  },
  {
    enabled: "msFullscreenEnabled",
    element: "msFullscreenElement",
    request: "msRequestFullscreen",
    exit: "msExitFullscreen",
    change: "MSFullscreenChange",
    error: "MSFullscreenError"
  }
];
let ce = 0;
const qe = document;
for (let e = 0; e < ne.length; ++e)
  if (typeof qe[ne[e].enabled] < "u") {
    ce = e;
    break;
  }
const H = {
  element() {
    return qe[ne[ce].element];
  },
  enabled() {
    return qe[ne[ce].enabled];
  },
  isInFullscreen() {
    return H.element() !== null;
  },
  enter(e) {
    e[ne[ce].request]();
  },
  exit() {
    qe[ne[ce].exit]();
  },
  onChange(e) {
    return window.addEventListener(ne[ce].change, e);
  },
  onChangeRemove(e) {
    window.removeEventListener(ne[ce].change, e);
  },
  onError(e) {
    return window.addEventListener(ne[ce].error, e);
  }
};
var Un = /* @__PURE__ */ S('<button type=button class="hlv-button hlv-fullscreen-button">'), Cn = /* @__PURE__ */ S('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round class="icon icon-tabler icons-tabler-outline icon-tabler-minimize"><title>Exit fullscreen</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M15 19v-2a2 2 0 0 1 2 -2h2"></path><path d="M15 5v2a2 2 0 0 0 2 2h2"></path><path d="M5 15h2a2 2 0 0 1 2 2v2"></path><path d="M5 9h2a2 2 0 0 0 2 -2v-2">'), Fn = /* @__PURE__ */ S('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Fullscreen</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path><path d="M4 16v2a2 2 0 0 0 2 2h2"></path><path d="M16 4h2a2 2 0 0 1 2 2v2"></path><path d="M16 20h2a2 2 0 0 0 2 -2v-2">');
function ps(e) {
  const [t, s] = W(H.isInFullscreen());
  lt(() => {
    H.onChange(i);
  }), ke(() => {
    H.onChangeRemove(i);
  });
  const n = () => {
    H.isInFullscreen() ? H.exit() : H.enter(e.root);
  }, i = () => {
    s(H.isInFullscreen());
  };
  return (() => {
    var o = Un();
    return o.$$click = () => n(), M(o, (() => {
      var a = oe(() => !!t());
      return () => a() ? Cn() : Fn();
    })()), o;
  })();
}
K(["click"]);
var $n = /* @__PURE__ */ S("<div><div class=hlv-buttons><div class=hlv-buttons-left></div><div class=hlv-buttons-right>");
function Gn(e) {
  return (() => {
    var t = $n(), s = t.firstChild, n = s.firstChild, i = n.nextSibling;
    return M(i, P(gs, {
      get game() {
        return e.game;
      }
    }), null), M(i, P(ps, {
      active: !1,
      get root() {
        return e.root;
      }
    }), null), V(() => cs(t, e.class)), t;
  })();
}
const Es = cn({
  mode: X.FREE,
  time: 0,
  volume: 1,
  isPlaying: !1,
  isPaused: !1
});
function ut() {
  return un(Es);
}
var Xn = /* @__PURE__ */ S("<div class=hlv-time> / ");
function Hn(e) {
  const t = ut(), s = () => Tt(t.time), n = () => Tt(e.player.replay.length);
  return (() => {
    var i = Xn(), o = i.firstChild;
    return M(i, s, o), M(i, n, null), i;
  })();
}
var Wn = /* @__PURE__ */ S("<button type=button class=hlv-timeline><div class=hlv-timeline-ghostline></div><div class=hlv-timeline-line></div><div class=hlv-timeline-knob></div><div class=hlv-timeline-ghosttime>");
function jn(e) {
  const [t, s] = W(0), [n, i] = W(!1), [o, a] = W("0%"), [r, l] = W(0);
  lt(() => {
    const p = e.game.events.on("postupdate", () => {
      s(e.game.player.currentTime / e.game.player.replay.length);
    });
    ke(() => {
      p == null || p();
    });
  });
  const u = (p) => {
    const E = p.currentTarget.getClientRects()[0], v = 1 - (E.right - p.pageX) / (E.right - E.left);
    e.game.player.seekByPercent(v * 100), e.game.player.pause();
    const y = (w) => {
      const x = Math.max(0, Math.min(1 - (E.right - w.pageX) / (E.right - E.left), 1));
      e.game.player.seekByPercent(x * 100), e.game.player.pause();
    };
    window.addEventListener("mousemove", y), window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", y);
    }, {
      once: !0
    });
  }, c = (p) => {
    const E = p.currentTarget.getClientRects()[0], v = Math.max(0, Math.min(1 - (E.right - p.pageX) / (E.right - E.left), 1));
    n() && (a(`${v * 100}%`), l(e.game.player.replay.length * v));
  }, h = () => {
    i(!0);
  }, d = () => {
    i(!1);
  }, g = () => `${t() * 100}%`, m = () => `${100 - t() * 100}%`;
  return (() => {
    var p = Wn(), E = p.firstChild, v = E.nextSibling, y = v.nextSibling, w = y.nextSibling;
    return p.addEventListener("mouseleave", () => d()), p.addEventListener("mouseenter", () => h()), p.$$mousemove = (x) => c(x), p.$$mousedown = (x) => u(x), M(w, () => Tt(r())), V((x) => {
      var N = m(), F = g(), I = o();
      return N !== x.e && ((x.e = N) != null ? v.style.setProperty("right", N) : v.style.removeProperty("right")), F !== x.t && ((x.t = F) != null ? y.style.setProperty("left", F) : y.style.removeProperty("left")), I !== x.a && ((x.a = I) != null ? w.style.setProperty("left", I) : w.style.removeProperty("left")), x;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), p;
  })();
}
K(["mousedown", "mousemove"]);
var zn = /* @__PURE__ */ S("<div class=hlv-volume><div class=hlv-volume-ghostline></div><div class=hlv-volume-line></div><div class=hlv-volume-knob>");
function qn(e) {
  const t = ut(), s = (a) => {
    const r = a.currentTarget.getClientRects()[0], l = 1 - (r.right - a.pageX) / (r.right - r.left);
    e.game.soundSystem.setVolume(l);
    const u = (c) => {
      const h = Math.max(0, Math.min(1 - (r.right - c.pageX) / (r.right - r.left), 1));
      e.game.soundSystem.setVolume(h);
    };
    window.addEventListener("mousemove", u), window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", u);
    }, {
      once: !0
    });
  }, n = () => t.volume * 100, i = () => `${Math.min(95, Math.max(5, n()))}%`, o = () => `${Math.min(95, Math.max(5, 100 - n()))}%`;
  return (() => {
    var a = zn(), r = a.firstChild, l = r.nextSibling, u = l.nextSibling;
    return a.$$mousedown = (c) => s(c), V((c) => {
      var h = o(), d = i();
      return h !== c.e && ((c.e = h) != null ? l.style.setProperty("right", h) : l.style.removeProperty("right")), d !== c.t && ((c.t = d) != null ? u.style.setProperty("left", d) : u.style.removeProperty("left")), c;
    }, {
      e: void 0,
      t: void 0
    }), a;
  })();
}
K(["mousedown"]);
var Zn = /* @__PURE__ */ S('<button type=button class=hlv-button><svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Play</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M7 4v16l13 -8z">');
function Vn(e) {
  return (() => {
    var t = Zn();
    return t.$$click = () => e.onClick(), t;
  })();
}
K(["click"]);
var Yn = /* @__PURE__ */ S('<button type=button class=hlv-button><svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Pause</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z">');
function Jn(e) {
  return (() => {
    var t = Yn();
    return t.$$click = () => e.onClick(), t;
  })();
}
K(["click"]);
var Qn = /* @__PURE__ */ S('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Volume Full</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M15 8a5 5 0 0 1 0 8"></path><path d="M17.7 5a9 9 0 0 1 0 14"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5">');
function Kn() {
  return Qn();
}
var ei = /* @__PURE__ */ S('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round class="icon icon-tabler icons-tabler-outline icon-tabler-volume-2"><title>Volume Half</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M15 8a5 5 0 0 1 0 8"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5">');
function ti() {
  return ei();
}
var si = /* @__PURE__ */ S('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round class="icon icon-tabler icons-tabler-outline icon-tabler-volume-3"><title>Volume Mute</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path><path d="M16 10l4 4m0 -4l-4 4">');
function ni() {
  return si();
}
var ii = /* @__PURE__ */ S("<button type=button class=hlv-button>");
function ri(e) {
  const t = ut();
  return (() => {
    var s = ii();
    return s.$$click = () => e.onClick(), M(s, (() => {
      var n = oe(() => t.volume === 0);
      return () => n() ? P(ni, {}) : (() => {
        var i = oe(() => t.volume > 0.5);
        return () => i() ? P(Kn, {}) : P(ti, {});
      })();
    })()), s;
  })();
}
K(["click"]);
var oi = /* @__PURE__ */ S('<button type=button class=hlv-button><svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Speed Up</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M3 5v14l8 -7z"></path><path d="M14 5v14l8 -7z">');
function ai(e) {
  return (() => {
    var t = oi();
    return t.$$click = () => e.onClick(), t;
  })();
}
K(["click"]);
var li = /* @__PURE__ */ S('<button type=button class=hlv-button><svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><title>Speed Down</title><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z">');
function ci(e) {
  return (() => {
    var t = li();
    return t.$$click = () => e.onClick(), t;
  })();
}
K(["click"]);
var ui = /* @__PURE__ */ S("<div class=hlv-speed-center>u/s"), hi = /* @__PURE__ */ S("<div class=hlv-speed-wrapper>"), fi = /* @__PURE__ */ S("<div><div class=hlv-buttons><div class=hlv-buttons-left><div></div><div></div></div><div class=hlv-buttons-right>");
function di(e) {
  const t = ut(), [s, n] = W(0), i = () => {
    const d = e.game.player.state;
    d.speed && n(d.speed);
  };
  let o;
  const a = () => {
    i(), o = requestAnimationFrame(a);
  };
  a(), ke(() => cancelAnimationFrame(o));
  const r = () => {
    e.game.player.play();
  }, l = () => {
    e.game.player.pause();
  }, u = () => {
    e.game.player.speedDown();
  }, c = () => {
    e.game.player.speedUp();
  }, h = () => {
    e.game.soundSystem.toggleMute();
  };
  return [(() => {
    var d = hi();
    return M(d, P(kt, {
      get when() {
        return _t();
      },
      get children() {
        var g = ui(), m = g.firstChild;
        return M(g, () => s().toFixed(0), m), g;
      }
    })), V(() => d.classList.toggle("visible", !!e.visible)), d;
  })(), (() => {
    var d = fi(), g = d.firstChild, m = g.firstChild, p = m.firstChild;
    p.nextSibling;
    var E = m.nextSibling;
    return M(d, P(jn, {
      get game() {
        return e.game;
      }
    }), g), M(m, P(ci, {
      onClick: () => u()
    }), p), M(m, (() => {
      var v = oe(() => !!(t.isPaused || !t.isPlaying));
      return () => v() ? P(Vn, {
        onClick: () => r()
      }) : P(Jn, {
        onClick: () => l()
      });
    })(), p), M(m, P(ai, {
      onClick: () => c()
    }), p), M(m, P(ri, {
      onClick: () => h()
    }), null), M(m, P(qn, {
      get game() {
        return e.game;
      }
    }), null), M(m, P(Hn, {
      get player() {
        return e.game.player;
      }
    }), null), M(E, P(gs, {
      get game() {
        return e.game;
      }
    }), null), M(E, P(ps, {
      active: !0,
      get root() {
        return e.root;
      }
    }), null), V(() => cs(d, e.class)), d;
  })()];
}
var mi = /* @__PURE__ */ S("<div class=hlv-app><div class=hlv-title></div><button type=button class=hlv-screen>");
function gi(e) {
  let t = null, s;
  const [n, i] = W(e.game.title), [o, a] = W(!1), [r, l] = W(!1), [u, c] = W(!1), [h, d] = W(!1), [g, m] = ms({
    mode: e.game.mode,
    time: e.game.player.currentTime,
    volume: e.game.soundSystem.getVolume(),
    isPlaying: e.game.player.isPlaying,
    isPaused: e.game.player.isPaused
  });
  lt(() => {
    if (!t)
      return;
    const A = e.game, C = e.root;
    t.appendChild(A.getCanvas());
    const j = A.events.on("loadstart", () => l(!0)), $ = A.events.on("load", () => l(!1)), _ = A.events.on("modechange", (Ee) => m({
      mode: Ee
    })), B = A.events.on("titlechange", (Ee) => i(Ee)), Y = e.game.player.events.on("play", () => m({
      isPlaying: !0,
      isPaused: !1
    })), Oe = e.game.player.events.on("pause", () => m({
      isPlaying: !0,
      isPaused: !0
    })), De = e.game.player.events.on("stop", () => m({
      isPlaying: !1,
      isPaused: !1
    })), Be = e.game.soundSystem.events.on("volumeChange", () => {
      m({
        volume: e.game.soundSystem.getVolume()
      });
    });
    let ht;
    const Gt = () => {
      ht = setInterval(() => {
        m({
          time: e.game.player.currentTime
        });
      }, 100);
    }, ft = () => {
      clearInterval(ht);
    }, Ue = e.game.player.events.on("play", Gt), Ce = e.game.player.events.on("pause", ft), Fe = e.game.player.events.on("stop", ft), $e = e.game.player.events.on("seek", (Ee) => m({
      time: Ee
    }));
    window.addEventListener("click", v), window.addEventListener("keydown", w), document.addEventListener("pointerlockchange", p, !1), C.addEventListener("click", y), C.addEventListener("mouseover", x), C.addEventListener("mousemove", N), C.addEventListener("mouseout", F), C.addEventListener("contextmenu", E), ke(() => {
      j == null || j(), $ == null || $(), _ == null || _(), B == null || B(), Y == null || Y(), Oe == null || Oe(), De == null || De(), Be == null || Be(), Ue == null || Ue(), Ce == null || Ce(), Fe == null || Fe(), $e == null || $e(), e.root.removeEventListener("click", y), window.removeEventListener("click", v), window.removeEventListener("keydown", w), document.removeEventListener("pointerlockchange", p, !1), e.root.removeEventListener("mouseover", x), e.root.removeEventListener("mousemove", N), e.root.removeEventListener("mouseout", F), e.root.removeEventListener("contextmenu", E);
    });
  });
  const p = () => {
    document.pointerLockElement === e.root ? e.game.pointerLocked = !0 : e.game.pointerLocked = !1;
  }, E = (A) => {
    A.preventDefault();
  }, v = (A) => {
    A.target.closest(".hlv-app") || a(!1);
  }, y = () => {
    a(!0), I();
  }, w = (A) => {
    if (o())
      switch (A.code) {
        case "KeyF": {
          H.isInFullscreen() ? H.exit() : H.enter(e.root), I();
          break;
        }
        case "KeyM": {
          e.game.soundSystem.toggleMute(), I();
          break;
        }
        case "ArrowUp": {
          e.game.soundSystem.setVolume(e.game.soundSystem.getVolume() + 0.05), I();
          break;
        }
        case "ArrowDown": {
          e.game.soundSystem.setVolume(e.game.soundSystem.getVolume() - 0.05), I();
          break;
        }
        case "KeyJ":
        case "ArrowLeft": {
          e.game.player.seek(e.game.player.currentTime - 5), I();
          break;
        }
        case "KeyL":
        case "ArrowRight": {
          e.game.player.seek(e.game.player.currentTime + 5), I();
          break;
        }
        case "KeyK":
        case "Space": {
          if (g.mode !== X.REPLAY)
            return;
          !e.game.player.isPlaying || e.game.player.isPaused ? e.game.player.play() : e.game.player.pause();
          break;
        }
      }
  }, x = () => {
    c(!0), I();
  }, N = () => {
    u() && !H.isInFullscreen() && I();
  }, F = () => {
    c(!1), d(!1), clearTimeout(s), s = void 0;
  }, I = () => {
    h() || d(!0), clearTimeout(s), s = setTimeout(() => {
      d(!1), s = void 0;
    }, 2e3);
  }, b = () => {
    switch (g.mode) {
      case X.REPLAY: {
        const A = e.game.player;
        !A.isPlaying || A.isPaused ? A.play() : A.pause();
        break;
      }
      case X.FREE: {
        e.root.requestPointerLock();
        break;
      }
    }
  }, k = () => {
    H.isInFullscreen() ? H.exit() : H.enter(e.root);
  };
  return P(Es.Provider, {
    value: g,
    get children() {
      var A = mi(), C = A.firstChild, j = C.nextSibling;
      return M(C, n), M(A, P(Sn, {
        get game() {
          return e.game;
        },
        get visible() {
          return r();
        }
      }), j), j.$$dblclick = () => k(), j.$$click = () => b(), yn(($) => {
        t = $;
      }, j), M(A, P(kt, {
        get when() {
          return g.mode === X.FREE;
        },
        get children() {
          return P(Gn, {
            class: "hlv-controls",
            get game() {
              return e.game;
            },
            get root() {
              return e.root;
            }
          });
        }
      }), null), M(A, P(kt, {
        get when() {
          return g.mode === X.REPLAY;
        },
        get children() {
          return P(di, {
            class: "hlv-controls",
            get game() {
              return e.game;
            },
            get root() {
              return e.root;
            },
            get visible() {
              return u();
            }
          });
        }
      }), null), V(($) => {
        var _ = !!h(), B = g.mode === X.FREE, Y = g.mode === X.REPLAY;
        return _ !== $.e && A.classList.toggle("visible", $.e = _), B !== $.t && A.classList.toggle("mode-free", $.t = B), Y !== $.a && A.classList.toggle("mode-replay", $.a = Y), $;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), A;
    }
  });
}
K(["click", "dblclick"]);
class pi {
  constructor(t, s) {
    f(this, "game");
    f(this, "rootNode");
    this.game = t, this.rootNode = s;
  }
  getRootNode() {
    return this.rootNode;
  }
  draw() {
    bn(() => {
      const t = this;
      return P(gi, {
        get game() {
          return t.game;
        },
        get root() {
          return t.rootNode;
        }
      });
    }, this.rootNode);
  }
}
class Ts {
  constructor(t) {
    f(this, "game");
    this.game = t;
  }
  load(t) {
    this.game.load(t);
  }
  setTitle(t) {
    this.game.setTitle(t);
  }
  getTitle() {
    return this.game.getTitle();
  }
}
f(Ts, "VERSION", "0.8.2");
var Mt;
((e) => {
  function t(s, n) {
    const i = document.querySelector(s);
    if (!i)
      return null;
    const o = Ve.init(n), a = Ft.init(o);
    if (a.status === "success") {
      const r = a.game;
      return new pi(r, i).draw(), r.draw(), new Ts(r);
    }
    return null;
  }
  e.init = t;
})(Mt || (Mt = {}));
typeof window < "u" && Object.assign(window, { HLViewer: Mt });
export {
  Mt as HLViewer
};
//# sourceMappingURL=hlviewer.js.map
