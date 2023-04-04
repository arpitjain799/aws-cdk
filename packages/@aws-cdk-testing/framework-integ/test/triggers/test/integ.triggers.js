"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const sns = require("aws-cdk-lib/aws-sns");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const triggers = require("aws-cdk-lib/triggers");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'MyStack');
const topic1 = new sns.Topic(stack, 'Topic1');
const topic2 = new sns.Topic(stack, 'Topic2');
const trigger = new triggers.TriggerFunction(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function() { console.log("hi"); };'),
    executeBefore: [topic1],
});
trigger.executeAfter(topic2);
new triggers.TriggerFunction(stack, 'MySecondFunction', {
    runtime: lambda.Runtime.NODEJS_16_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function() { console.log("hello"); };'),
});
new integ.IntegTest(app, 'TriggerTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudHJpZ2dlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy50cmlnZ2Vycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFpRDtBQUNqRCwyQ0FBMkM7QUFDM0MsNkNBQXlDO0FBQ3pDLG9EQUFvRDtBQUNwRCxpREFBaUQ7QUFFakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUV4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFOUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDaEUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztJQUNuQyxPQUFPLEVBQUUsZUFBZTtJQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsc0RBQXNELENBQUM7SUFDcEYsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ3hCLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtJQUN0RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0lBQ25DLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5REFBeUQsQ0FBQztDQUN4RixDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRTtJQUN0QyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIHRyaWdnZXJzIGZyb20gJ2F3cy1jZGstbGliL3RyaWdnZXJzJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG5jb25zdCB0b3BpYzEgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMxJyk7XG5jb25zdCB0b3BpYzIgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMyJyk7XG5cbmNvbnN0IHRyaWdnZXIgPSBuZXcgdHJpZ2dlcnMuVHJpZ2dlckZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jdGlvbicsIHtcbiAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5oYW5kbGVyID0gZnVuY3Rpb24oKSB7IGNvbnNvbGUubG9nKFwiaGlcIik7IH07JyksXG4gIGV4ZWN1dGVCZWZvcmU6IFt0b3BpYzFdLFxufSk7XG5cbnRyaWdnZXIuZXhlY3V0ZUFmdGVyKHRvcGljMik7XG5cbm5ldyB0cmlnZ2Vycy5UcmlnZ2VyRnVuY3Rpb24oc3RhY2ssICdNeVNlY29uZEZ1bmN0aW9uJywge1xuICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTZfWCxcbiAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbigpIHsgY29uc29sZS5sb2coXCJoZWxsb1wiKTsgfTsnKSxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ1RyaWdnZXJUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=