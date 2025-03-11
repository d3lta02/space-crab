let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {string} message
 */
export function log_to_proof_area(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.log_to_proof_area(ptr0, len0);
}

/**
 * @param {boolean} success
 * @param {string} hash
 */
export function show_sp1_proof_result(success, hash) {
    const ptr0 = passStringToWasm0(hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.show_sp1_proof_result(success, ptr0, len0);
}

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const GameState = Object.freeze({
    NotStarted: 0, "0": "NotStarted",
    Playing: 1, "1": "Playing",
    Paused: 2, "2": "Paused",
    GameOver: 3, "3": "GameOver",
});

const GameManagerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_gamemanager_free(ptr >>> 0, 1));

export class GameManager {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GameManager.prototype);
        obj.__wbg_ptr = ptr;
        GameManagerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GameManagerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gamemanager_free(ptr, 0);
    }
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {HTMLImageElement} crab_img
     * @param {HTMLImageElement} crab_shield_img
     * @param {HTMLImageElement} crab_double_img
     * @param {HTMLImageElement} yellow_star_img
     * @param {HTMLImageElement} pink_star_img
     * @param {HTMLImageElement} purple_star_img
     * @param {HTMLImageElement} rock_img
     * @param {HTMLImageElement} shield_img
     * @param {HTMLImageElement} double_points_img
     * @param {HTMLImageElement} extra_life_img
     * @param {HTMLImageElement} slowdown_img
     * @param {HTMLAudioElement} star_sound
     * @param {HTMLAudioElement} rock_sound
     * @param {HTMLAudioElement} shield_hit_sound
     * @returns {GameManager}
     */
    static new(canvas, crab_img, crab_shield_img, crab_double_img, yellow_star_img, pink_star_img, purple_star_img, rock_img, shield_img, double_points_img, extra_life_img, slowdown_img, star_sound, rock_sound, shield_hit_sound) {
        const ret = wasm.gamemanager_new(canvas, crab_img, crab_shield_img, crab_double_img, yellow_star_img, pink_star_img, purple_star_img, rock_img, shield_img, double_points_img, extra_life_img, slowdown_img, star_sound, rock_sound, shield_hit_sound);
        return GameManager.__wrap(ret);
    }
    /**
     * @param {KeyboardEvent} event
     */
    handle_key_press(event) {
        wasm.gamemanager_handle_key_press(this.__wbg_ptr, event);
    }
    start() {
        wasm.gamemanager_start(this.__wbg_ptr);
    }
    stop() {
        wasm.gamemanager_stop(this.__wbg_ptr);
    }
    restart() {
        wasm.gamemanager_restart(this.__wbg_ptr);
    }
    /**
     * @param {number} delta_time
     * @returns {boolean}
     */
    update(delta_time) {
        const ret = wasm.gamemanager_update(this.__wbg_ptr, delta_time);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_score() {
        const ret = wasm.gamemanager_get_score(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_lives() {
        const ret = wasm.gamemanager_get_lives(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_game_over() {
        const ret = wasm.gamemanager_is_game_over(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {GameState}
     */
    get_game_state() {
        const ret = wasm.gamemanager_get_game_state(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean} enabled
     */
    set_sound_enabled(enabled) {
        wasm.gamemanager_set_sound_enabled(this.__wbg_ptr, enabled);
    }
    /**
     * @returns {number}
     */
    get_yellow_stars_count() {
        const ret = wasm.gamemanager_get_yellow_stars_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_pink_stars_count() {
        const ret = wasm.gamemanager_get_pink_stars_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_purple_stars_count() {
        const ret = wasm.gamemanager_get_purple_stars_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_game_time() {
        const ret = wasm.gamemanager_get_game_time(this.__wbg_ptr);
        return ret >>> 0;
    }
    show_sp1_proof_interface() {
        const ret = wasm.gamemanager_show_sp1_proof_interface(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    hide_sp1_proof_interface() {
        const ret = wasm.gamemanager_hide_sp1_proof_interface(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

export function __wbg_appendChild_8204974b7328bf98() { return handleError(function (arg0, arg1) {
    const ret = arg0.appendChild(arg1);
    return ret;
}, arguments) };

export function __wbg_arc_c0ea16371fccfef1() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.arc(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_beginPath_0198cb08b8521814(arg0) {
    arg0.beginPath();
};

export function __wbg_call_672a4d21634d4a24() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_clearRect_8e4ba7ea0e06711a(arg0, arg1, arg2, arg3, arg4) {
    arg0.clearRect(arg1, arg2, arg3, arg4);
};

export function __wbg_createElement_8c9931a732ee2fea() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_document_d249400bd7bd996d(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_drawImage_c8968fd5fac937f5() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawImage(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_eval_e10dc02e9547f640() { return handleError(function (arg0, arg1) {
    const ret = eval(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments) };

export function __wbg_fillRect_c38d5d56492a2368(arg0, arg1, arg2, arg3, arg4) {
    arg0.fillRect(arg1, arg2, arg3, arg4);
};

export function __wbg_fillText_2a0055d8531355d1() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
}, arguments) };

export function __wbg_getContext_e9cf379449413580() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getElementById_f827f0d6648718a8(arg0, arg1, arg2) {
    const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_getHours_70451b8de3ce8638(arg0) {
    const ret = arg0.getHours();
    return ret;
};

export function __wbg_getMinutes_e793d718371e18f7(arg0) {
    const ret = arg0.getMinutes();
    return ret;
};

export function __wbg_getSeconds_755197b634cca692(arg0) {
    const ret = arg0.getSeconds();
    return ret;
};

export function __wbg_height_838cee19ba8597db(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_instanceof_CanvasRenderingContext2d_df82a4d3437bf1cc(arg0) {
    let result;
    try {
        result = arg0 instanceof CanvasRenderingContext2D;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Window_def73ea0955fc569(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_key_7b5c6cb539be8e13(arg0, arg1) {
    const ret = arg1.key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_log_f7d89805cd3c84d0(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export function __wbg_new0_f788a2397c7ca929() {
    const ret = new Date();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_newnoargs_105ed471475aaf50(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_parentElement_be28a1a931f9c9b7(arg0) {
    const ret = arg0.parentElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_play_f6ec5fc4e84b0d26() { return handleError(function (arg0) {
    const ret = arg0.play();
    return ret;
}, arguments) };

export function __wbg_random_3ad904d98382defe() {
    const ret = Math.random();
    return ret;
};

export function __wbg_removeChild_841bf1dc802c0a2c() { return handleError(function (arg0, arg1) {
    const ret = arg0.removeChild(arg1);
    return ret;
}, arguments) };

export function __wbg_setAttribute_2704501201f15687() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setfillStyle_4f8f616d87dea4df(arg0, arg1) {
    arg0.fillStyle = arg1;
};

export function __wbg_setfont_42a163ef83420b93(arg0, arg1, arg2) {
    arg0.font = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setid_d1300d55a412791b(arg0, arg1, arg2) {
    arg0.id = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlineWidth_ec730c524f09baa9(arg0, arg1) {
    arg0.lineWidth = arg1;
};

export function __wbg_setstrokeStyle_88eaacb0e9a0c645(arg0, arg1) {
    arg0.strokeStyle = arg1;
};

export function __wbg_settextContent_d29397f7b994d314(arg0, arg1, arg2) {
    arg0.textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_88a902d13a557d07() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_37c5d418e4bf5819() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_5de37043a91a9c40() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_stroke_c8939d3873477ffa(arg0) {
    arg0.stroke();
};

export function __wbg_width_5dde457d606ba683(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

