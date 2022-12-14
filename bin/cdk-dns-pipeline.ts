#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDnsPipelineStack } from '../lib/cdk-dns-pipeline-stack';

const app = new cdk.App();
new CdkDnsPipelineStack(app, 'CdkDnsPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
