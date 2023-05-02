export interface ServerObj {
  roleId: string;
  delay: number;
  channelRoles?: {
    voiceChannel: string;
    role: string;
  }[];
}
