import useEndPoint from "./apiHandler";

class Catalog {
    async loadCatalog() { return await useEndPoint('/catalog'); }

    async addCatalog(catalog) {
        const body = {
            name: catalog.name,
            slug: catalog.slug,
            pic: catalog.pic,
            description: catalog.description
        };
        const response = await useEndPoint('/catalog', "POST", body);
        return response.data;
    }

}

export default new Catalog();