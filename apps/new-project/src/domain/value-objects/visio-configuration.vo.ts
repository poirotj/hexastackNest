export interface VisioConfigurationData {
  shareScreen: boolean;
  chat: boolean;
  document: boolean;
  recording: boolean;
  maxParticipants: number;
}

export class VisioConfiguration {
  constructor(
    private readonly shareScreen: boolean,
    private readonly chat: boolean,
    private readonly document: boolean,
    private readonly recording: boolean,
    private readonly maxParticipants: number
  ) {
    if (maxParticipants < 2 || maxParticipants > 100) {
      throw new Error('Max participants must be between 2 and 100');
    }
  }

  static createDefault(): VisioConfiguration {
    return new VisioConfiguration(true, true, true, false, 50);
  }

  static fromData(data: VisioConfigurationData): VisioConfiguration {
    return new VisioConfiguration(
      data.shareScreen,
      data.chat,
      data.document,
      data.recording,
      data.maxParticipants
    );
  }

  getShareScreen(): boolean {
    return this.shareScreen;
  }

  getChat(): boolean {
    return this.chat;
  }

  getDocument(): boolean {
    return this.document;
  }

  getRecording(): boolean {
    return this.recording;
  }

  getMaxParticipants(): number {
    return this.maxParticipants;
  }

  toData(): VisioConfigurationData {
    return {
      shareScreen: this.shareScreen,
      chat: this.chat,
      document: this.document,
      recording: this.recording,
      maxParticipants: this.maxParticipants
    };
  }
}
