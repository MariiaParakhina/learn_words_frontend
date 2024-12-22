export function VerifyTiming  (updatedDate: string, status: string): boolean  {
    const now = new Date();
    const updatedDateObj = new Date(updatedDate);
    const differenceInMs = now.getTime() - updatedDateObj.getTime();

    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    console.log(status);
    switch (status) {
        case "CREATED":
            return true;
        case "ONE_HOUR":
            return differenceInHours > 1;
        case "ONE_DAY":
            return differenceInDays > 1;
        case "TWO_DAYS":
            return differenceInDays > 2;
        case "FIVE_DAYS":
            return differenceInDays > 5;
        case "ONE_MONTH":
            return differenceInDays > 30;
        default:
            return false;
    }
};
export function GetProgressPercentage(status: string): number {
    switch (status) {
        case "CREATED":
            return 0;
        case "ONE_HOUR":
            return 10;
        case "ONE_DAY":
            return 25;
        case "TWO_DAYS":
            return 50;
        case "FIVE_DAYS":
            return 75;
        case "ONE_MONTH":
            return 90;
        case "COMPLETED":
            return 100;
        default:
            return 0;
    }
}