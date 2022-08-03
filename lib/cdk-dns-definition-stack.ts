import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, CnameRecord, PublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets/lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class CdkDnsDefinitionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName: string = 'aburke.tech';

    const certificate = new Certificate(this, 'DnsCertificate', {
      domainName: `*.${domainName}`,
      validation: CertificateValidation.fromEmail(),
    });

    const zone = new PublicHostedZone(this, 'DnsHostedZone', {
      zoneName: domainName,
    });

    new CnameRecord(this, 'AburkeTechCnameRecord', {
      recordName: 'www',
      domainName: 'cname.vercel-dns.com',
      zone: zone,
    });

    // new ARecord(this, 'AburkeTechAliasARecrod', {
    //   recordName: 'proj',
    //   target: RecordTarget.fromAlias(new ApiGateway()),
    //   zone: zone,
    // });

    new Secret(this, 'AburkeTechCertArnSecret', {
      secretName: 'AburkeTechCertArn',
      generateSecretString: {
        secretStringTemplate: certificate.certificateArn,
      },
    });
  }
}
