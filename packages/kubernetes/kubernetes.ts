import Api = require('kubernetes-client');
import { IKubernetes } from '@nestcloud/common';

export class Kubernetes extends Api.Client1_13 implements IKubernetes {
}
