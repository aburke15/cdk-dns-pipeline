import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { CdkDnsPipelineStage } from './cdk-dns-pipeline-stage';

export class CdkDnsPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dnsPipeline = new CodePipeline(this, 'CdkDnsPipeline', {
      pipelineName: 'CdkDnsPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('aburke15/cdk-dns-pipeline', 'main'),
        commands: ['npm-ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    dnsPipeline.addStage(new CdkDnsPipelineStage(this, 'CdkDnsPipelineStage'));
  }
}
