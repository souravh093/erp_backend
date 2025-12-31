export type TRoleData = {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  features: TFeature[];
};

export type TFeature = {
  name: string;
  index: number;
  path: string;
  icon: string;
  featureAccess?: TFeatureAccess[];
};

export type TFeatureAccess = {
  name: string;
};
