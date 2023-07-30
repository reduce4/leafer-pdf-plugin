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
    async _init(url) {
        await this.loadModule();
        await this.mu_openDocumentFromBuffer(url);
        return this;
    }
}

export default MuBackend;