// Supabase types placeholder
export interface Tables {
  assistants: {
    id: string;
    name: string;
    description: string;
    image_path?: string;
  };
}

export type Assistant = Tables['assistants'];
