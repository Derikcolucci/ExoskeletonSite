export const muscleGroups = {
  Hamstrings: [
    "Left_Semitendinosus",
    "Right_Semitendinosus",
    "Left_Bicep_Femoris",
    "Right_Bicep_Femoris",
  ],
  Quads: [
    "Left_Rectus_Femoris",
    "Right_Rectus_Femoris",
    "Left_Vastus_Lateralis",
    "Right_Vastus_Lateralis",
  ],
};

// Flattened array for initial state
export const allMuscles = Object.values(muscleGroups).flat();

/*
// Current format for testing
export const muscleGroups = {
  Hamstrings: [
    "Right_Bicep_Femoris",
    "Left_Bicep_Femoris",
  ],
};

// Flattened array for initial state
export const allMuscles = Object.values(muscleGroups).flat();
*/