import useEndPoint from "./apiHandler";

class Catalog {
    async loadCatalog() { return await useEndPoint('/catalog'); }

    async addCatalog(catalog) {
        const body = new FormData();
        body.append('name', catalog.name);
        body.append('slug', catalog.slug);
        body.append('description', catalog.description);
        if(catalog.image) body.append('image', catalog.image);
        
        const response = await useEndPoint('/catalog', "POST", body);
        return response.data;
    }

}

export default new Catalog();