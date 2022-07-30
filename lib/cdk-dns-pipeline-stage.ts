import { StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkDnsPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
