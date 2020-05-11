declare global {
  type ValueOf<T> = T extends { [K in keyof T]: infer U } ? U : never;
}

export type Product = {
  id: string;
  name: string;
  thumbnail?: string;
  hasStock: boolean;
};

export type SlackId = string;

export const ActionTypes = {
  REMOVE_SUBSCRIPTION: 'remove-subscription',
} as const;

export type ActionType = ValueOf<typeof ActionTypes>;
