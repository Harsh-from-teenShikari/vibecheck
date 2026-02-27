export class RecordCommissionDto {
    commissionId: string;
    creatorId: string;
    campaignId: string;
    amount: number;
}

export class GeneratePayoutDto {
    payoutId: string;
    creatorId: string;
    amount: number;
}
