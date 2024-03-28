import Stat from "./stat";

class Pokemon {

  id!: number;
  name!: string;
  type1!: string;
  type2?: string;
  sprite!: string;
  height!: number;
  weight!: number;
  abilities!: string[];
  hiddenAbility!: string;
  stats!: Stat[];

}

export default Pokemon;
