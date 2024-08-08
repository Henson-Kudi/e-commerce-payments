export default interface IUseCase<Params = unknown, ReturnValue = unknown> {
  execute(params: Params): Promise<ReturnValue>;
}
