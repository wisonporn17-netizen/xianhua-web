export interface Episode {
  id: string;
  title: string;
  epNum: number;
  audioUrl: string;
  description?: string;
}

export interface Novel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverUrl: string;
  episodes: Episode[];
}
