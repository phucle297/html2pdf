# HTML to PDF Converter
A package that converts HTML to PDF using jsPDF and html2canvas, optimized for handling large HTML documents.

## Features
- Convert HTML to PDF with high fidelity
- Efficiently handles large HTML documents
- Built on top of jsPDF and html2canvas
- Easy to use API
- Customizable options
## How it works
This package uses html2canvas to render the HTML content to a canvas element, which is then converted to a PDF document using jsPDF.
The challenge with large HTML documents is that while html2canvas can handle large HTML elements, browser limitations often prevent rendering these large elements to a single canvas. An approach of cutting the HTML element page by page for rendering leads to poor performance.
Our package addresses this by reducing the number of calls to html2canvas as much as possible. It achieves this by splitting the canvas element when it reaches browser limitations, rather than splitting the HTML itself. This approach significantly improves performance for large documents.

### Browser limitations:
> Chrome: Maximum height/width: 32,767 pixels Maximum area: 268,435,456 pixels (e.g., 16,384 x 16,384)
>
> Firefox: Maximum height/width: 32,767 pixels Maximum area: 472,907,776 pixels (e.g., 22,528 x 20,992)
>
> Internet Explorer: Maximum height/width: 8,192 pixels Maximum area: N/A
>
> Safari: Maximum height/width: 4,096 pixels Maximum area: 16,777,216 pixels

## Package limitations
For optimal performance, this package splits the canvas without regard for specific element boundaries. As a result, you need to ensure that all pages have the same height. If you have multiple pages with different heights, we recommend pre-processing the HTML element to standardize page heights before using this package.
## Installation
`npm install @permees/html2pdf`

## Usage
```
import { htmlToPdf } from '@permees/html2pdf';


const Component = () => {
  const ref = useRef(null)
  const onClick = () => {
    htmlToPdf(reportContainerRef.current, {
      fileName: `InsightReport_${dayjs()}.pdf`,
      html2canvasOptions: {
        scale: 2,
        //... add any other html2canvas options
      },
      jsPDFOptions: {
        orientation: 'landscape',
        //... add any other jsPDF options
      },
      heightPerPage: 840,
      onBeforeCapture: () => {
        const style = document.createElement('style')
        document.head.append(style)
        style.sheet?.insertRule('body p { display: inline-block; font-size: 12px; }')
      },
      onSuccess: () => {
        toast.success('Report downloaded successfully')
      },
      onError: () => {
        toast.error('Error downloading report')
      },
      onSettled: () => {
        toast.info('The process has been completed')
      },
    })
  }
  return (
    <div>
      <div ref={ref}>
        <h1>HTML to PDF Converter</h1>
        <p>This package converts HTML to PDF using @permees/html2pdf.</p>
      </div>
      <button onClick={onClick}>Download PDF</button>
    </div>
  )
}
```

## API
- **element: HTMLElement**: The HTML element to be converted to PDF
- **options: TGeneratePDFOptions**: An object containing the following properties:
### TGeneratePDFOptions
```
import { Options as THtml2canvasOptions } from "html2canvas";
import { jsPDFOptions as TJsPDFOptions } from "jspdf";
type TGeneratePDFOptions = {
  fileName?: string;
  heightPerPage?: number;
  html2canvasOptions?: Partial<THtml2canvasOptions>;
  jsPDFOptions?: Partial<TJsPDFOptions>;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
  onBeforeCapture?: () => void;
};
```
  - **fileName**: The name of the PDF file to be downloaded
  - **html2canvasOptions**: Options to be passed to html2canvas
  - **jsPDFOptions**: Options to be passed to jsPDF
  - **heightPerPage**: The height of each page in the PDF document
  - **onBeforeCapture**: A callback function to be executed before capturing the HTML element
  - **onSuccess**: A callback function to be executed after the PDF has been successfully generated
  - **onError**: A callback function to be executed if an error occurs during PDF generation
  - **onSettled**: A callback function to be executed after the PDF generation process has been completed


## Why choose this package?
Unlike several other libraries with similar functionality, this package is specifically designed to handle large HTML documents efficiently. It employs optimized rendering techniques to ensure smooth conversion of complex and extensive HTML content to PDF format.

## License
This project is licensed under the MIT License