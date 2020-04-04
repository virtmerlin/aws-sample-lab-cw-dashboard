# aws-sample-lab-cw-dashboard
### Summary

This project uses the [AWS CDK](https://aws.amazon.com/cdk/) (Cloud Development Toolkit) to create a CW Dashboard & CW Alarms based on objects that can be tagged in AWS. The project can be used to automatically create/update Dashboard & Alarms with base KPIs to monitor for Peak Events.

![DashBoardImage](https://github.com/virtmerlin/aws-sample-lab-cw-dashboard/blob/master/images/dashboard.png "dashboard")

#### (1) Setup Dev/Workstation PreReqs

A development/CICD pipeline function or instance image will be required to generate/update the dashbaord.  The [AWS CDK](https://aws.amazon.com/cdk/) is the key component to accomplish this, and can be supported on Mac OSX or Linux,  this set of provided instructions to setup your dev workstation to push the Dashbord is based on using an Amazon Linux AMI.

1. Launch new EC2 instance [AMI Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/)
2. Install git & jq: 
    - `sudo yum install -y git jq`
3. Install node:
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
    - `. ~/.nvm/nvm.sh`
    - `nvm install node`
4. Install AWS CDK: 
    - `npm install -g aws-cdk`
5. Clone the repo locally to the workstation:
    - `git clone https://github.com/virtmerlin/aws-sample-lab-cw-dashboard.git`
6. Install Required Node Modules for the project:
    - `cd aws-sample-lab-cw-dashboard/source`
    - `npm install typescript '@aws-cdk/core' '@aws-cdk/aws-cloudwatch'`
    - `npx npm-check-updates -u`
    - `cd ..`
7. Setup Your AWS CLI:
    - `aws configure`
	 - _*NOTE:*_ AWS employees using thier corp accounts will also have to make sure thier Isengard session token is injected into thier ~/.aws/credentials file.

#### (2) Tag AWS Account Objects to monitor

1. Open AWS Console & Navigate to [Tag Editor](https://us-west-1.console.aws.amazon.com/resource-groups/tag-editor/find-resources)
2. Tag Objects you want to be monitored with:
     `PeakEvent:true`

#### (3) Generate Cloudwatch Dashboard & Alarms

1. `cd [your_git_project_root_folder]/aws-sample-lab-cw-dashboard`
2. `./scripts/get-peak-event-instances.sh [your_aws_cli_profilename: ex ... default]`


IFF: No errors, you will see ...

- A jq output of all of the tagged AWS resources that will be parsed to add to the dashboard
- A dump of the generated CloudFormation for the dashboard & alarms (same as running `cdk synth`)
- A Console log of the creation/update of the CloudFormation Stack in your AWS account. (same as running `cdk deploy`)

When complete you should be able to navaigate to the generated Peak Event Dashboard.


#### FAQ

- _*Q*_: Can the dashboard add AWS resources I tag after the dashboard is created?
   - _*A*_: Yes,  re-run step 3 whenever related AWS object tags have been added/removed.

- _*Q*_: Can I add New Metrics or Alarms?
   - _*A*_: Yes,  update the `source/lib/source-stack.ts` code and rerun step 3.
       - TBD: Add widget function explanation for this example:
       - `this.buildMetricLineWidget("AWS/ElastiCache", "EngineCPUUtilization", "CacheClusterId", "elasticache", "cluster", "avg", "%Used", objectArns, true, 90, 300, 1, "sum"),`
