// ARQUIVO GERADO por scripts/cali/build-media.mjs — não editar à mão.
import { Level, MuscleId } from '../domain/types';

export interface CaliSource {
  id: string;
  sourceId: string;
  level: Level;
  category: 'strength' | 'plyometrics' | 'stretching';
  primary: MuscleId[];
  secondary: MuscleId[];
}

/** Dados mecânicos dos 150 exercícios (free-exercise-db, domínio público). */
export const CALI_SOURCE: CaliSource[] = [
  {
    id: '3_4_sit_up',
    sourceId: '3_4_Sit-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'ab_roller',
    sourceId: 'Ab_Roller',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: [
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'air_bike',
    sourceId: 'Air_Bike',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'alternate_heel_touchers',
    sourceId: 'Alternate_Heel_Touchers',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'alternate_leg_diagonal_bound',
    sourceId: 'Alternate_Leg_Diagonal_Bound',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'band_assisted_pull_up',
    sourceId: 'Band_Assisted_Pull-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'abs',
      'forearms',
      'upper_back'
    ]
  },
  {
    id: 'bench_dips',
    sourceId: 'Bench_Dips',
    level: 'beginner',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'bench_jump',
    sourceId: 'Bench_Jump',
    level: 'intermediate',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'bent_knee_hip_raise',
    sourceId: 'Bent-Knee_Hip_Raise',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'body_up',
    sourceId: 'Body-Up',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'abs',
      'forearms'
    ]
  },
  {
    id: 'body_tricep_press',
    sourceId: 'Body_Tricep_Press',
    level: 'beginner',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: []
  },
  {
    id: 'bodyweight_mid_row',
    sourceId: 'Bodyweight_Mid_Row',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'upper_back'
    ],
    secondary: [
      'biceps',
      'lats'
    ]
  },
  {
    id: 'bodyweight_squat',
    sourceId: 'Bodyweight_Squat',
    level: 'beginner',
    category: 'strength',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'bodyweight_walking_lunge',
    sourceId: 'Bodyweight_Walking_Lunge',
    level: 'beginner',
    category: 'strength',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'bottoms_up',
    sourceId: 'Bottoms_Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'box_jump_multiple_response',
    sourceId: 'Box_Jump_Multiple_Response',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'quads'
    ]
  },
  {
    id: 'box_skip',
    sourceId: 'Box_Skip',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'quads'
    ]
  },
  {
    id: 'butt_ups',
    sourceId: 'Butt-Ups',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'butt_lift_bridge',
    sourceId: 'Butt_Lift_Bridge',
    level: 'beginner',
    category: 'strength',
    primary: [
      'glutes'
    ],
    secondary: [
      'hamstrings'
    ]
  },
  {
    id: 'carioca_quick_step',
    sourceId: 'Carioca_Quick_Step',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'adductors'
    ],
    secondary: [
      'abs',
      'glutes',
      'calves',
      'hamstrings',
      'quads'
    ]
  },
  {
    id: 'chin_up',
    sourceId: 'Chin-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'forearms',
      'upper_back'
    ]
  },
  {
    id: 'clock_push_up',
    sourceId: 'Clock_Push-Up',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'cocoons',
    sourceId: 'Cocoons',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'cross_body_crunch',
    sourceId: 'Cross-Body_Crunch',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'crunch_hands_overhead',
    sourceId: 'Crunch_-_Hands_Overhead',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'crunches',
    sourceId: 'Crunches',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'dead_bug',
    sourceId: 'Dead_Bug',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'decline_crunch',
    sourceId: 'Decline_Crunch',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'decline_oblique_crunch',
    sourceId: 'Decline_Oblique_Crunch',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'decline_push_up',
    sourceId: 'Decline_Push-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'decline_reverse_crunch',
    sourceId: 'Decline_Reverse_Crunch',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'depth_jump_leap',
    sourceId: 'Depth_Jump_Leap',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'dips_chest_version',
    sourceId: 'Dips_-_Chest_Version',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'dips_triceps_version',
    sourceId: 'Dips_-_Triceps_Version',
    level: 'beginner',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'donkey_calf_raises',
    sourceId: 'Donkey_Calf_Raises',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'calves'
    ],
    secondary: []
  },
  {
    id: 'double_leg_butt_kick',
    sourceId: 'Double_Leg_Butt_Kick',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'drop_push',
    sourceId: 'Drop_Push',
    level: 'intermediate',
    category: 'plyometrics',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'elbow_to_knee',
    sourceId: 'Elbow_to_Knee',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'fast_skipping',
    sourceId: 'Fast_Skipping',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'flat_bench_leg_pull_in',
    sourceId: 'Flat_Bench_Leg_Pull-In',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'flat_bench_lying_leg_raise',
    sourceId: 'Flat_Bench_Lying_Leg_Raise',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'floor_glute_ham_raise',
    sourceId: 'Floor_Glute-Ham_Raise',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'calves',
      'glutes'
    ]
  },
  {
    id: 'flutter_kicks',
    sourceId: 'Flutter_Kicks',
    level: 'beginner',
    category: 'strength',
    primary: [
      'glutes'
    ],
    secondary: [
      'hamstrings'
    ]
  },
  {
    id: 'freehand_jump_squat',
    sourceId: 'Freehand_Jump_Squat',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'frog_sit_ups',
    sourceId: 'Frog_Sit-Ups',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'front_box_jump',
    sourceId: 'Front_Box_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'quads'
    ]
  },
  {
    id: 'front_cone_hops_or_hurdle_hops',
    sourceId: 'Front_Cone_Hops_or_hurdle_hops',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'gironda_sternum_chins',
    sourceId: 'Gironda_Sternum_Chins',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'upper_back'
    ]
  },
  {
    id: 'glute_kickback',
    sourceId: 'Glute_Kickback',
    level: 'beginner',
    category: 'strength',
    primary: [
      'glutes'
    ],
    secondary: [
      'hamstrings'
    ]
  },
  {
    id: 'gorilla_chin_crunch',
    sourceId: 'Gorilla_Chin_Crunch',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: [
      'biceps',
      'lats'
    ]
  },
  {
    id: 'handstand_push_ups',
    sourceId: 'Handstand_Push-Ups',
    level: 'advanced',
    category: 'strength',
    primary: [
      'front_delts',
      'side_delts'
    ],
    secondary: [
      'triceps'
    ]
  },
  {
    id: 'hanging_leg_raise',
    sourceId: 'Hanging_Leg_Raise',
    level: 'advanced',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'hanging_pike',
    sourceId: 'Hanging_Pike',
    level: 'advanced',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'hurdle_hops',
    sourceId: 'Hurdle_Hops',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves'
    ]
  },
  {
    id: 'hyperextensions_back_extensions',
    sourceId: 'Hyperextensions_Back_Extensions',
    level: 'beginner',
    category: 'strength',
    primary: [
      'lower_back'
    ],
    secondary: [
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'hyperextensions_with_no_hyperextension_bench',
    sourceId: 'Hyperextensions_With_No_Hyperextension_Bench',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lower_back'
    ],
    secondary: [
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'incline_push_up',
    sourceId: 'Incline_Push-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'incline_push_up_close_grip',
    sourceId: 'Incline_Push-Up_Close-Grip',
    level: 'beginner',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'incline_push_up_depth_jump',
    sourceId: 'Incline_Push-Up_Depth_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'incline_push_up_medium',
    sourceId: 'Incline_Push-Up_Medium',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'abs',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'incline_push_up_reverse_grip',
    sourceId: 'Incline_Push-Up_Reverse_Grip',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'abs',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'incline_push_up_wide',
    sourceId: 'Incline_Push-Up_Wide',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'abs',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'inverted_row',
    sourceId: 'Inverted_Row',
    level: 'beginner',
    category: 'strength',
    primary: [
      'upper_back'
    ],
    secondary: [
      'lats'
    ]
  },
  {
    id: 'inverted_row_with_straps',
    sourceId: 'Inverted_Row_with_Straps',
    level: 'beginner',
    category: 'strength',
    primary: [
      'upper_back'
    ],
    secondary: [
      'biceps',
      'lats'
    ]
  },
  {
    id: 'isometric_chest_squeezes',
    sourceId: 'Isometric_Chest_Squeezes',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'isometric_wipers',
    sourceId: 'Isometric_Wipers',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'abs',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'jackknife_sit_up',
    sourceId: 'Jackknife_Sit-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'janda_sit_up',
    sourceId: 'Janda_Sit-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'kipping_muscle_up',
    sourceId: 'Kipping_Muscle_Up',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'abs',
      'biceps',
      'forearms',
      'upper_back',
      'front_delts',
      'side_delts',
      'traps',
      'triceps'
    ]
  },
  {
    id: 'knee_hip_raise_on_parallel_bars',
    sourceId: 'Knee_Hip_Raise_On_Parallel_Bars',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'knee_tuck_jump',
    sourceId: 'Knee_Tuck_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'quads'
    ]
  },
  {
    id: 'kneeling_arm_drill',
    sourceId: 'Kneeling_Arm_Drill',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'front_delts',
      'side_delts'
    ],
    secondary: [
      'abs'
    ]
  },
  {
    id: 'lateral_bound',
    sourceId: 'Lateral_Bound',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'adductors'
    ],
    secondary: [
      'glutes',
      'calves',
      'hamstrings',
      'quads'
    ]
  },
  {
    id: 'lateral_box_jump',
    sourceId: 'Lateral_Box_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'adductors'
    ],
    secondary: [
      'glutes',
      'calves',
      'hamstrings',
      'quads'
    ]
  },
  {
    id: 'lateral_cone_hops',
    sourceId: 'Lateral_Cone_Hops',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'adductors'
    ],
    secondary: [
      'glutes',
      'calves',
      'hamstrings',
      'quads'
    ]
  },
  {
    id: 'leg_lift',
    sourceId: 'Leg_Lift',
    level: 'beginner',
    category: 'strength',
    primary: [
      'glutes'
    ],
    secondary: [
      'hamstrings'
    ]
  },
  {
    id: 'leg_pull_in',
    sourceId: 'Leg_Pull-In',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'linear_depth_jump',
    sourceId: 'Linear_Depth_Jump',
    level: 'intermediate',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'london_bridges',
    sourceId: 'London_Bridges',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'forearms',
      'upper_back'
    ]
  },
  {
    id: 'mixed_grip_chin',
    sourceId: 'Mixed_Grip_Chin',
    level: 'advanced',
    category: 'strength',
    primary: [
      'upper_back'
    ],
    secondary: [
      'biceps',
      'lats'
    ]
  },
  {
    id: 'mountain_climbers',
    sourceId: 'Mountain_Climbers',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'chest',
      'hamstrings',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'muscle_up',
    sourceId: 'Muscle_Up',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'abs',
      'biceps',
      'forearms',
      'upper_back',
      'front_delts',
      'side_delts',
      'traps',
      'triceps'
    ]
  },
  {
    id: 'natural_glute_ham_raise',
    sourceId: 'Natural_Glute_Ham_Raise',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'calves',
      'glutes',
      'lower_back'
    ]
  },
  {
    id: 'oblique_crunches',
    sourceId: 'Oblique_Crunches',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'oblique_crunches_on_the_floor',
    sourceId: 'Oblique_Crunches_-_On_The_Floor',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'one_arm_chin_up',
    sourceId: 'One_Arm_Chin-Up',
    level: 'advanced',
    category: 'strength',
    primary: [
      'upper_back'
    ],
    secondary: [
      'biceps',
      'forearms',
      'lats'
    ]
  },
  {
    id: 'parallel_bar_dip',
    sourceId: 'Parallel_Bar_Dip',
    level: 'beginner',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'plank',
    sourceId: 'Plank',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'plyo_push_up',
    sourceId: 'Plyo_Push-up',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'pullups',
    sourceId: 'Pullups',
    level: 'beginner',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'upper_back'
    ]
  },
  {
    id: 'push_up_wide',
    sourceId: 'Push-Up_Wide',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'abs',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'push_ups_close_triceps_position',
    sourceId: 'Push-Ups_-_Close_Triceps_Position',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'push_ups_with_feet_elevated',
    sourceId: 'Push-Ups_With_Feet_Elevated',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'push_up_to_side_plank',
    sourceId: 'Push_Up_to_Side_Plank',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'abs',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'pushups',
    sourceId: 'Pushups',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'pushups_close_and_wide_hand_positions',
    sourceId: 'Pushups_Close_and_Wide_Hand_Positions',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'quick_leap',
    sourceId: 'Quick_Leap',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'reverse_crunch',
    sourceId: 'Reverse_Crunch',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'ring_dips',
    sourceId: 'Ring_Dips',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'rocket_jump',
    sourceId: 'Rocket_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'rocky_pull_ups_pulldowns',
    sourceId: 'Rocky_Pull-Ups_Pulldowns',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'upper_back',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'rope_climb',
    sourceId: 'Rope_Climb',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'forearms',
      'upper_back',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'russian_twist',
    sourceId: 'Russian_Twist',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: [
      'lower_back'
    ]
  },
  {
    id: 'scapular_pull_up',
    sourceId: 'Scapular_Pull-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'traps'
    ],
    secondary: [
      'lats',
      'upper_back'
    ]
  },
  {
    id: 'scissors_jump',
    sourceId: 'Scissors_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'seated_flat_bench_leg_pull_in',
    sourceId: 'Seated_Flat_Bench_Leg_Pull-In',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'seated_leg_tucks',
    sourceId: 'Seated_Leg_Tucks',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'side_bridge',
    sourceId: 'Side_Bridge',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: [
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'side_jackknife',
    sourceId: 'Side_Jackknife',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'side_standing_long_jump',
    sourceId: 'Side_Standing_Long_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'side_to_side_chins',
    sourceId: 'Side_To_Side_Chins',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'forearms',
      'upper_back',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'side_to_side_box_shuffle',
    sourceId: 'Side_to_Side_Box_Shuffle',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'single_arm_push_up',
    sourceId: 'Single-Arm_Push-Up',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'single_leg_high_box_squat',
    sourceId: 'Single-Leg_High_Box_Squat',
    level: 'beginner',
    category: 'strength',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'single_leg_hop_progression',
    sourceId: 'Single-Leg_Hop_Progression',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'single_leg_lateral_hop',
    sourceId: 'Single-Leg_Lateral_Hop',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'single_leg_stride_jump',
    sourceId: 'Single-Leg_Stride_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'single_leg_butt_kick',
    sourceId: 'Single_Leg_Butt_Kick',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'single_leg_glute_bridge',
    sourceId: 'Single_Leg_Glute_Bridge',
    level: 'beginner',
    category: 'strength',
    primary: [
      'glutes'
    ],
    secondary: [
      'hamstrings'
    ]
  },
  {
    id: 'single_leg_push_off',
    sourceId: 'Single_Leg_Push-off',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'sit_up',
    sourceId: 'Sit-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'spider_crawl',
    sourceId: 'Spider_Crawl',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: [
      'chest',
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'split_jump',
    sourceId: 'Split_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'standing_long_jump',
    sourceId: 'Standing_Long_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'standing_towel_triceps_extension',
    sourceId: 'Standing_Towel_Triceps_Extension',
    level: 'beginner',
    category: 'strength',
    primary: [
      'triceps'
    ],
    secondary: []
  },
  {
    id: 'star_jump',
    sourceId: 'Star_Jump',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'step_up_with_knee_raise',
    sourceId: 'Step-up_with_Knee_Raise',
    level: 'beginner',
    category: 'strength',
    primary: [
      'glutes'
    ],
    secondary: [
      'hamstrings',
      'quads'
    ]
  },
  {
    id: 'stride_jump_crossover',
    sourceId: 'Stride_Jump_Crossover',
    level: 'beginner',
    category: 'plyometrics',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'suspended_fallout',
    sourceId: 'Suspended_Fallout',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: [
      'chest',
      'lower_back',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'suspended_push_up',
    sourceId: 'Suspended_Push-Up',
    level: 'beginner',
    category: 'strength',
    primary: [
      'chest'
    ],
    secondary: [
      'front_delts',
      'side_delts',
      'triceps'
    ]
  },
  {
    id: 'suspended_reverse_crunch',
    sourceId: 'Suspended_Reverse_Crunch',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'suspended_row',
    sourceId: 'Suspended_Row',
    level: 'beginner',
    category: 'strength',
    primary: [
      'upper_back'
    ],
    secondary: [
      'biceps',
      'lats'
    ]
  },
  {
    id: 'suspended_split_squat',
    sourceId: 'Suspended_Split_Squat',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'quads'
    ],
    secondary: [
      'glutes',
      'adductors',
      'calves',
      'hamstrings'
    ]
  },
  {
    id: 'tuck_crunch',
    sourceId: 'Tuck_Crunch',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'v_bar_pullup',
    sourceId: 'V-Bar_Pullup',
    level: 'beginner',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'upper_back',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'wide_grip_rear_pull_up',
    sourceId: 'Wide-Grip_Rear_Pull-Up',
    level: 'intermediate',
    category: 'strength',
    primary: [
      'lats'
    ],
    secondary: [
      'biceps',
      'upper_back',
      'front_delts',
      'side_delts'
    ]
  },
  {
    id: 'wind_sprints',
    sourceId: 'Wind_Sprints',
    level: 'beginner',
    category: 'strength',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'superman',
    sourceId: 'Superman',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'lower_back'
    ],
    secondary: [
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'split_squats',
    sourceId: 'Split_Squats',
    level: 'intermediate',
    category: 'stretching',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'calves',
      'glutes',
      'quads'
    ]
  },
  {
    id: 'frog_hops',
    sourceId: 'Frog_Hops',
    level: 'intermediate',
    category: 'stretching',
    primary: [
      'quads'
    ],
    secondary: [
      'calves',
      'glutes',
      'hamstrings'
    ]
  },
  {
    id: 'inchworm',
    sourceId: 'Inchworm',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'hamstrings'
    ],
    secondary: []
  },
  {
    id: 'groiners',
    sourceId: 'Groiners',
    level: 'intermediate',
    category: 'stretching',
    primary: [
      'adductors'
    ],
    secondary: []
  },
  {
    id: 'scissor_kick',
    sourceId: 'Scissor_Kick',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'abs'
    ],
    secondary: []
  },
  {
    id: 'side_leg_raises',
    sourceId: 'Side_Leg_Raises',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'adductors'
    ],
    secondary: []
  },
  {
    id: 'front_leg_raises',
    sourceId: 'Front_Leg_Raises',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'hamstrings'
    ],
    secondary: []
  },
  {
    id: 'rear_leg_raises',
    sourceId: 'Rear_Leg_Raises',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'quads'
    ],
    secondary: []
  },
  {
    id: 'pelvic_tilt_into_bridge',
    sourceId: 'Pelvic_Tilt_Into_Bridge',
    level: 'intermediate',
    category: 'stretching',
    primary: [
      'lower_back'
    ],
    secondary: []
  },
  {
    id: 'worlds_greatest_stretch',
    sourceId: 'Worlds_Greatest_Stretch',
    level: 'intermediate',
    category: 'stretching',
    primary: [
      'hamstrings'
    ],
    secondary: [
      'calves',
      'glutes',
      'quads'
    ]
  },
  {
    id: 'arm_circles',
    sourceId: 'Arm_Circles',
    level: 'beginner',
    category: 'stretching',
    primary: [
      'front_delts',
      'side_delts'
    ],
    secondary: [
      'traps'
    ]
  },
  {
    id: 'crossover_reverse_lunge',
    sourceId: 'Crossover_Reverse_Lunge',
    level: 'intermediate',
    category: 'stretching',
    primary: [
      'lower_back'
    ],
    secondary: [
      'abs',
      'glutes',
      'hamstrings',
      'quads'
    ]
  }
];
