"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("aws-cdk-lib/aws-s3");
const sns = require("aws-cdk-lib/aws-sns");
const cdk = require("aws-cdk-lib");
const s3n = require("aws-cdk-lib/aws-s3-notifications");
class MyStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const objectCreateTopic = new sns.Topic(this, 'ObjectCreatedTopic');
        const objectRemovedTopic = new sns.Topic(this, 'ObjectDeletedTopic');
        const bucket = new s3.Bucket(this, 'MyBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        bucket.addObjectCreatedNotification(new s3n.SnsDestination(objectCreateTopic));
        bucket.addObjectRemovedNotification(new s3n.SnsDestination(objectRemovedTopic), { prefix: 'foo/', suffix: '.txt' });
    }
}
const app = new cdk.App();
new MyStack(app, 'sns-bucket-notifications');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLWJ1Y2tldC1ub3RpZmljYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc25zLWJ1Y2tldC1ub3RpZmljYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXlDO0FBQ3pDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsd0RBQXdEO0FBRXhELE1BQU0sT0FBUSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzdCLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNwRSxNQUFNLGtCQUFrQixHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNyRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM3QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFFdEgsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFFN0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzM24gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLW5vdGlmaWNhdGlvbnMnO1xuXG5jbGFzcyBNeVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgb2JqZWN0Q3JlYXRlVG9waWMgPSBuZXcgc25zLlRvcGljKHRoaXMsICdPYmplY3RDcmVhdGVkVG9waWMnKTtcbiAgICBjb25zdCBvYmplY3RSZW1vdmVkVG9waWMgPSBuZXcgc25zLlRvcGljKHRoaXMsICdPYmplY3REZWxldGVkVG9waWMnKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdNeUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBidWNrZXQuYWRkT2JqZWN0Q3JlYXRlZE5vdGlmaWNhdGlvbihuZXcgczNuLlNuc0Rlc3RpbmF0aW9uKG9iamVjdENyZWF0ZVRvcGljKSk7XG4gICAgYnVja2V0LmFkZE9iamVjdFJlbW92ZWROb3RpZmljYXRpb24obmV3IHMzbi5TbnNEZXN0aW5hdGlvbihvYmplY3RSZW1vdmVkVG9waWMpLCB7IHByZWZpeDogJ2Zvby8nLCBzdWZmaXg6ICcudHh0JyB9KTtcblxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBNeVN0YWNrKGFwcCwgJ3Nucy1idWNrZXQtbm90aWZpY2F0aW9ucycpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==