export function goTo(id: string) {
  const target = document.getElementById(id);
  if (target) {
    document.body.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: target?.offsetTop,
    });
  }
}
