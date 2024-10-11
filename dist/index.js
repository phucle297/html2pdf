var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const htmlToPdf = (element, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { heightPerPage = 840, fileName = "document.pdf", html2canvasOptions, jsPDFOptions, } = options;
    if (!element)
        return;
    const CANVAS_CHROME_FF_LIMIT = 32767;
    const CANVAS_SAFARI_LIMIT = 4096;
    element.style.gap = "0px";
    const MAX_CANVAS_HEIGHT = navigator.userAgent.includes("Chrome") ||
        navigator.userAgent.includes("Firefox")
        ? (CANVAS_CHROME_FF_LIMIT % heightPerPage) * heightPerPage
        : (CANVAS_SAFARI_LIMIT % heightPerPage) * heightPerPage;
    (_a = options.onBeforeCapture) === null || _a === void 0 ? void 0 : _a.call(options);
    try {
        const pdf = new jsPDF(Object.assign({ orientation: "l", unit: "px", format: [element.offsetWidth, heightPerPage], compress: true }, jsPDFOptions));
        const totalHeight = element.scrollHeight;
        const totalWidth = element.scrollWidth;
        let capturedHeight = 0;
        while (capturedHeight < totalHeight) {
            const remainingHeight = totalHeight - capturedHeight;
            const captureHeight = Math.min(remainingHeight, MAX_CANVAS_HEIGHT);
            const canvas = yield html2canvas(element, Object.assign({ logging: false, windowWidth: totalWidth, windowHeight: totalHeight, x: 0, y: capturedHeight, width: totalWidth, height: captureHeight }, html2canvasOptions));
            const contentWidth = canvas.width;
            let contentHeight = canvas.height;
            const pageHeight = (contentWidth / element.offsetWidth) * heightPerPage;
            let position = 0;
            const imgWidth = element.offsetWidth;
            const imgHeight = (element.offsetWidth / contentWidth) * contentHeight;
            const imgData = canvas.toDataURL("image/jpeg");
            if (contentHeight < pageHeight) {
                pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, "FAST");
            }
            else {
                while (contentHeight > 0) {
                    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
                    contentHeight -= pageHeight;
                    position -= heightPerPage;
                    if (contentHeight > 0) {
                        pdf.addPage();
                    }
                }
            }
            capturedHeight += captureHeight;
        }
        pdf.save(fileName);
        (_b = options.onSuccess) === null || _b === void 0 ? void 0 : _b.call(options);
    }
    catch (error) {
        (_c = options.onError) === null || _c === void 0 ? void 0 : _c.call(options, error);
    }
    finally {
        (_d = options.onSettled) === null || _d === void 0 ? void 0 : _d.call(options);
    }
});
export default htmlToPdf;
