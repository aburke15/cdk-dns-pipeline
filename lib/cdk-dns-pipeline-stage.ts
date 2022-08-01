import { StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkDnsDefinitionStack } from './cdk-dns-definition-stack';

export class CdkDnsPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // TODO: just temporary
    const dnsDefinitionStack = new CdkDnsDefinitionStack(this, 'CdkDnsDefinitionStack', {
      env: {
        account: props?.env?.account,
        region: props?.env?.region,
      },
    });
  }
}
