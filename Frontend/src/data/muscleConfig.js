export const muscleGroups = {
  Hamstrings: [
    "Left_Semitendinosus",
    "Right_Semitendinosus",
    "Left_Semimembranosus",
    "Right_Semimembranosus",
    "Left_Bicep_Femoris",
    "Right_Bicep_Femoris",
  ],
  Quads: [
    "Left_Rectus_Femoris",
    "Right_Rectus_Femoris",
    "Left_Vastus_Lateralis",
    "Right_Vastus_Lateralis",
    "Left_Vastus_Medialis",
    "Right_Vastus_Medialis",
  ],
};

// Flattened array for initial state
export const allMuscles = Object.values(muscleGroups).flat();
