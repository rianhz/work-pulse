export interface ITimesheet {
    userId: string;
    tenantId: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
    project: {
        id: string;
        name: string;
    };
    payAs: string;
}