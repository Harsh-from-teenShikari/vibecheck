import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePayoutDto {
    @IsString()
    @IsNotEmpty()
    creatorId: string;

    @IsNumber()
    amount: number;
}
