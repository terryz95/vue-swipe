export const isMultiTouch = (touchList) => touchList.length > 1
export const isEmpty = (obj) => Object.keys(obj).length < 1
export const vw2px = (vw, is2x) => {
  if (vw === 0 || vw === 'vw' || !/^(-?\d+)(.\d+)?vw$/g.test(vw)) return 0
  return (Number(vw.replace('vw', '')) / 100) * (!is2x ? 375 : 750)
}
