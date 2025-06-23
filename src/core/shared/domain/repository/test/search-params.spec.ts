import { SearchParams } from "../search-params";


describe("SeachParams Unit testss", () => {

    it("PageProp", () => {
        const params = new SearchParams();
        expect(params.page).toBe(1);

        const arrange = [
            { page: null, expected: 1 },
            { page: undefined, expected: 1 },
            { page: "", expected: 1 },
            { page: "fake", expected: 1 },
            { page: 0, expected: 1 },
            { page: -1, expected: 1 },
            { page: 5.5, expected: 1 },
            { page: true, expected: 1 },
            { page: false, expected: 1 },
            { page: {}, expected: 1 },
            { page: 1, expected: 1 },
            { page: 2, expected: 2 },
            { page: 3, expected: 3 },
            { page: 4, expected: 4 }
        ];
        arrange.forEach((item) => {
            expect(new SearchParams({ page: item.page as any }).page).toBe(item.expected);
        });

    })

    it("PerPageProp", () => {
        const params = new SearchParams();
        expect(params.per_page).toBe(15);

        const arrange = [
            { per_page: null, expected: 15 },
            { per_page: undefined, expected: 15 },
            { per_page: "", expected: 15 },
            { per_page: "fake", expected: 15 },
            { per_page: 0, expected: 15 },
            { per_page: -1, expected: 15 },
            { per_page: 5.5, expected: 15 },
            { per_page: true, expected: 15 },
            { per_page: false, expected: 15 },
            { per_page: {}, expected: 15 },
            { per_page: 1, expected: 1 },
            { per_page: 2, expected: 2 },
            { per_page: 3, expected: 3 },
            { per_page: 4, expected: 4 }
        ];
        arrange.forEach((item) => {
            expect(new SearchParams({ per_page: item.per_page as any }).per_page).toBe(item.expected);
        });

    })

    it("SortProp", () => {
        const params = new SearchParams();
        expect(params.sort).toBeNull();

        const arrange = [
            { sort: null, expected: null },
            { sort: undefined, expected: null },
            { sort: "", expected: null as any },
            { sort: "fake", expected: null },
            { sort: 1, expected: null as any },
            { sort: 2, expected: null },
            { sort: 3, expected: null },
            { sort: 4, expected: null }
        ];
        arrange.forEach((item) => {
            expect(new SearchParams({ page: item.sort as any }).sort).toBe(item.expected);
        });

    })

    it("SortDirProp", () => {
        let params = new SearchParams();
        expect(params.sort_dir).toBeNull();

        params = new SearchParams({ sort_dir: null });
        expect(params.sort_dir).toBeNull();

        params = new SearchParams({ sort_dir: undefined });
        expect(params.sort_dir).toBeNull();

        //@ts-ignore
        params = new SearchParams({ sort_dir: "" });
        expect(params.sort_dir).toBeNull();

        const arrange = [
            { sort_dir: null, expected: "asc" },
            { sort_dir: undefined, expected: "asc" },
            { sort_dir: "", expected: "asc" },
            { sort_dir: "fake", expected: "asc" },
            { sort_dir: 0, expected: "asc" },
            { sort_dir: "asc", expected: "asc" },
            { sort_dir: "desc", expected: "desc" },
            { sort_dir: "ASC", expected: "asc" },
            { sort_dir: "DESC", expected: "desc" }
        ];
        arrange.forEach((item) => {
            expect(new SearchParams({ sort: "field", sort_dir: item.sort_dir as any }).sort_dir).toBe(item.expected);
        });

    })

    it("FilterProp", () => {
        const params = new SearchParams();
        expect(params.filter).toBeNull();

        const arrange = [
            { filter: null, expected: null },
            { filter: undefined, expected: null },
            { filter: "", expected: null as any },
            { filter: 0, expected: "0" },
            { filter: -1, expected: "-1" },
            { filter: 5.5, expected: "5.5" },
            { filter: true, expected: "true" },
            { filter: false, expected: "false" },
            { filter: {}, expected: "[object Object]" },
            { filter: "field", expected: "field" }
        ];
        arrange.forEach((item) => {
            expect(new SearchParams({ filter: item.filter as any }).filter).toBe(item.expected);
        });

    })



});