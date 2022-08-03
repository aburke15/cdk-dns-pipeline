import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, CnameRecord, PublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { HttpsRedirect } from 'aws-cdk-lib/aws-route53-patterns';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class CdkDnsDefinitionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName: string = 'aburke.tech';
    const wwwPrefix: string = 'www';
    const projPrefix: string = 'proj';

    const certificate = new Certificate(this, 'DnsCertificate', {
      domainName: `*.${domainName}`,
      validation: CertificateValidation.fromEmail(),
    });

    new Secret(this, 'AburkeTechCertArnSecret', {
      secretName: 'AburkeTechCertArn',
      secretStringValue: new SecretValue(certificate.certificateArn),
    });

    const zone = new PublicHostedZone(this, 'DnsHostedZone', {
      zoneName: domainName,
    });

    new CnameRecord(this, 'AburkeTechCnameRecord', {
      recordName: wwwPrefix,
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
      domainName: `${projPrefix}.${domainName}`,
      certificate: certificate,
    });

    new ARecord(this, 'AburkeTechAliasARecrod', {
      recordName: projPrefix,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      zone: zone,
    });

    new HttpsRedirect(this, 'AburkeTechRedirect', {
      recordNames: [domainName, `http://${domainName}`],
      targetDomain: `${wwwPrefix}.${domainName}`,
      zone: zone,
    });
  }
}
