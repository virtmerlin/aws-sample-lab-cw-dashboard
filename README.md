# aws-sample-lab-cw-dashboard
### Summary

This project uses the AWS CDK (Cloud Development Toolkit) to create a CW Dashboard & CW Alarms based on objects that are tagged for the event.

![DashBoardImage](https://github.com/virtmerlin/aws-sample-lab-cw-dashboard/blob/master/images/dashboard.png "dashboard")

#### (1) Setup Dev/Workstation PreReqs

- BASH
- JQ
- Node/NPM
- CDK
  - `npm install -g aws-cdk` 
- AWS CLI 
  - Must have a valid/working profile & credentials to get tagged arns via `aws resourcegroupstaggingapi` ... means u can exec commands with it and get results

#### (2) Tag AWS Account Objects to monitor

1. Open Console & Navigate to [Tag Editor](https://us-west-1.console.aws.amazon.com/resource-groups/tag-editor/find-resources)
2. Tag Objects you want to be monitored with:
     `PeakEvent:true`

#### (3) Deploy Project & Generate Dashboard
1. `git clone git@github.com:virtmerlin/aws-sample-lab-cw-dashboard.git`
2. `cd aws-sample-lab-cw-dashboard/source`
3. `npm install typescript`
4. `cd ..`
5. `./scripts/get-peak-event-instances.sh [your aws cli profile]`