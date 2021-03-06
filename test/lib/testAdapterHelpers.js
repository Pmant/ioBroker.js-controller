function register(it, expect, context) {
    // formatValue
    it(context.name + ' ' + context.adapterShortName + ' adapter: Check formatValue', function (done) {
        this.timeout(1000);
        var testValue, testValue2;

        // Test with number
        testValue = context.adapter.formatValue(1000,'.,');
        expect(testValue).to.be.a('string');
        expect(testValue).to.equal('1.000,00');

        // Test against rounding errors
        testValue = context.adapter.formatValue(1000.1994, 3, '.,');
        expect(testValue).to.equal('1.000,199');
        testValue = context.adapter.formatValue(1000.1996, 3,'.,');
        expect(testValue).to.equal('1.000,200');

        // Test with string
        testValue = context.adapter.formatValue('1000', '.,');
        expect(testValue).to.be.a('string');
        expect(testValue).to.equal('1.000,00');

        // Test with an empty format pattern
        testValue = context.adapter.formatValue('1000', ''); //1.000,00
        testValue2 = context.adapter.formatValue('1000', (context.adapter.isFloatComma === undefined) ? '.,' : ((context.adapter.isFloatComma) ? '.,' : ',.')); //1.000,00
        expect(testValue).to.equal(testValue2);

        testValue = context.adapter.formatValue(undefined, '.,');
        expect(testValue).to.be.empty;
        done();
    });

    // formatDate
    it(context.name + ' ' + context.adapterShortName + ' adapter: Check formatDate', function (done) {
        this.timeout(1000);
        var testDate = new Date(0);
        var testStringDate, testStringDate2;

        expect(context.adapter.formatDate(new Date())).to.be.a('string');

        testStringDate = context.adapter.formatDate(testDate, 'YYYY-MM-DD');
        expect(testStringDate).to.be.a('string');
        expect(testStringDate).to.equal('1970-01-01');

        // expect 1 hour as output
        testStringDate = context.adapter.formatDate(1 * 3600000 + 1 * 60000 + 42000 + 1, 'duration', 'hh.mm.ss.sss');
        expect(testStringDate).to.be.a('string');
        expect(testStringDate).to.equal('01.01.42.001'); // 1 hour, 1 minute, 42 seconds, 1 milliseconds

        // positive test with "Februar"
        testStringDate = context.adapter.formatDate('23 Februar 2014', 'YYYY.MM.DD');
        expect(testStringDate).to.be.a('string');
        expect(testStringDate).to.contain('2014.02.23');

        // negative test, give the wrong date "Fabruar"
        testStringDate = context.adapter.formatDate('23 Fabruar 2014', 'YYYY.MM.DD');
        expect(testStringDate).to.be.a('string');
        expect(testStringDate).to.contain('NaN'); // NaN.NaN.NaN

        testStringDate = context.adapter.formatDate(undefined, 'YYYY.MM.DD');
        expect(testStringDate).to.be.empty;
        done();
    });


    //_fixId
    it(context.name + ' ' + context.adapterShortName + ' adapter: Check _fixId', function (done) {
        this.timeout(1000);
        var adapterName = context.adapter.name;
        expect(adapterName).to.equal('test');
        var adapterInstance = context.adapter.instance;
        expect(adapterInstance).to.equal(0);
        var adapterNamespace = context.adapter.namespace;
        expect(adapterNamespace).to.equal(adapterName + '.' + adapterInstance);

        var testString;
        //test with Object empty
        testString = context.adapter._fixId({});
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.');

        //test with Object state
        testString = context.adapter._fixId({
            state: 'baz'
        });
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.baz');

        //test with Object state + channel
        testString = context.adapter._fixId({
            state: 'baz',
            channel: 'bar'
        });
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.bar.baz');

        //test with Object state + channel + device
        testString = context.adapter._fixId({
            state: 'baz',
            channel: 'bar',
            device: 'foo'
        });
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.foo.bar.baz');

        //test with string empty
        testString = context.adapter._fixId('');
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.');

        //test with string state
        testString = context.adapter._fixId('baz');
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.baz');

        //test with string state + channel
        testString = context.adapter._fixId('bar.baz');
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.bar.baz');

        //test with string state + channel + device
        testString = context.adapter._fixId('foo.bar.baz');
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.foo.bar.baz');

        //test with already fixed ID
        testString = context.adapter._fixId(adapterNamespace + '.foo.bar.baz');
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.foo.bar.baz');

        //test composition
        testString = context.adapter._fixId(context.adapter._fixId('foo.bar.baz'));
        expect(testString).to.be.a('string');
        expect(testString).to.equal(adapterNamespace + '.foo.bar.baz');

        done();
    });

    // idToDCS
    it(context.name + ' ' + context.adapterShortName + ' adapter: Check idToDCS', function (done) {
        this.timeout(1000);
        var testString;

        //test no id
        testString = context.adapter.idToDCS();
        expect(testString).to.equal(null);

        //test invalid id
        testString = context.adapter.idToDCS('device.channel.state');
        expect(testString).to.equal(null);

        //test valid id
        testString = context.adapter.idToDCS(context.adapter.namespace + '.device.channel.state');
        expect(testString).to.deep.equal({device: 'device', channel: 'channel', state: 'state'});

        done();
    });

    // _DCS2ID
    it(context.name + ' ' + context.adapterShortName + ' adapter: Check _DCS2ID', function (done) {
        this.timeout(1000);
        var testString;

        //test no parameters
        testString = context.adapter._DCS2ID();
        expect(testString).to.equal('');

        //test device
        testString = context.adapter._DCS2ID('device');
        expect(testString).to.equal('device');

        //test device + channel
        testString = context.adapter._DCS2ID('device', 'channel');
        expect(testString).to.equal('device.channel');

        //test device + channel + stateOrPoint (true)
        testString = context.adapter._DCS2ID('device', 'channel', true);
        expect(testString).to.equal('device.channel.');

        //test device + channel + stateOrPoint (false)
        testString = context.adapter._DCS2ID('device', 'channel', false);
        expect(testString).to.equal('device.channel');

        //test device + channel + stateOrPoint (string)
        testString = context.adapter._DCS2ID('device', 'channel', 'state');
        expect(testString).to.equal('device.channel.state');

        //test device + stateOrPoint (string)
        testString = context.adapter._DCS2ID('device', null, 'state');
        expect(testString).to.equal('device.state');

        //test channel + stateOrPoint (string)
        testString = context.adapter._DCS2ID(null, 'channel', 'state');
        expect(testString).to.equal('channel.state');

        //test stateOrPoint (true)
        testString = context.adapter._DCS2ID(null, null, true);
        expect(testString).to.equal('');

        //test stateOrPoint (false)
        testString = context.adapter._DCS2ID(null, null, false);
        expect(testString).to.equal('');

        //test stateOrPoint (string)
        testString = context.adapter._DCS2ID(null, null, 'state');
        expect(testString).to.equal('state');

        done();
    });
}


module.exports.register = register;