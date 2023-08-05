import MuBackend from "./lib/MuBackend.js";
import { Group, Image } from "leafer-ui";



class PdfLoader {
  dpi; //文档dpi
  pages; // PDF总页数
  _current; // 当前为第几页
  pageWidth; //当前页面的宽度
  pageHeight; //当前页面的高度
  loading; //PDF后端是否处于加载状态
  documentTitle; //PDF文档的名字
  _zoom; //PDF文档当前缩放率
  zoomLevels; //PDF文档缩放级别
  _outline; //PDF文档的大纲
  backend; //PDF后端的能力
  _imgData; //图片的数据
  _image; //当前缓存的图片
  _group; //当前缓存的group

  constructor() {
    this._group = new Group();
  }

  getBlobUrl() {
    const blob = new Blob([this._imgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  async enLarge() {
    const idx = this.zoomLevels.indexOf(this.zoom) + 1;
    if (idx > this.zoomLevels.length - 1) {
      return;
    }
    this.zoom = this.zoomLevels[idx];
  }
  async shrink() {
    const idx = this.zoomLevels.indexOf(this.zoom) - 1;
    if (idx < 0) {
      return;
    }
    this.zoom = this.zoomLevels[idx];
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(v) {
    if (v == this._zoom) {
      return;
    }
    const di = ((v * this.dpi) / this._zoom) | 0;
    this.dpi = di;
    let that = this;
    const promises = [
      this.backend.mu_pageWidthDpi(that.pages > 1 ? 2 : 1, di),
      this.backend.mu_pageHeightDpi(that.pages > 1 ? 2 : 1, di),
    ];
    Promise.all(promises)
      .then(([width, height]) => {
        that.pageWidth = width;
        that.pageHeight = height;
      })
      .finally(() => {
        that._image.set({
          width: this.pageWidth,
          height: this.pageHeight
        })
      });
    this._zoom = v;
  }

  get outline() {
    return this._outline;
  }
  set outline(v) {
    const outlines = JSON.parse(v);
    this._outline = outlines;
  }
  async load(url, loadParams) {
    const muBackend = new MuBackend();
    this.backend = await muBackend._init(url);
    //初始化PDF的总页码
    this.pages = await muBackend.mu_countPages();
    this.documentTitle = await muBackend.mu_documentTitle();
    this.outline = await muBackend.mu_outline();
    this.current = loadParams?.page ?? 1;
    this._zoom = loadParams?.zoom ?? 100;
    this.zoomLevels = loadParams?.zoomLevels ?? [50, 100, 200];
    this.dpi = loadParams?.dpi ?? 96;
    this._group.set({
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
    });
    //初始化图片对象
    const image = new Image();
    this._group.add(image);
    this._image = image;
    this.imgData = await muBackend.mu_drawPageAsSvg(this.current);
    return this;
  }

  get imgData() {
    return this._imgData;
  }

  set imgData(v) {
    this._imgData = v;
    this._image.set({
      width: this.pageWidth,
      height: this.pageHeight,
      url: this.getBlobUrl(),
    });
  }

  set current(v) {
    if (v < 1 || v > this.pages) {
      return;
    }
    this._current = v;
    const promises = [
      this.backend.mu_pageWidth(v),
      this.backend.mu_pageHeight(v),
      this.backend.mu_drawPageAsSvg(v),
    ];
    let that = this;
    Promise.all(promises)
      .then(([width, height, imgData]) => {
        that.pageWidth = width;
        that.pageHeight = height;
        that.imgData = imgData;
      })
      .finally(() => { });
  }
  get current() {
    return this._current;
  }
  async next() {
    this.current = this.current + 1;
  }
  async prev() {
    this.current = this.current - 1;
  }
  async goTo(pageNo) {
    this.current = pageNo;
  }
}
export default PdfLoader;
