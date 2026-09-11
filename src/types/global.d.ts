declare module "*.css";

declare module "html5-qrcode" {
  export class Html5Qrcode {
    constructor(elementId: string, verbose?: boolean);
    start(
      cameraIdOrConfig: any,
      configuration: any,
      qrCodeSuccessCallback: (decodedText: string, result: any) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void,
    ): Promise<null>;
    stop(): Promise<void>;
    clear(): Promise<void>;
  }
}
