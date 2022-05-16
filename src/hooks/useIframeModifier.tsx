export const useIframeModifier = (html: string) => {
  let modifiedHtml: string;
  modifiedHtml = html.replaceAll(
    '<iframe class="ql-video',
    '<div class="iframe-wrapper"><iframe class="ql-video'
  );
  modifiedHtml = modifiedHtml.replaceAll('</iframe>', '</iframe></div>');
  return modifiedHtml;
};
