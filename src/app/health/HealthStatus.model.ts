export class HealthStatusEntity {
  constructor(
    public readonly status: 'ok',
    public readonly requestId: string
  ) {}
}
