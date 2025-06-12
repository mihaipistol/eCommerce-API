import { SQL, and, eq, like, or } from 'drizzle-orm';
import { Request, Response } from 'express';
import getDatabase from '../../db';
import { productsTable } from '../../db/schema/products';
import { productsTagsTable } from '../../db/schema/productsTags';
import { tagsTable } from '../../db/schema/tags';

export async function selectProductById(
  req: Request,
  res: Response,
): Promise<void> {
  const db = await getDatabase();
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function selectProducts(
  req: Request,
  res: Response,
): Promise<void> {
  const db = await getDatabase();
  try {
    const { category, brand, search } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    if (page < 1 || limit < 1) {
      res.status(400).json({ error: 'Invalid page or limit' });
      return;
    }
    const offset = (page - 1) * limit;
    const productsWithNestedTags = await db.query.products.findMany({
      with: {
        // 'tags' here refers to the relation in 'productsRelations'
        // which points to 'productsTagsTable' (the join table entries)
        tags: {
          with: {
            // 'tags' here refers to the relation in 'productsTagsRelations'
            // which points to the actual 'tagsTable'
            tags: true, // Fetch all columns from the related tag
          },
        },
      },
      limit: limit,
      offset: offset,
      // The 'where' clause callback receives the table schema and operators
      where: (productsSchema) => {
        // Define individual, potentially undefined, conditions
        const categoryCondition =
          category && typeof category === 'string'
            ? eq(productsSchema.category, category)
            : undefined;

        const brandCondition =
          brand && typeof brand === 'string'
            ? eq(productsSchema.brand, brand)
            : undefined;

        const searchCondition =
          search && typeof search === 'string'
            ? or(
                like(productsSchema.name, `%${search}%`),
                like(productsSchema.description, `%${search}%`),
              )
            : undefined;
        // Drizzle's 'and' operator will ignore any undefined conditions.
        // If all conditions are undefined, 'opAnd' will return undefined,
        // resulting in no WHERE clause, which is the desired behavior.
        return and(categoryCondition, brandCondition, searchCondition);

        // and(
        //   and(
        //     eq(productsTable.category, category as string),
        //     eq(productsTable.brand, brand as string),
        //   ),
        //   or(
        //     like(productsTable.name, `%${search}%`),
        //     like(productsTable.description, `%${search}%`),
        //   ),
        // );
      },
    });
    // Transform the data to have a direct array of tag objects
    const transformedProducts = productsWithNestedTags.map((product) => {
      const actualTags = product.tags
        .map((productTagEntry) => productTagEntry.tags) // Extract the actual tag object
        .filter((tag) => !!tag); // Filter out any potentially null/undefined tags

      const { tags, ...restOfProduct } = product;
      return { ...restOfProduct, tags: actualTags.map((tag) => tag.tag) };
    });
    res.status(200).json(transformedProducts);
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function selectProductsByCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const db = await getDatabase();
  try {
    const category = req.params.category;
    const result = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.category, category));
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function registerProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const db = await getDatabase();
  try {
    const result = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(productsTable)
        .values(req.body)
        .$returningId();

      req.body.tags.forEach(async (tag: string) => {
        let tadReference;
        const [tagEntry] = await tx
          .select()
          .from(tagsTable)
          .where(eq(tagsTable.tag, tag));
        if (!tagEntry) {
          const [newTagId] = await tx
            .insert(tagsTable)
            .values({ tag })
            .$returningId();
          tadReference = newTagId;
        } else {
          tadReference = tagEntry;
        }
        await tx.insert(productsTagsTable).values({
          productId: result.id,
          tagId: tadReference.id,
        });
      });
      return result;
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const db = await getDatabase();
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }
    const [result] = await db
      .update(productsTable)
      .set(req.body)
      .where(eq(productsTable.id, id));
    res
      .status(result.affectedRows ? 200 : 404)
      .json(
        result.affectedRows
          ? { id: id, ...req.body }
          : { message: 'Product not found' },
      );
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const db = await getDatabase();
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }
    const [result] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id));
    res.status(result.affectedRows ? 204 : 404).json({
      message: result.affectedRows ? 'Product deleted' : 'Product not found',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
