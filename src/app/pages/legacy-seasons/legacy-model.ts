export type legacyScoreLine = {
  name: string;
  score: number;
  place?: number;
};

export type legacyScoreCategory = {
  year: string;
  categoryName: string;
  categoryIcon: string;
  categoryIconStyle: string;
  scores: legacyScoreLine[];
};
