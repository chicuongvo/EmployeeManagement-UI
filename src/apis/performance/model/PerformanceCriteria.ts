export interface PerformanceCriteria {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

export interface PerformanceCriteriaCreate {
    name: string;
    description: string;
}
