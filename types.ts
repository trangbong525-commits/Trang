
export interface Submission {
  id: string;
  name: string;
  team: string;
  activity: string;
  date: string;
  time: string;
  proofs: string[];
  score: number;
}

export interface IndividualRanking {
  name: string;
  score: number;
}

export interface TeamRanking {
  team: string;
  score: number;
}