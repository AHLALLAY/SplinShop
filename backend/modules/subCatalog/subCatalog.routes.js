import express from 'express';
import subCatalogCtrl from './subCatalog.ctrl.js';

const router = express.Router();

router.get('/catalog/:catalogId', subCatalogCtrl.getByCatalog);

export default router;
