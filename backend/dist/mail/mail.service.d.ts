export declare class MailService {
    private transporter;
    constructor();
    sendWelcomeEmail(to: string, name: string): Promise<void>;
}
