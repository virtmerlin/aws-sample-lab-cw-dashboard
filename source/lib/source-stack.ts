import cdk = require('@aws-cdk/core');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import {GraphWidget, Metric, Alarm, MathExpression, YAxisProps} from "@aws-cdk/aws-cloudwatch";

export class SourceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const dashboard = new cloudwatch.Dashboard(this, 'PeakEventDashboard', {dashboardName: 'Peak_Event_Dashboard'});

    //Input Args for generating CW Alarms resources
    const arnsJson = this.node.tryGetContext('arnsJson');
    const objectArns = JSON.parse(arnsJson);

    //EC2
    dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# EC2 Instances\n[button:primary:Jump To EC2 Service Console](https://console.aws.amazon.com/ec2/v2/home)\n', width: 24}));
    dashboard.addWidgets(
      this.buildMetricLineWidget("AWS/EC2", "CPUUtilization", "InstanceId", "ec2", "instance", "max", "%Used", objectArns),
      this.buildMetricLineWidget("AWS/EC2", "NetworkIn", "InstanceId", "ec2", "instance", "avg", "Bytes", objectArns),
      this.buildMetricLineWidget("AWS/EC2", "NetworkOut", "InstanceId", "ec2", "instance", "avg", "Bytes", objectArns),
    );

    //ElastiCache
    dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# Elasticache\n[button:primary:Jump To Elasticache Service Console](https://console.aws.amazon.com/elasticache/home)\n', width: 24}));
    dashboard.addWidgets(
      this.buildMetricLineWidget("AWS/ElastiCache", "CPUUtilization", "CacheClusterId", "elasticache", "cluster", "max", "%Used", objectArns),
      this.buildMetricLineWidget("AWS/ElastiCache", "EngineCPUUtilization", "CacheClusterId", "elasticache", "cluster", "max", "%Used", objectArns),
      this.buildMetricLineWidget("AWS/ElastiCache", "FreeableMemory", "CacheClusterId", "elasticache", "cluster", "max", "Bytes", objectArns),
      this.buildMetricLineWidget("AWS/ElastiCache", "NetworkBytesOut", "CacheClusterId", "elasticache", "cluster", "sum", "Bytes", objectArns),
    );
    dashboard.addWidgets(
      this.buildMetricLineWidget("AWS/ElastiCache", "IsMaster", "CacheClusterId", "elasticache", "cluster", "max", "Is Master", objectArns),
      this.buildMetricLineWidget("AWS/ElastiCache", "CurrConnections", "CacheClusterId", "elasticache", "cluster", "sum", "Connections", objectArns, true, 65000, 300, 1, "sum"),
      this.buildMetricLineWidget("AWS/ElastiCache", "NewConnections", "CacheClusterId", "elasticache", "cluster", "sum", "Connections", objectArns, true, 20000, 300, 1, "sum"),
      this.buildMetricLineWidget("AWS/ElastiCache", "Evictions", "CacheClusterId", "elasticache", "cluster", "sum", "Evictions", objectArns),
    );

    //RDS
    dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# RDS\n[button:primary:Jump To RDS Service Console](https://console.aws.amazon.com/rds/home)\n', width: 24}));
    dashboard.addWidgets(
      this.buildMetricLineWidget("AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "rds", "db", "max", "%Used", objectArns),
      this.buildMetricLineWidget("AWS/RDS", "ReadIOPS", "DBInstanceIdentifier", "rds", "db", "avg", "I/O operations per second", objectArns),
      this.buildMetricLineWidget("AWS/RDS", "WriteIOPS", "DBInstanceIdentifier", "rds", "db", "avg", "I/O operations per second", objectArns),
      this.buildMetricLineWidget("AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", "rds", "db", "sum", "Connections", objectArns),
    );
  }

  //// Functions
    buildMetricLineWidget(nameSpace: string, metricName: string, dimensionName: string, arnServiceFilter: string, arnTypeFilter: string, statistic: string, unitDescription: string, objectArns: any, alarmEnabled: boolean = false, alarmThresh?: number, alarmPeriod?: number, alarmEval?: number, alarmStatistic?: string): GraphWidget {

    var myMetrics = new Array<Metric>();

    for (let i of objectArns) {
      i = i.replace(/"/g, '');
      i = i.replace(/\//g, ":");
      var splits = i.split(":");
      if (splits[2] === arnServiceFilter && splits[5] === arnTypeFilter) {
        let myMetric = this.buildMetric(nameSpace, metricName, dimensionName, splits[6], splits[3], statistic);
        myMetrics.push(myMetric)
        if (alarmEnabled === true){
          var alarmprefix = new String (splits[6]);
          this.buildAlarm(myMetric, alarmprefix.concat(metricName), Number(alarmThresh), Number(alarmPeriod), Number(alarmEval), String(alarmStatistic));
        }
      };
    };

    return new GraphWidget({
      title: metricName,
      left: myMetrics,
      leftYAxis: {
        label: unitDescription,
        showUnits: false,
        },
      })
    }

    buildMetric(nameSpace: string, metricName: string, dName: string, dValue: string, regionName: string, statistic: string): Metric {

      var str1 = new String( '{"' );
      var str2 = new String( dName );
      var myKeyPair = str1.concat(str2.toString(),'": "',dValue.toString(),'"}');
      var myKeyPairJSON = JSON.parse(myKeyPair);

      return new Metric({
          namespace: nameSpace,
          label: dValue,
          metricName: metricName,
          dimensions: myKeyPairJSON,
          statistic: statistic,
          region: regionName
      });
    }

    buildAlarm(myMetric: Metric, alarmName: string, aThresh: number, aPeriod: number, aEval: number, aStatistic: string): Alarm {

      return new Alarm(this, alarmName, {
      metric: myMetric,
      threshold: aThresh,
      period: cdk.Duration.seconds(aPeriod),
      evaluationPeriods: aEval,
      statistic: aStatistic
      });
    }
}
