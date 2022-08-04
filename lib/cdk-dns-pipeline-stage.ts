import { StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkDnsDefinitionStack } from './cdk-dns-definition-stack';

export class CdkDnsPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CdkDnsDefinitionStack(this, 'CdkDnsDefinitionStack');
  }
}
