export interface Pref{
prefCode:number
prefName:string
}

export interface Datasets{
    label:string,
    data:number[],
    pointHoverRadius:number,
    tension:number
}

export interface PopulationList{
    id:number,
    name:string,
    population:YVData[]
    checked:boolean
}

export interface YVData{
    year:number,
    value:number
}