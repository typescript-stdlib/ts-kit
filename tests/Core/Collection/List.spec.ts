import List from '../../../lib/Core/Collection/List';
import Collection from '../../../lib/Core/Collection/Collection';


describe('Core.Collection.List', () => {
    describe('#constructor()', () => {
        it('should create new instance of List class', () => {
            let list: List<string> = null;

            expect(function () {
                list = new List<string>();
            }).not.toThrow();

            expect(list).toBeInstanceOf(List);
            expect(list).toBeInstanceOf(Collection);
        });
    });


    describe('#insert()', () => {
        it('should insert item into list', () => {
            let list: List<string> = new List<string>();

            expect(list.length).toEqual(0);

            list.insert('one', 0);

            expect(list.length).toEqual(1);
            expect(list[0]).toEqual('one');
            expect(list[1]).toEqual(undefined);
            expect(list.toArray()).toEqual(['one']);

            list.insert('two', 1);

            expect(list.length).toEqual(2);
            expect(list[0]).toEqual('one');
            expect(list[1]).toEqual('two');
            expect(list[2]).toEqual(undefined);
            expect(list.toArray()).toEqual(['one', 'two']);

            list.insert('three', 0);

            expect(list.length).toEqual(3);
            expect(list[0]).toEqual('three');
            expect(list[1]).toEqual('one');
            expect(list[2]).toEqual('two');
            expect(list[3]).toEqual(undefined);
            expect(list.toArray()).toEqual(['three', 'one', 'two']);
        });
    });


    describe('#removeAt()', () => {
        it('should remove item with specified index from list', () => {
            let list: List<string> = new List<string>(['one', 'two']);

            expect(list.length).toEqual(2);
            expect(list[0]).toEqual('one');
            expect(list[1]).toEqual('two');

            expect(list.removeAt(1)).toEqual('two');
            expect(list.length).toEqual(1);
            expect(list[0]).toEqual('one');
            expect(list[1]).toEqual(undefined);

            expect(list.removeAt(0)).toEqual('one');
            expect(list.length).toEqual(0);
            expect(list[0]).toEqual(undefined);
            expect(list[1]).toEqual(undefined);
        });
    });


    describe('#indexOf()', () => {
        it('should get index of given item in current sequence', () => {
            let list: List<string> = new List<string>(['one', 'two']);

            expect(list.indexOf('one')).toEqual(0);
            expect(list.indexOf('two')).toEqual(1);
            expect(list.indexOf('three')).toEqual(-1);
        });
    });


});
