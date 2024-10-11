import { Options as THtml2canvasOptions } from "html2canvas";
import { jsPDFOptions as TJsPDFOptions } from "jspdf";
type TGeneratePDFOptions = {
    fileName?: string;
    heightPerPage?: number;
    html2canvasOptions?: Partial<THtml2canvasOptions>;
    jsPDFOptions?: Partial<TJsPDFOptions>;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    onSettled?: () => void;
    onBeforeCapture?: () => void;
};
declare const htmlToPdf: (element: HTMLElement, options: TGeneratePDFOptions) => Promise<void>;
export default htmlToPdf;
