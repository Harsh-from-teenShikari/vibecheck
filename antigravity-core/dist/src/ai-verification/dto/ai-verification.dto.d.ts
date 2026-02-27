export declare class AiVerificationResultDto {
    eligibility: boolean;
    compliance: boolean;
    confidence: number;
    riskFlags: string[];
    reasoning: string[];
    modelUsed: string;
}
