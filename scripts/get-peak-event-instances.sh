#!/bin/bash

declare -a regions=(
"eu-north-1"
"ap-south-1"
"eu-west-3"
"eu-west-2"
"eu-west-1"
"ap-northeast-3"
"ap-northeast-2"
"ap-northeast-1"
"sa-east-1"
"ca-central-1"
"ap-southeast-1"
"ap-southeast-2"
"eu-central-1"
"us-east-1"
"us-east-2"
"us-west-1"
"us-west-2"
)

arns=()

for i in "${regions[@]}"
  do
  arns+=($(aws resourcegroupstaggingapi get-resources \
  --region $i \
  --tag-filters Key=PeakEvent,Values=true \
  --output json | jq .ResourceTagMappingList[].ResourceARN))
  done

echo "Script will Generate Cloud Formation for the following AWS Tagged Objects"
printf '%s\n' "${arns[@]}" | jq -R . | jq -s .

export CDKDIR=./source

export CMD1="cdk synth -c arnsJson='$(printf '%s\n' \"${arns[@]}\" | jq -R . | jq -s . | tr -d '\n')'"
export CMD2="cdk deploy --profile cw -c arnsJson='$(printf '%s\n' \"${arns[@]}\" | jq -R . | jq -s . | tr -d '\n')'"

cd $CDKDIR
eval $CMD1
eval $CMD2
cd ../
