export function getRandomHex(length: number) {
  let characters = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += characters[Math.floor(Math.random() * 16)];
  }
  return str;
}
