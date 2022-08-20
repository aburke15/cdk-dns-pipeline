import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { CdkDnsPipelineStage } from './cdk-dns-pipeline-stage';

export class CdkDnsPipelineStack extends Stack {
  private readonly cdkDnsPipeline: string = 'CdkDnsPipeline';
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline: CodePipeline = new CodePipeline(this, this.cdkDnsPipeline, {
      pipelineName: this.cdkDnsPipeline,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('aburke15/cdk-dns-pipeline', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new CdkDnsPipelineStage(this, `${this.cdkDnsPipeline}Stage`));
  }
}
