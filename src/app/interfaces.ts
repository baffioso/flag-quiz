export interface Category {
    name: string;
    id: string;
    icon: string;
}

export interface Loading {
    category: string;
    questionNum: number;
    featureCount: number;
}

export interface Country {
    admin: string;
    iso: string;
} 