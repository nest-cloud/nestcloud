import { Request, Response } from "express";
import { IComponent } from "./component.interface";

export interface IGateway extends IComponent {
    forward(req: Request, res: Response, id: string): void;
}
