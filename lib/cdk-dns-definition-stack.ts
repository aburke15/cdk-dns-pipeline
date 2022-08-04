import { Stack, StackProps } from 'aws-cdk-lib';
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

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const certificate = new Certificate(this, 'DnsCertificate', {
      domainName: `*.${this.domainName}`,
      validation: CertificateValidation.fromEmail(),
    });

    const zone = new PublicHostedZone(this, 'DnsHostedZone', {
      zoneName: this.domainName,
    });

    new CnameRecord(this, 'AburkeTechCnameRecord', {
      recordName: this.www,
      domainName: 'cname.vercel-dns.com',
      zone: zone,
    });

    const apiSecret: ISecret = Secret.fromSecretNameV2(this, 'GitHubRepoApiIdSecret', 'GitHubRepoApiId');

    const api = LambdaRestApi.fromRestApiId(
      this,
      'GitHubRepoReadApi',
      apiSecret?.secretValue?.unsafeUnwrap()?.toString()
    ) as LambdaRestApi;

    api.addDomainName('GitHubRepoApiDomain', {
      domainName: `${this.proj}.${this.domainName}`,
      certificate: certificate,
    });

    new ARecord(this, 'AburkeTechAliasARecrod', {
      recordName: this.proj,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      zone: zone,
    });

    new HttpsRedirect(this, 'AburkeTechRedirect', {
      recordNames: [this.domainName],
      targetDomain: `${this.www}.${this.domainName}`,
      zone: zone,
    });
  }
}
