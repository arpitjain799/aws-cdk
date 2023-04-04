"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eks = require("aws-cdk-lib/aws-eks");
const iam = require("aws-cdk-lib/aws-iam");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Create a state machine with a task state to use the Kubernetes API to read Kubernetes resource objects
 * via a Kubernetes API endpoint.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eks-call-integ-test');
const cluster = new eks.Cluster(stack, 'EksCluster', {
    version: eks.KubernetesVersion.V1_21,
    clusterName: 'eksCluster',
});
const executionRole = new iam.Role(stack, 'Role', {
    roleName: 'stateMachineExecutionRole',
    assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
});
cluster.awsAuth.addMastersRole(executionRole);
const callJob = new aws_stepfunctions_tasks_1.EksCall(stack, 'Call a EKS Endpoint', {
    cluster: cluster,
    httpMethod: aws_stepfunctions_tasks_1.HttpMethods.GET,
    httpPath: '/api/v1/namespaces/default/pods',
});
const chain = sfn.Chain.start(callJob);
const sm = new sfn.StateMachine(stack, 'StateMachine', {
    definition: chain,
    role: executionRole,
    timeout: cdk.Duration.seconds(30),
});
new cdk.CfnOutput(stack, 'stateMachineArn', {
    value: sm.stateMachineArn,
});
new integ.IntegTest(app, 'aws-stepfunctions-tasks-eks-call-integ', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNhbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHFEQUFxRDtBQUNyRCxtQ0FBbUM7QUFDbkMsb0RBQW9EO0FBQ3BELGlGQUEyRTtBQUUzRTs7Ozs7Ozs7OztHQVVHO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO0FBRWhGLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ25ELE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztJQUNwQyxXQUFXLEVBQUUsWUFBWTtDQUMxQixDQUFDLENBQUM7QUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUNoRCxRQUFRLEVBQUUsMkJBQTJCO0lBQ3JDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztDQUM1RCxDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUU5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlDQUFPLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUFFO0lBQ3hELE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFVBQVUsRUFBRSxxQ0FBVyxDQUFDLEdBQUc7SUFDM0IsUUFBUSxFQUFFLGlDQUFpQztDQUM1QyxDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUV2QyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNyRCxVQUFVLEVBQUUsS0FBSztJQUNqQixJQUFJLEVBQUUsYUFBYTtJQUNuQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0NBQ2xDLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7SUFDMUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQzFCLENBQUMsQ0FBQztBQUVILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsd0NBQXdDLEVBQUU7SUFDakUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVrcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWtzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgRWtzQ2FsbCwgSHR0cE1ldGhvZHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiBDcmVhdGUgYSBzdGF0ZSBtYWNoaW5lIHdpdGggYSB0YXNrIHN0YXRlIHRvIHVzZSB0aGUgS3ViZXJuZXRlcyBBUEkgdG8gcmVhZCBLdWJlcm5ldGVzIHJlc291cmNlIG9iamVjdHNcbiAqIHZpYSBhIEt1YmVybmV0ZXMgQVBJIGVuZHBvaW50LlxuICpcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqIFRoZSBnZW5lcmF0ZWQgU3RhdGUgTWFjaGluZSBjYW4gYmUgZXhlY3V0ZWQgZnJvbSB0aGUgQ0xJIChvciBTdGVwIEZ1bmN0aW9ucyBjb25zb2xlKVxuICogYW5kIHJ1bnMgd2l0aCBhbiBleGVjdXRpb24gc3RhdHVzIG9mIGBTdWNjZWVkZWRgLlxuICpcbiAqIC0tIGF3cyBzdGVwZnVuY3Rpb25zIHN0YXJ0LWV4ZWN1dGlvbiAtLXN0YXRlLW1hY2hpbmUtYXJuIDxzdGF0ZS1tYWNoaW5lLWFybi1mcm9tLW91dHB1dD4gcHJvdmlkZXMgZXhlY3V0aW9uIGFyblxuICogLS0gYXdzIHN0ZXBmdW5jdGlvbnMgZGVzY3JpYmUtZXhlY3V0aW9uIC0tZXhlY3V0aW9uLWFybiA8c3RhdGUtbWFjaGluZS1hcm4tZnJvbS1vdXRwdXQ+IHJldHVybnMgYSBzdGF0dXMgb2YgYFN1Y2NlZWRlZGBcbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzLWVrcy1jYWxsLWludGVnLXRlc3QnKTtcblxuY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0Vrc0NsdXN0ZXInLCB7XG4gIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8yMSxcbiAgY2x1c3Rlck5hbWU6ICdla3NDbHVzdGVyJyxcbn0pO1xuXG5jb25zdCBleGVjdXRpb25Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgcm9sZU5hbWU6ICdzdGF0ZU1hY2hpbmVFeGVjdXRpb25Sb2xlJyxcbiAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3N0YXRlcy5hbWF6b25hd3MuY29tJyksXG59KTtcblxuY2x1c3Rlci5hd3NBdXRoLmFkZE1hc3RlcnNSb2xlKGV4ZWN1dGlvblJvbGUpO1xuXG5jb25zdCBjYWxsSm9iID0gbmV3IEVrc0NhbGwoc3RhY2ssICdDYWxsIGEgRUtTIEVuZHBvaW50Jywge1xuICBjbHVzdGVyOiBjbHVzdGVyLFxuICBodHRwTWV0aG9kOiBIdHRwTWV0aG9kcy5HRVQsXG4gIGh0dHBQYXRoOiAnL2FwaS92MS9uYW1lc3BhY2VzL2RlZmF1bHQvcG9kcycsXG59KTtcblxuY29uc3QgY2hhaW4gPSBzZm4uQ2hhaW4uc3RhcnQoY2FsbEpvYik7XG5cbmNvbnN0IHNtID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gIGRlZmluaXRpb246IGNoYWluLFxuICByb2xlOiBleGVjdXRpb25Sb2xlLFxuICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG59KTtcblxubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdzdGF0ZU1hY2hpbmVBcm4nLCB7XG4gIHZhbHVlOiBzbS5zdGF0ZU1hY2hpbmVBcm4sXG59KTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcy1la3MtY2FsbC1pbnRlZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBjZGtDb21tYW5kT3B0aW9uczoge1xuICAgIGRlcGxveToge1xuICAgICAgYXJnczoge1xuICAgICAgICByb2xsYmFjazogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==