export declare class MailService {
    private transporter;
    constructor();
    sendThankYou(to: string, summary: number): Promise<void>;
}
