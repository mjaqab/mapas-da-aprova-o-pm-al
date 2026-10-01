# Project workflow

The deployable sales page lives in `pagina-de-vendas/`.

After completing a requested change to the sales page:

1. Run the production build from `pagina-de-vendas/`.
2. If the build succeeds, create a concise descriptive Git commit.
3. Push the commit to `origin/main`, unless the user explicitly asks not to push.

Never commit secrets, `.env` files, product PDFs, caches, temporary files, `node_modules`, or generated build output.
