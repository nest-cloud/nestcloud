import { LoggerInstance } from "winston";
import { IComponent } from "./component.interface";

export interface ILogger extends LoggerInstance, IComponent {

}
