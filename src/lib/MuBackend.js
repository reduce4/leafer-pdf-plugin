import PromiseWorker from 'promise-worker'
class MuWrapper {
    async loadModule() {
        const worker = new Worker(new URL('./MuWorker.js', import.meta.url), {
            type: 'module'
        });
        this.mu_worker = new PromiseWorker(worker);
    }
    mu_worker;
    mu_openDocumentFromBuffer = (url) => {
        return this.mu_worker.postMessage(["openDocumentFromBuffer", [url]]);
    }
    mu_documentTitle = () => {
        return this.mu_worker.postMessage(["documentTitle", []])
    }
    mu_countPages = () => {
        return this.mu_worker.postMessage(["countPages", []])
    }
    mu_pageWidth = (pageNo) => {
        return this.mu_worker.postMessage(["pageWidth", [pageNo]])
    }
    mu_pageWidthDpi = (pageNo, dpi) => {
        return this.mu_worker.postMessage(["pageWidthDpi", [pageNo, dpi]])
    }
    mu_pageHeight = (pageNo) => {
        return this.mu_worker.postMessage(["pageHeight", [pageNo]])
    }
    mu_pageHeightDpi = (pageNo, dpi) => {
        return this.mu_worker.postMessage(["pageHeightDpi", [pageNo, dpi]])
    }
    mu_outline = () => {
        return this.mu_worker.postMessage(["loadOutline", []])
    }
    mu_drawPageAsSvg = (pageNo, textAsText) => {
        return this.mu_worker.postMessage(["drawPageAsSVG", [pageNo, textAsText]])
    }
    mu_pageText = (pageNo, dpi) => {
        return this.mu_worker.postMessage(["pageText", [pageNo, dpi]])
    }
}


class MuBackend extends MuWrapper {
    pageInfo;
    render;
    interact;
    async _init(url) {
        await this.loadModule();
        await this.mu_openDocumentFromBuffer(url);
        await this._initPages("No name");
        await this._initRender();
        await this._initInteract();
    }


    async _initPages(_title) {
        const pagesCount = await this.mu_countPages();
        const widths = new Uint32Array(pagesCount + 1);
        const heights = new Uint32Array(pagesCount + 1);
        let title = await this.mu_documentTitle()
        if (title) title = _title;
        for (var i = 1; i <= pagesCount; i++) {
            const width = await this.mu_pageWidth(i);
            const height = await this.mu_pageHeight(i);
            widths[i] = width;
            heights[i] = height;
        }
        this.pageInfo = {
            docName: title,
            pagesCount,
            pagesWidth: widths,
            pagesHeight: heights
        }
    }
    async _initRender() {
        this.render = {
            renderSVG: async (pageNo) => await this.mu_drawPageAsSvg(pageNo, 0),
            renderText: async (pageNo, dpi) => await this.mu_pageText(pageNo, dpi)
        }
    }
    async _initInteract() {
        this.interact = {
            getOutline: async () => {
                const outline = await this.mu_outline()
                if (outline == null || outline == "") {
                    return {}
                }
                return JSON.parse(outline)
            }
        }
    }
}

export default MuBackend;