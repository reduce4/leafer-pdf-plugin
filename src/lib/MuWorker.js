import registerPromiseWorker from 'promise-worker/register';
import Module from './libmupdf'

const muModulePromise = Module()
const muModuleFunctions = muModulePromise.then(muModule => {
    const openDocumentFromBuffer = muModule.cwrap('openDocumentFromBuffer', null, ['number', 'number'])
    const drawPageAsSVG = muModule.cwrap("drawPageAsSVG", "string", ["number", "number"])
    return new Map([
        ["openDocumentFromBuffer", async (url) => {
            const file = await fetch(url);
            const data = await file.arrayBuffer();
            const src = new Uint8Array(data);
            const ptr = muModule._malloc(src.byteLength);
            muModule.HEAPU8.set(src, ptr);
            return openDocumentFromBuffer(ptr, src.byteLength);
        }],
        ["drawPageAsSVG", (pageNo, textAsText) =>
            drawPageAsSVG(pageNo, textAsText)
                .replace('viewBox', 'buffered-rendering="static" viewBox')
                .replaceAll('font_', `font_${pageNo}_`)
                .replaceAll('<mask id="ma', `<mask id="ma_${pageNo}_`)
                .replaceAll('"url(#ma', `"url(#ma_${pageNo}_`)
                .replaceAll('<clipPath id="cp', `<clipPath id="cp_${pageNo}_`)
                .replaceAll('"url(#cp', `"url(#cp_${pageNo}_`)
        ],
        ["documentTitle", muModule.cwrap("documentTitle", "string", [])],
        ["countPages", muModule.cwrap("countPages", "number", [])],
        ["pageWidth", muModule.cwrap("pageWidth", "number", ["number"])],
        ["pageWidthDpi", muModule.cwrap("pageWidthDpi", "number", ["number", "number"])],
        ["pageHeight", muModule.cwrap("pageHeight", "number", ["number"])],
        ["pageHeightDpi", muModule.cwrap("pageHeightDpi", "number", ["number", "number"])],
        ["loadOutline", muModule.cwrap("loadOutline", "string", [])],
        ["pageText", muModule.cwrap("pageText", "string", ["number", "number"])],
    ]);
})

registerPromiseWorker(async ([name, args]) => {
    const muFunctions = await muModuleFunctions;
    const func = muFunctions.get(name)
    return func(...args)
});