import {
  IGroup,
  IImage,
  ILeaferCanvas,
  IRenderOptions,
} from "@leafer-ui/interface";
import MuBackend from "./lib/MuBackend.js";
import { Group, Image } from "leafer-ui";

interface AsyncOperation {
  (): Promise<any>;
}
interface AsyncOperationGoPage {
  (pageNum: number): Promise<any>;
}
interface RetriveBlobUrl {
  (): string;
}

export interface LoadParams {
  page: number; //加载第几页
  dpi: number; //文档dpi
  zoomLevels: Array<number>; //文档缩放级别
  zoom: number; //文档初始的缩放率
}

interface AsyncOperationLoad {
  (url: string, loadParams?: LoadParams): Promise<IPdfLoader>;
}

interface PDFDocumentOutline {
  title: string;
  page: number;
  x: number;
  y: number;
}

type IPdfLoader = {
  pages: number; // PDF总页数
  current: number; // 当前为第几页
  pageWidth: number; //当前页面的宽度
  pageHeight: number; //当前页面的高度
  documentTitle: string; //文档的名字
  dpi: number; //文档的dpi
  zoom: number; //当前文档的缩放比例
  getBlobUrl: RetriveBlobUrl; //取得文档的blob url
  outline: Array<PDFDocumentOutline>; //文档的大纲
  next: AsyncOperation; //下一页
  prev: AsyncOperation; //上一页
  enLarge: AsyncOperation; //放大
  shrink: AsyncOperation; //缩小
  goTo: AsyncOperationGoPage; //跳转到指定页
  load: AsyncOperationLoad; //异步加载PDF处理后端
} & IGroup;

class PdfLoader extends Group implements IPdfLoader {
  public dpi: number; //文档dpi
  public pages: number; // PDF总页数
  private _current: number; // 当前为第几页
  public pageWidth: number; //当前页面的宽度
  public pageHeight: number; //当前页面的高度
  public loading: boolean; //PDF后端是否处于加载状态
  public documentTitle: string; //PDF文档的名字
  private _zoom: number; //PDF文档当前缩放率
  public zoomLevels: Array<number>; //PDF文档缩放级别
  private _outline: Array<PDFDocumentOutline>; //PDF文档的大纲
  public backend: any; //PDF后端的能力
  private _imgData: string; //图片的数据
  constructor() {
    super();
  }
  removeAll(): void {
    throw new Error("Method not implemented.");
  }
  __drawAfterFill?(canvas: ILeaferCanvas, options: IRenderOptions): void {
    throw new Error("Method not implemented.");
  }
  isApp?: boolean | undefined;
  __renderTime?: number | undefined;

  public getBlobUrl() {
    const blob = new Blob([this._imgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  public async enLarge() {
    const idx = this.zoomLevels.indexOf(this.zoom) + 1;
    if (idx > this.zoomLevels.length - 1) {
      return;
    }
    this.zoom = this.zoomLevels[idx];
  }
  public async shrink() {
    const idx = this.zoomLevels.indexOf(this.zoom) - 1;
    if (idx < 0) {
      return;
    }
    this.zoom = this.zoomLevels[idx];
  }

  get zoom(): number {
    return this._zoom;
  }

  private set zoom(v: number) {
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
      .finally(() => {});
    this._zoom = v;
  }

  public get outline(): Array<PDFDocumentOutline> {
    return this._outline;
  }
  private set outline(v: string) {
    const outlines: Array<PDFDocumentOutline> = JSON.parse(v);
    this._outline = outlines;
  }
  async load(url: string, loadParams?: LoadParams): Promise<IPdfLoader> {
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
    this.set({
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
    });
    //初始化图片对象
    // const image = new Image({
    //   width: this.pageWidth,
    //   height: this.pageHeight,
    // });
    // this.add(image);
    this.imgData = await muBackend.mu_drawPageAsSvg(this.current);
    return this;
  }

  get imgData() {
    return this._imgData;
  }

  set imgData(v: string) {
    this._imgData = v;
    for (var c of this.children) {
      this.remove(c);
    }
    const image = new Image({
      width: this.pageWidth,
      height: this.pageHeight,
      url: this.getBlobUrl(),
    });
    console.log(this.getBlobUrl());
    this.add(image);
  }

  public set current(v: number) {
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
      .finally(() => {});
  }
  public get current() {
    return this._current;
  }
  public async next() {
    this.current = this.current + 1;
  }
  public async prev() {
    this.current = this.current - 1;
  }
  public async goTo(pageNo: number) {
    this.backend.current = pageNo;
  }
}
export { IPdfLoader };
export default PdfLoader;
