export function goTo(id: string) {
  const target = document.getElementById(id);
  console.log(target?.offsetTop);
  if (target) {
    // const {height} = target.getBoundingClientRect()
    document.body.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: target?.offsetTop,
    });
  }
  // document.getElementById(id)?.scrollIntoView({
  //   behavior: 'smooth',
  //   inline: 'start',
  //   block: 'start',
  // });
}
