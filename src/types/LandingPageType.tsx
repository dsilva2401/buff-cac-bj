export type LandingPageType = {
  _id: string;
  brand: {
    id: string;
    name: string;
    logo: string;
    backgroundImage: string;
    details: string;
  }[];
  createdAt: string;
  updatedAt: string;
  links: {
    title: string;
    url: string;
  }[];
}[];
