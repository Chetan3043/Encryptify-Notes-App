export type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
};

export type NoteDraft = {
  id?: string;
  title: string;
  content: string;
  pinned?: boolean;
  archived?: boolean;
};

export type EncryptedRecord = {
  id: string;
  ciphertext: string;
  updatedAt: number;
};


