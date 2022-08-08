import { RemovalPolicy, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, CnameRecord, PublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { HttpsRedirect } from 'aws-cdk-lib/aws-route53-patterns';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class CdkDnsDefinitionStack extends Stack {
  private readonly domainName: string = 'aburke.tech';
  private readonly www: string = 'www';
  private readonly proj: string = 'proj';
  private readonly cloud: string = 'cloud';
  private readonly aburkeTech: string = 'AburkeTech';
  private readonly gitHubRepo: string = 'GitHubRepo';
  private readonly cloudResume: string = 'CloudResume';

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const certificate = new Certificate(this, `${this.aburkeTech}Certificate`, {
      domainName: `*.${this.domainName}`,
      validation: CertificateValidation.fromEmail(),
    });

    const zone = new PublicHostedZone(this, `${this.aburkeTech}PublicHostedZone`, {
      zoneName: this.domainName,
    });

    zone.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const cName = new CnameRecord(this, `${this.aburkeTech}CnameRecord`, {
      recordName: this.www,
      domainName: 'cname.vercel-dns.com',
      zone: zone,
    });

    cName.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new HttpsRedirect(this, `${this.aburkeTech}Redirect`, {
      recordNames: [this.domainName],
      targetDomain: `${this.www}.${this.domainName}`,
      zone: zone,
    });

    new Secret(this, `${this.aburkeTech}CertificateArnSecret`, {
      secretName: `${this.aburkeTech}CertificateArn`,
      secretStringValue: new SecretValue(certificate.certificateArn),
    });

    new Secret(this, `${this.aburkeTech}HostedZoneIdSecret`, {
      secretName: `${this.aburkeTech}HostedZoneId`,
      secretStringValue: new SecretValue(zone.hostedZoneId),
    });

    // github repo api in the cdk timer app stack
    // const apiSecret: ISecret = Secret.fromSecretNameV2(
    //   this,
    //   `${this.gitHubRepo}ApiIdSecret`,
    //   `${this.gitHubRepo}ApiId`
    // );

    // const gitHubRepoApi = LambdaRestApi.fromRestApiId(
    //   this,
    //   `${this.gitHubRepo}Api`,
    //   apiSecret?.secretValue?.unsafeUnwrap()?.toString()
    // ) as LambdaRestApi;

    // gitHubRepoApi.addDomainName(`${this.gitHubRepo}ApiDomain`, {
    //   domainName: `${this.proj}.${this.domainName}`,
    //   certificate: certificate,
    // });

    // new ARecord(this, `${this.gitHubRepo}ARecord`, {
    //   recordName: this.proj,
    //   target: RecordTarget.fromAlias(new ApiGateway(gitHubRepoApi)),
    //   zone: zone,
    // });

    // cloud resume api in the cloud resume aws stack
    // const cloudResumeApiSecret: ISecret = Secret.fromSecretNameV2(
    //   this,
    //   `${this.cloudResume}ApiIdSecret`,
    //   `${this.cloudResume}ApiId`
    // );

    // const cloudResumeApi = LambdaRestApi.fromRestApiId(
    //   this,
    //   `${this.cloudResume}Api`,
    //   cloudResumeApiSecret?.secretValue?.unsafeUnwrap()?.toString()
    // ) as LambdaRestApi;

    // cloudResumeApi.addDomainName(`${this.cloudResume}ApiDomain`, {
    //   domainName: `${this.cloud}.${this.domainName}`,
    //   certificate: certificate,
    // });

    // new ARecord(this, `${this.cloudResume}ARecord`, {
    //   recordName: this.cloud,
    //   target: RecordTarget.fromAlias(new ApiGateway(cloudResumeApi)),
    //   zone: zone,
    // });
  }
}
