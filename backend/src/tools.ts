export function calculateBMI(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function estimateCalories(weightKg: number, heightCm: number, age: number, gender: string, goal: string) {
  const bmr =
    gender.toLowerCase() === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const maintenance = bmr * 1.45;

  if (goal === "fat_loss") return Math.round(maintenance - 400);
  if (goal === "muscle_gain") return Math.round(maintenance + 250);
  return Math.round(maintenance);
}