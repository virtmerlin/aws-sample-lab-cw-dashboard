//Import Core Node Deps
import cdk = require('@aws-cdk/core');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import {GraphWidget, Metric, Alarm, MathExpression, YAxisProps} from "@aws-cdk/aws-cloudwatch";

//Define empty sorted Arrays for supported widget types
var arnsASG = new Array<String>();
var arnsEC2 = new Array<String>();
var arnsElasticache = new Array<String>();
var arnsRDS = new Array<String>();

//Create Dashboard Stack
export class SourceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const dashboard = new cloudwatch.Dashboard(this, 'PeakEventDashboard', {dashboardName: 'Peak_Event_Dashboard'});

    //Get & Sort flat array of tagged Arns from context input arg
    const arnsJson = this.node.tryGetContext('arnsJson');
    const objectArns = JSON.parse(arnsJson);
    this.parseArnsJason(objectArns);

    //ASG
    if (arnsASG && arnsASG.length > 0){
      dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# Auto Scaling Groups\n[button:primary:Jump To EC2 Service Console](https://console.aws.amazon.com/ec2/v2/home)\n', width: 24}));
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/EC2", "CPUUtilization", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "max", "%Used", arnsASG),
        this.buildMetricLineWidget("AWS/EC2", "NetworkIn", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "avg", "Bytes", arnsASG),
        this.buildMetricLineWidget("AWS/EC2", "NetworkOut", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "avg", "Bytes", arnsASG),
        this.buildMetricLineWidget("AWS/EC2", "StatusCheckFailed", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "max", "isFailed", arnsASG),
      );
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/AutoScaling", "GroupInServiceInstances", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "avg", "Instances", arnsASG),
        this.buildMetricLineWidget("AWS/AutoScaling", "GroupTerminatingInstances", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "avg", "Instances", arnsASG),
        this.buildMetricLineWidget("AWS/AutoScaling", "GroupPendingInstances", "AutoScalingGroupName", "autoscaling", "autoScalingGroup", "avg", "Instances", arnsASG),
      );
    }

    //EC2
    if (arnsEC2 && arnsEC2.length > 0){
      dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# EC2 Instances\n[button:primary:Jump To EC2 Service Console](https://console.aws.amazon.com/ec2/v2/home)\n', width: 24}));
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/EC2", "CPUUtilization", "InstanceId", "ec2", "instance", "max", "%Used", arnsEC2),
        this.buildMetricLineWidget("AWS/EC2", "NetworkIn", "InstanceId", "ec2", "instance", "avg", "Bytes", arnsEC2),
        this.buildMetricLineWidget("AWS/EC2", "NetworkOut", "InstanceId", "ec2", "instance", "avg", "Bytes", arnsEC2),
        this.buildMetricLineWidget("AWS/EC2", "StatusCheckFailed", "InstanceId", "ec2", "instance", "max", "isFailed", arnsEC2),
      );
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/EC2", "DiskReadBytes", "InstanceId", "ec2", "instance", "avg", "Bytes", arnsEC2),
        this.buildMetricLineWidget("AWS/EC2", "DiskReadOps", "InstanceId", "ec2", "instance", "avg", "IOps", arnsEC2),
        this.buildMetricLineWidget("AWS/EC2", "DiskWriteBytes", "InstanceId", "ec2", "instance", "avg", "Bytes", arnsEC2),
        this.buildMetricLineWidget("AWS/EC2", "DiskWriteOps", "InstanceId", "ec2", "instance", "avg", "IOps", arnsEC2),
      );
    }
    //ElastiCache
    if (arnsElasticache && arnsElasticache.length > 0){
      dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# Elasticache\n[button:primary:Jump To Elasticache Service Console](https://console.aws.amazon.com/elasticache/home)\n', width: 24}));
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/ElastiCache", "CPUUtilization", "CacheClusterId", "elasticache", "cluster", "avg", "%Used", arnsElasticache),
        this.buildMetricLineWidget("AWS/ElastiCache", "EngineCPUUtilization", "CacheClusterId", "elasticache", "cluster", "avg", "%Used", arnsElasticache, true, 90, 300, 1, "sum"),
        this.buildMetricLineWidget("AWS/ElastiCache", "FreeableMemory", "CacheClusterId", "elasticache", "cluster", "max", "Bytes", arnsElasticache),
        this.buildMetricLineWidget("AWS/ElastiCache", "NetworkBytesOut", "CacheClusterId", "elasticache", "cluster", "sum", "Bytes", arnsElasticache),
      );
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/ElastiCache", "SwapUsage", "CacheClusterId", "elasticache", "cluster", "avg", "Bytes", arnsElasticache),
        this.buildMetricLineWidget("AWS/ElastiCache", "BytesUsedForCache", "CacheClusterId", "elasticache", "cluster", "avg", "Bytes", arnsElasticache),
        this.buildMetricLineWidget("AWS/ElastiCache", "CurrItems", "CacheClusterId", "elasticache", "cluster", "max", "Count of Objects", arnsElasticache),
        this.buildMetricLineWidget("AWS/ElastiCache", "NetworkBytesOut", "CacheClusterId", "elasticache", "cluster", "sum", "Bytes", arnsElasticache),
      );
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/ElastiCache", "IsMaster", "CacheClusterId", "elasticache", "cluster", "max", "Is Master", arnsElasticache),
        this.buildMetricLineWidget("AWS/ElastiCache", "CurrConnections", "CacheClusterId", "elasticache", "cluster", "sum", "Connections", arnsElasticache, true, 65000, 300, 1, "sum"),
        this.buildMetricLineWidget("AWS/ElastiCache", "NewConnections", "CacheClusterId", "elasticache", "cluster", "sum", "Connections", arnsElasticache, true, 20000, 300, 1, "sum"),
        this.buildMetricLineWidget("AWS/ElastiCache", "Evictions", "CacheClusterId", "elasticache", "cluster", "sum", "Evictions", arnsElasticache),
      );
    }
    //RDS
    if (arnsRDS && arnsRDS.length > 0){
      dashboard.addWidgets(new cloudwatch.TextWidget({markdown: '\n# RDS\n[button:primary:Jump To RDS Service Console](https://console.aws.amazon.com/rds/home)\n', width: 24}));
      dashboard.addWidgets(
        this.buildMetricLineWidget("AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "rds", "db", "max", "%Used", arnsRDS),
        this.buildMetricLineWidget("AWS/RDS", "ReadIOPS", "DBInstanceIdentifier", "rds", "db", "avg", "I/O operations per second", arnsRDS),
        this.buildMetricLineWidget("AWS/RDS", "WriteIOPS", "DBInstanceIdentifier", "rds", "db", "avg", "I/O operations per second", arnsRDS),
        this.buildMetricLineWidget("AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", "rds", "db", "sum", "Connections", arnsRDS),
      );
    }
  }

  //// Functions
    parseArnsJason(objectArns: any) {
      for (let i of objectArns) {
        i = i.replace(/"/g, '');
        //i = i.replace(/\//g, ":");
        var splits = i.split(":");
          switch (splits[2]) {
              case "autoscaling":
                arnsASG.push(i);
                break;
              case "ec2":
                arnsEC2.push(i);
                break;
              case "rds":
                arnsRDS.push(i);
                break;
              case "elasticache":
                arnsElasticache.push(i);
                break
           };
        };
    };

    buildMetricLineWidget(nameSpace: string, metricName: string, dimensionName: string, arnServiceFilter: string, arnTypeFilter: string, statistic: string, unitDescription: string, objectArns: any, alarmEnabled: boolean = false, alarmThresh?: number, alarmPeriod?: number, alarmEval?: number, alarmStatistic?: string): GraphWidget {

    var myMetrics = new Array<Metric>();

    for (let i of objectArns) {
      i = i.replace(/"/g, '');
      i = i.replace(/\//g, ":");
      var splits = i.split(":");
      if (splits[2] === arnServiceFilter && splits[5] === arnTypeFilter) {
        if (splits[5] === "autoScalingGroup"){
            var myMetric = this.buildMetric(nameSpace, metricName, dimensionName, splits[8], splits[3], statistic);
          }
        else {
            var myMetric = this.buildMetric(nameSpace, metricName, dimensionName, splits[6], splits[3], statistic);
          }
        myMetrics.push(myMetric);
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
