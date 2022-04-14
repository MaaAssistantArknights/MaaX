abstract class ComponentInstaller {
  public abstract install (): void

  protected abstract onStart (): void
  protected abstract onProgress (progress: number): void
  protected abstract onCancel (): void
}

export default ComponentInstaller
