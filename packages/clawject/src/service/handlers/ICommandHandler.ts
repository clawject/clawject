export interface ICommandHandler<Req, Res = void> {
    invoke(command: Req): Res
}
