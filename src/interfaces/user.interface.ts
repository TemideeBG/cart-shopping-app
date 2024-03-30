export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    password: string;
    role?: string;
    nationality?: string;
    home_address?: string;
    city?: string;
    gender: string;
    date_of_birth?: Date;
    age?: number;
  };