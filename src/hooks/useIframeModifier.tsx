export const useIframeModifier = (html: string) => {
  let modifiedHtml: string;
  modifiedHtml = html.replaceAll(
    '<iframe',
    '<div class="iframe-wrapper"><iframe'
  );
  modifiedHtml = modifiedHtml.replaceAll('</iframe>', '</iframe></div>');
  return modifiedHtml;
};
