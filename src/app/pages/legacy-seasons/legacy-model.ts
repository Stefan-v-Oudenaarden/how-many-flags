export type legacyScoreLine = {
  name: string;
  score: number;
  place?: number;
};

export type legacyScoreCategory = {
  categoryName: string;
  categoryIcon: string;
  categoryIconStyle: string;
  scores: legacyScoreLine[];
};
