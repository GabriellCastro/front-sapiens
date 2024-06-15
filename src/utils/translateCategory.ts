export const translateCategory = (category: string) => {
  switch (category) {
    case "FOOD":
      return "Alimentação";
    case "RENT":
      return "Aluguel";
    case "TRANSPORT":
      return "Transporte";
    case "HEALTH":
      return "Saúde";
    case "EDUCATION":
      return "Educação";
    case "LEISURE":
      return "Lazer";
    case "ENTERTAINMENT":
      return "Entretenimento";
    case "OTHER":
      return "Outro";
    default:
      return "N/A";
  }
};
