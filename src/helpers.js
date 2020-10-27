export const isMultiTouch = (touchList) => touchList.length > 1
export const isEmpty = (obj) => Object.keys(obj).length < 1
export const pxTransfer = (value, is2x) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    if (!Number.isNaN(Number(value)) && typeof Number(value) === 'number') {
      return Number(value)
    }
    if (/^(-?\d+)(.\d+)?vw$/g.test(value)) {
      return (Number(value.replace('vw', '')) / 100) * (!is2x ? 375 : 750)
    }
  }
  return 0
}
