export interface UserWithInfo {
  id: number;
  email: string;
  name: string;
  favlist: Fav[];
  cartlist: Cart[];
  role: Role;
}
