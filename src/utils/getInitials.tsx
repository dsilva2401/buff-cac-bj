export const getNameInitials = (displayName: string | null) => {
  if (displayName) {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let initials: RegExpMatchArray[] | string =
      [...displayName.matchAll(rgx)] || [];
    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();
    return initials;
  } else return '';
};
