"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const app = new cdk.App();
const stackWithLb = new cdk.Stack(app, 'aws-cdk-elbv2-StackWithLb', {
    env: {
        account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
    },
});
const vpc = new ec2.Vpc(stackWithLb, 'VPC', {
    maxAzs: 2,
    vpcName: 'my-vpc-name',
});
const lb = new elbv2.NetworkLoadBalancer(stackWithLb, 'LB', {
    vpc,
    internetFacing: true,
    loadBalancerName: 'my-load-balancer',
});
const listener = lb.addListener('Listener', {
    port: 443,
});
const group = listener.addTargets('TargetGroup', {
    port: 443,
    targets: [new elbv2.IpTarget('10.0.1.1')],
});
new cdk.CfnOutput(stackWithLb, 'NlbArn', {
    value: lb.loadBalancerArn,
    exportName: 'NlbArn',
});
new cdk.CfnOutput(stackWithLb, 'TgArn', {
    value: group.targetGroupArn,
    exportName: 'TgArn',
});
const stackLookup = new integ_tests_alpha_1.IntegTestCaseStack(app, 'aws-cdk-elbv2-integ-StackUnderTest', {
    env: {
        account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
    },
});
// Load Balancer
const lbByHardcodedArn = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByHardcodedArn', {
    loadBalancerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/network/my-load-balancer/50dc6c495c0c9188',
});
lbByHardcodedArn.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByHardcodedArn_AlarmFlowCount', {
    evaluationPeriods: 1,
    threshold: 0,
});
const lbByCfnOutputsFromAnotherStackOutsideCdk = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByCfnOutputsFromAnotherStackOutsideCdk', {
    loadBalancerArn: cdk.Fn.importValue('NlbArn'),
});
lbByCfnOutputsFromAnotherStackOutsideCdk.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByCfnOutputsFromAnotherStackOutsideCdk_AlarmFlowCount', {
    evaluationPeriods: 1,
    threshold: 0,
});
const lbByCfnOutputsFromAnotherStackWithinCdk = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stackLookup, 'NlbByCfnOutputsFromAnotherStackWithinCdk', {
    loadBalancerArn: lb.loadBalancerArn,
});
lbByCfnOutputsFromAnotherStackWithinCdk.metrics.activeFlowCount().createAlarm(stackLookup, 'NlbByCfnOutputsFromAnotherStackWithinCdk_AlarmFlowCount', {
    evaluationPeriods: 1,
    threshold: 0,
});
// Target Group
const tgByHardcodedArn = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stackLookup, 'TgByHardcodedArn', {
    targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
    loadBalancerArns: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/net/my-load-balancer/50dc6c495c0c9188',
});
tgByHardcodedArn.metrics.healthyHostCount().createAlarm(stackLookup, 'TgByHardcodedArn_HealthyHostCount', {
    evaluationPeriods: 1,
    threshold: 0,
});
const tgByCfnOutputsFromAnotherStackOutsideCdk = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stackLookup, 'TgByCfnOutputsFromAnotherStackOutsideCdk', {
    targetGroupArn: cdk.Fn.importValue('TgArn'),
    loadBalancerArns: cdk.Fn.importValue('NlbArn'),
});
tgByCfnOutputsFromAnotherStackOutsideCdk.metrics.healthyHostCount().createAlarm(stackLookup, 'TgByCfnOutputsFromAnotherStackOutsideCdk_HealthyHostCount', {
    evaluationPeriods: 1,
    threshold: 0,
});
const tgByCfnOutputsFromAnotherStackWithinCdk = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stackLookup, 'TgByCfnOutputsFromAnotherStackWithinCdk', {
    targetGroupArn: group.targetGroupArn,
    loadBalancerArns: lb.loadBalancerArn,
});
tgByCfnOutputsFromAnotherStackWithinCdk.metrics.healthyHostCount().createAlarm(stackLookup, 'TgByCfnOutputsFromAnotherStackWithinCdk_HealthyHostCount', {
    evaluationPeriods: 1,
    threshold: 0,
});
new integ.IntegTest(app, 'elbv2-integ', {
    testCases: [stackLookup],
    enableLookups: true,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmxiLWxvb2t1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm5sYi1sb29rdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCxrRUFBZ0U7QUFDaEUsZ0VBQWdFO0FBRWhFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLEVBQUU7SUFDbEUsR0FBRyxFQUFFO1FBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDekUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7S0FDdkU7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRTtJQUMxQyxNQUFNLEVBQUUsQ0FBQztJQUNULE9BQU8sRUFBRSxhQUFhO0NBQ3ZCLENBQUMsQ0FBQztBQUVILE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUU7SUFDMUQsR0FBRztJQUNILGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGdCQUFnQixFQUFFLGtCQUFrQjtDQUNyQyxDQUFDLENBQUM7QUFDSCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtJQUMxQyxJQUFJLEVBQUUsR0FBRztDQUNWLENBQUMsQ0FBQztBQUNILE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFO0lBQy9DLElBQUksRUFBRSxH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QUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztDQUMvQyxDQUFDLENBQUM7QUFDSCx3Q0FBd0MsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLDJEQUEyRCxFQUFFO0lBQ3hKLGlCQUFpQixFQUFFLENBQUM7SUFDcEIsU0FBUyxFQUFFLENBQUM7Q0FDYixDQUFDLENBQUM7QUFFSCxNQUFNLHVDQUF1QyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUseUNBQXlDLEVBQUU7SUFDekosY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO0lBQ3BDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQ3JDLENBQUMsQ0FBQztBQUNILHVDQUF1QyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsMERBQTBELEVBQUU7SUFDdEosaUJBQWlCLEVBQUUsQ0FBQztJQUNwQixTQUFTLEVBQUUsQ0FBQztDQUNiLENBQUMsQ0FBQztBQUVILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFO0lBQ3RDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUN4QixhQUFhLEVBQUUsSUFBSTtDQUNwQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgSW50ZWdUZXN0Q2FzZVN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2tXaXRoTGIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstZWxidjItU3RhY2tXaXRoTGInLCB7XG4gIGVudjoge1xuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19JTlRFR19BQ0NPVU5UID8/IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gICAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfSU5URUdfUkVHSU9OID8/IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTixcbiAgfSxcbn0pO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFja1dpdGhMYiwgJ1ZQQycsIHtcbiAgbWF4QXpzOiAyLFxuICB2cGNOYW1lOiAnbXktdnBjLW5hbWUnLFxufSk7XG5cbmNvbnN0IGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2tXaXRoTGIsICdMQicsIHtcbiAgdnBjLFxuICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgbG9hZEJhbGFuY2VyTmFtZTogJ215LWxvYWQtYmFsYW5jZXInLFxufSk7XG5jb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgcG9ydDogNDQzLFxufSk7XG5jb25zdCBncm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ1RhcmdldEdyb3VwJywge1xuICBwb3J0OiA0NDMsXG4gIHRhcmdldHM6IFtuZXcgZWxidjIuSXBUYXJnZXQoJzEwLjAuMS4xJyldLFxufSk7XG5uZXcgY2RrLkNmbk91dHB1dChzdGFja1dpdGhMYiwgJ05sYkFybicsIHtcbiAgdmFsdWU6IGxiLmxvYWRCYWxhbmNlckFybixcbiAgZXhwb3J0TmFtZTogJ05sYkFybicsXG59KTtcbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrV2l0aExiLCAnVGdBcm4nLCB7XG4gIHZhbHVlOiBncm91cC50YXJnZXRHcm91cEFybixcbiAgZXhwb3J0TmFtZTogJ1RnQXJuJyxcbn0pO1xuXG5jb25zdCBzdGFja0xvb2t1cCA9IG5ldyBJbnRlZ1Rlc3RDYXNlU3RhY2soYXBwLCAnYXdzLWNkay1lbGJ2Mi1pbnRlZy1TdGFja1VuZGVyVGVzdCcsIHtcbiAgZW52OiB7XG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0FDQ09VTlQgPz8gcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19JTlRFR19SRUdJT04gPz8gcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OLFxuICB9LFxufSk7XG5cbi8vIExvYWQgQmFsYW5jZXJcbmNvbnN0IGxiQnlIYXJkY29kZWRBcm4gPSBlbGJ2Mi5OZXR3b3JrTG9hZEJhbGFuY2VyLmZyb21OZXR3b3JrTG9hZEJhbGFuY2VyQXR0cmlidXRlcyhzdGFja0xvb2t1cCwgJ05sYkJ5SGFyZGNvZGVkQXJuJywge1xuICBsb2FkQmFsYW5jZXJBcm46ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldHdvcmsvbXktbG9hZC1iYWxhbmNlci81MGRjNmM0OTVjMGM5MTg4Jyxcbn0pO1xubGJCeUhhcmRjb2RlZEFybi5tZXRyaWNzLmFjdGl2ZUZsb3dDb3VudCgpLmNyZWF0ZUFsYXJtKHN0YWNrTG9va3VwLCAnTmxiQnlIYXJkY29kZWRBcm5fQWxhcm1GbG93Q291bnQnLCB7XG4gIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICB0aHJlc2hvbGQ6IDAsXG59KTtcblxuY29uc3QgbGJCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrT3V0c2lkZUNkayA9IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIuZnJvbU5ldHdvcmtMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKHN0YWNrTG9va3VwLCAnTmxiQnlDZm5PdXRwdXRzRnJvbUFub3RoZXJTdGFja091dHNpZGVDZGsnLCB7XG4gIGxvYWRCYWxhbmNlckFybjogY2RrLkZuLmltcG9ydFZhbHVlKCdObGJBcm4nKSxcbn0pO1xubGJCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrT3V0c2lkZUNkay5tZXRyaWNzLmFjdGl2ZUZsb3dDb3VudCgpLmNyZWF0ZUFsYXJtKHN0YWNrTG9va3VwLCAnTmxiQnlDZm5PdXRwdXRzRnJvbUFub3RoZXJTdGFja091dHNpZGVDZGtfQWxhcm1GbG93Q291bnQnLCB7XG4gIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICB0aHJlc2hvbGQ6IDAsXG59KTtcblxuY29uc3QgbGJCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrV2l0aGluQ2RrID0gZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlci5mcm9tTmV0d29ya0xvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc3RhY2tMb29rdXAsICdObGJCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrV2l0aGluQ2RrJywge1xuICBsb2FkQmFsYW5jZXJBcm46IGxiLmxvYWRCYWxhbmNlckFybixcbn0pO1xubGJCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrV2l0aGluQ2RrLm1ldHJpY3MuYWN0aXZlRmxvd0NvdW50KCkuY3JlYXRlQWxhcm0oc3RhY2tMb29rdXAsICdObGJCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrV2l0aGluQ2RrX0FsYXJtRmxvd0NvdW50Jywge1xuICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgdGhyZXNob2xkOiAwLFxufSk7XG5cbi8vIFRhcmdldCBHcm91cFxuXG5jb25zdCB0Z0J5SGFyZGNvZGVkQXJuID0gZWxidjIuTmV0d29ya1RhcmdldEdyb3VwLmZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc3RhY2tMb29rdXAsICdUZ0J5SGFyZGNvZGVkQXJuJywge1xuICB0YXJnZXRHcm91cEFybjogJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjp0YXJnZXRncm91cC9teS10YXJnZXQtZ3JvdXAvNTBkYzZjNDk1YzBjOTE4OCcsXG4gIGxvYWRCYWxhbmNlckFybnM6ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldC9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgnLFxufSk7XG50Z0J5SGFyZGNvZGVkQXJuLm1ldHJpY3MuaGVhbHRoeUhvc3RDb3VudCgpLmNyZWF0ZUFsYXJtKHN0YWNrTG9va3VwLCAnVGdCeUhhcmRjb2RlZEFybl9IZWFsdGh5SG9zdENvdW50Jywge1xuICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgdGhyZXNob2xkOiAwLFxufSk7XG5cbmNvbnN0IHRnQnlDZm5PdXRwdXRzRnJvbUFub3RoZXJTdGFja091dHNpZGVDZGsgPSBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAuZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlcyhzdGFja0xvb2t1cCwgJ1RnQnlDZm5PdXRwdXRzRnJvbUFub3RoZXJTdGFja091dHNpZGVDZGsnLCB7XG4gIHRhcmdldEdyb3VwQXJuOiBjZGsuRm4uaW1wb3J0VmFsdWUoJ1RnQXJuJyksXG4gIGxvYWRCYWxhbmNlckFybnM6IGNkay5Gbi5pbXBvcnRWYWx1ZSgnTmxiQXJuJyksXG59KTtcbnRnQnlDZm5PdXRwdXRzRnJvbUFub3RoZXJTdGFja091dHNpZGVDZGsubWV0cmljcy5oZWFsdGh5SG9zdENvdW50KCkuY3JlYXRlQWxhcm0oc3RhY2tMb29rdXAsICdUZ0J5Q2ZuT3V0cHV0c0Zyb21Bbm90aGVyU3RhY2tPdXRzaWRlQ2RrX0hlYWx0aHlIb3N0Q291bnQnLCB7XG4gIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICB0aHJlc2hvbGQ6IDAsXG59KTtcblxuY29uc3QgdGdCeUNmbk91dHB1dHNGcm9tQW5vdGhlclN0YWNrV2l0aGluQ2RrID0gZWxidjIuTmV0d29ya1RhcmdldEdyb3VwLmZyb21UYXJnZXRHcm91cEF0dHJpYnV0ZXMoc3RhY2tMb29rdXAsICdUZ0J5Q2ZuT3V0cHV0c0Zyb21Bbm90aGVyU3RhY2tXaXRoaW5DZGsnLCB7XG4gIHRhcmdldEdyb3VwQXJuOiBncm91cC50YXJnZXRHcm91cEFybixcbiAgbG9hZEJhbGFuY2VyQXJuczogbGIubG9hZEJhbGFuY2VyQXJuLFxufSk7XG50Z0J5Q2ZuT3V0cHV0c0Zyb21Bbm90aGVyU3RhY2tXaXRoaW5DZGsubWV0cmljcy5oZWFsdGh5SG9zdENvdW50KCkuY3JlYXRlQWxhcm0oc3RhY2tMb29rdXAsICdUZ0J5Q2ZuT3V0cHV0c0Zyb21Bbm90aGVyU3RhY2tXaXRoaW5DZGtfSGVhbHRoeUhvc3RDb3VudCcsIHtcbiAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gIHRocmVzaG9sZDogMCxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2VsYnYyLWludGVnJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja0xvb2t1cF0sXG4gIGVuYWJsZUxvb2t1cHM6IHRydWUsXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=