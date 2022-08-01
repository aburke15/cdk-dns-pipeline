import { Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { CnameRecord, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class CdkDnsDefinitionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: 'aburke.tech',
    });

    const certificate = new Certificate(this, 'Certificate', {
      domainName: '*.aburke.tech',
      validation: CertificateValidation.fromEmail(),
    });

    // new CnameRecord(this, 'AburkeTechCnameRecord', {
    //   domainName: 'aburke.tech',
    //   recordName: 'www',
    //   zone: zone,
    // });

    const zoneArnSecret = new Secret(this, '', {
      secretName: 'AburkeTechZoneArn',
      generateSecretString: {
        generateStringKey: zone.hostedZoneArn,
      },
    });

    const certArnSecret = new Secret(this, '', {
      secretName: 'AburkeTechCertArn',
      generateSecretString: {
        generateStringKey: certificate.certificateArn,
      },
    });
  }
}
