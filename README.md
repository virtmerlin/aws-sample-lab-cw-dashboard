# aws-sample-lab-cw-dashboard
#### Dev/Workstation PreReqs

- BASH
- JQ
- Node/NPM
- CDK
  - `npm install -g aws-cdk` 
- AWS CLI 
  - Must have a valid/working profile ... means u can exec gets

#### Deploy
1. `git clone git@github.com:virtmerlin/aws-sample-lab-cw-dashboard.git`
2. `cd aws-sample-lab-cw-dashboard/source`
3. `npm install typescript`
4. `cd ..`
5. `./scripts/get-peak-event-instances.sh`