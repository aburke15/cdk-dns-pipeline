import { Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { CnameRecord, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class CdkDnsDefinitionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const certificate = new Certificate(this, 'DnsCertificate', {
      domainName: '*.aburke.tech',
      validation: CertificateValidation.fromEmail(),
    });

    const zone = new PublicHostedZone(this, 'DnsHostedZone', {
      zoneName: 'aburke.tech',
    });

    // new CnameRecord(this, 'AburkeTechCnameRecord', {
    //   domainName: 'aburke.tech',
    //   recordName: 'www',
    //   zone: zone,
    // });

    // const zoneArnSecret = new Secret(this, 'AburkeTechZoneArnSecret', {
    //   secretName: 'AburkeTechZoneArn',
    //   generateSecretString: {
    //     generateStringKey: zone.hostedZoneArn,
    //   },
    // });

    // const certArnSecret = new Secret(this, 'AburkeTechCertArnSecret', {
    //   secretName: 'AburkeTechCertArn',
    //   generateSecretString: {
    //     generateStringKey: certificate.certificateArn,
    //   },
    // });
  }
}
