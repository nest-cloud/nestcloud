import { Request, Response } from "express";

export interface IGateway {
    forward(req: Request, res: Response, id: string): void;
}
