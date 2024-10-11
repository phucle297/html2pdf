import html2canvas, { Options as THtml2canvasOptions } from "html2canvas";
import jsPDF, { jsPDFOptions as TJsPDFOptions } from "jspdf";

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

const htmlToPdf = async (
  element: HTMLElement,
  options: TGeneratePDFOptions
) => {
  const {
    heightPerPage = 840,
    fileName = "document.pdf",
    html2canvasOptions,
    jsPDFOptions,
  } = options;
  if (!element) return;
  const CANVAS_CHROME_FF_LIMIT = 32_767;
  const CANVAS_SAFARI_LIMIT = 4096;
  element.style.gap = "0px";

  const MAX_CANVAS_HEIGHT =
    navigator.userAgent.includes("Chrome") ||
    navigator.userAgent.includes("Firefox")
      ? (CANVAS_CHROME_FF_LIMIT % heightPerPage) * heightPerPage
      : (CANVAS_SAFARI_LIMIT % heightPerPage) * heightPerPage;

  options.onBeforeCapture?.();
  try {
    const pdf = new jsPDF({
      orientation: "l",
      unit: "px",
      format: [element.offsetWidth, heightPerPage],
      compress: true,
      ...jsPDFOptions,
    });

    const totalHeight = element.scrollHeight;
    const totalWidth = element.scrollWidth;
    let capturedHeight = 0;

    while (capturedHeight < totalHeight) {
      const remainingHeight = totalHeight - capturedHeight;
      const captureHeight = Math.min(remainingHeight, MAX_CANVAS_HEIGHT);

      const canvas = await html2canvas(element, {
        logging: false,
        windowWidth: totalWidth,
        windowHeight: totalHeight,
        x: 0,
        y: capturedHeight,
        width: totalWidth,
        height: captureHeight,
        ...html2canvasOptions,
      });

      const contentWidth = canvas.width;
      let contentHeight = canvas.height;
      const pageHeight = (contentWidth / element.offsetWidth) * heightPerPage;
      let position = 0;
      const imgWidth = element.offsetWidth;
      const imgHeight = (element.offsetWidth / contentWidth) * contentHeight;
      const imgData = canvas.toDataURL("image/jpeg");

      if (contentHeight < pageHeight) {
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
      } else {
        while (contentHeight > 0) {
          pdf.addImage(
            imgData,
            "JPEG",
            0,
            position,
            imgWidth,
            imgHeight,
            undefined,
            "FAST"
          );
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

    options.onSuccess?.();
  } catch (error) {
    options.onError?.(error);
  } finally {
    options.onSettled?.();
  }
};

export default htmlToPdf;
