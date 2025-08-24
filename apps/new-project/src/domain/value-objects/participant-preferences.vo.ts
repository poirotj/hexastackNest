export interface ParticipantPreferencesData {
  microphone: boolean;
  speaker: boolean;
  camera: boolean;
  notifications: boolean;
}

export class ParticipantPreferences {
  constructor(
    private readonly microphone: boolean,
    private readonly speaker: boolean,
    private readonly camera: boolean,
    private readonly notifications: boolean
  ) {}

  static createDefault(): ParticipantPreferences {
    return new ParticipantPreferences(true, true, true, true);
  }

  static fromData(data: ParticipantPreferencesData): ParticipantPreferences {
    return new ParticipantPreferences(
      data.microphone,
      data.speaker,
      data.camera,
      data.notifications
    );
  }

  getMicrophone(): boolean {
    return this.microphone;
  }

  getSpeaker(): boolean {
    return this.speaker;
  }

  getCamera(): boolean {
    return this.camera;
  }

  getNotifications(): boolean {
    return this.notifications;
  }

  toData(): ParticipantPreferencesData {
    return {
      microphone: this.microphone,
      speaker: this.speaker,
      camera: this.camera,
      notifications: this.notifications
    };
  }
}
