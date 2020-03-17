import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Source = require('../lib/source-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Source.SourceStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
