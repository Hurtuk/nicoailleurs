export default function unaccentName(name: string) {
  return name
    .replaceAll("[àâ]", "a")
    .replaceAll("[éèêë]", "e")
    .replaceAll("[îï]", "i")
    .replaceAll("[ûüù]", "u")
    .replaceAll("Š", "S")
    .replaceAll("É", "E")
    .replaceAll("ç", "c")
    .replaceAll("Î", "I")
}