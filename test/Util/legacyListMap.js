const { describe, it, expect, db } = require('../base');
const legacyListMap = require('../../src/Util/legacyListMap');

describe('legacyListMap', () => {
    it('converts a legacy ID to the target ID correctly', done => {
        db.select().from('legacy_ids').then(legacy => {
            const id = legacy[0].id;
            const target = legacy[0].target;
            legacyListMap(db, id).then(test => {
                expect(test).to.equal(target);
                done();
            });
        });
    });
});
