const getClickedTarget = (ev, className) => {
  // if (ev.path && ev.path.length) {
  //    return ev.path.find(el => el.classList.contains(className))
  // }
  
  return [ev.target, ev.originalTarget, ev.explicitOriginalTarget, ev.srcElement]
    .filter(Boolean)
    .find(el => el.classList.contains(className))
}
export { getClickedTarget }