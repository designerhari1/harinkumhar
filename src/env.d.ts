type AppUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

declare namespace App {
  interface Locals {
    user: AppUser | null;
  }
}
