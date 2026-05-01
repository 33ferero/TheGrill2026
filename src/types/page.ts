export type PageModule = {
  default: () => React.JSX.Element;
};

export enum PageType {
  ABOUT = "about",
  LOCATION = "location",
  GUIDELINES = "guidelines",
  PICTURES = "pictures",
}
