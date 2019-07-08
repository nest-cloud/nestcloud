import { Request, Response } from 'express';
import { IComponent } from './component.interface';

export interface IProxy extends IComponent {
    forward(req: Request, res: Response, id: string): void;
}
