// Catalog / inventory importer (additive — never deletes).
//
// Default source: backend/src/seeds/inventory/catalog/index.js (the aggregated
// per-gemstone catalog files).
//
//   npm run seed:catalog                    # import the catalog
//   npm run seed:catalog -- --dry-run       # preview without writing
//   npm run seed:catalog -- --update-existing
//   npm run seed:catalog -- --file src/seeds/some/other-file.js
//
// Behaviour:
//   - creates missing categories and products
//   - skips existing records unless --update-existing is passed
//   - matches categories by `slug`, products by `sku` or `slug`
//   - refuses to modify products whose SKU starts with DEMO-*
//   - products default to status DRAFT, so they stay invisible until published
//
// Unlike the demo seed (src/seeds/index.js), this script never deletes data.
import path from "node:path";
import { pathToFileURL } from "node:url";
import mongoose from "mongoose";
import { env } from "../config/index.js";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const DEFAULT_FILE = "./inventory/catalog/index.js";

export function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

export function hasArg(name) {
  return process.argv.includes(name);
}

// The default source is resolved next to this module; an explicit --file is
// resolved from the current working directory (npm sets that to backend/).
function resolveSeedFile(filePath) {
  if (!filePath)
    return {
      url: new URL(DEFAULT_FILE, import.meta.url),
      label: "catalog (default)",
    };
  const absolute = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  return { url: pathToFileURL(absolute), label: filePath };
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

function cleanImages(images = []) {
  return images
    .map((image, index) => ({
      url: image.url || "",
      altText: requireString(image.altText, `images[${index}].altText`),
      order: Number.isFinite(image.order) ? image.order : index,
    }))
    .sort((a, b) => a.order - b.order);
}

async function findParent(parentSlug) {
  if (!parentSlug) return null;
  const parent = await Category.findOne({ slug: parentSlug })
    .select("_id slug")
    .lean();
  if (!parent) throw new Error(`Parent category not found: ${parentSlug}`);
  return parent._id;
}

async function importCategory(input, options) {
  const slug = requireString(input.slug, "category.slug").toLowerCase();
  const name = requireString(input.name, `category ${slug}.name`);
  const existing = await Category.findOne({ slug });
  const parentSlug = input.parentSlug
    ? String(input.parentSlug).toLowerCase()
    : null;

  if (options.dryRun) {
    // A dry run writes nothing, so a parent declared earlier in the same file is
    // not in the database yet. Accept it if it was already declared, otherwise
    // fail the same way a real run would.
    if (parentSlug) {
      const parentInDb = await Category.findOne({ slug: parentSlug })
        .select("_id")
        .lean();
      if (!parentInDb && !options.declaredCategorySlugs?.has(parentSlug)) {
        throw new Error(`Parent category not found: ${parentSlug}`);
      }
    }
    return {
      action: existing ? "would-skip" : "would-create",
      type: "category",
      key: slug,
    };
  }

  const payload = {
    name,
    slug,
    parent: await findParent(parentSlug),
    description: input.description || "",
    seoTitle: input.seoTitle || "",
    seoDescription: input.seoDescription || "",
    active: input.active !== false,
    order: Number.isFinite(input.order) ? input.order : 0,
  };

  if (existing && !options.updateExisting)
    return { action: "skipped", type: "category", key: slug };
  if (existing) {
    await Category.updateOne(
      { _id: existing._id },
      { $set: payload },
      { runValidators: true },
    );
    return { action: "updated", type: "category", key: slug };
  }
  await Category.create(payload);
  return { action: "created", type: "category", key: slug };
}

async function importProduct(input, options) {
  const sku = requireString(input.sku, "product.sku");
  const slug = requireString(input.slug, `product ${sku}.slug`).toLowerCase();
  const categorySlug = requireString(
    input.categorySlug,
    `product ${sku}.categorySlug`,
  ).toLowerCase();
  const category = await Category.findOne({ slug: categorySlug })
    .select("_id slug")
    .lean();
  if (!category)
    throw new Error(
      `Product ${sku} references missing category: ${categorySlug}`,
    );

  const existing = await Product.findOne({ $or: [{ sku }, { slug }] });
  if (existing?.sku?.startsWith("DEMO-")) {
    throw new Error(
      `Refusing to modify demo product ${existing.sku}. Use a unique real SKU and slug.`,
    );
  }

  const payload = {
    sku,
    name: requireString(input.name, `product ${sku}.name`),
    slug,
    category: category._id,
    description: input.description || "",
    gemstoneType: input.gemstoneType || "",
    origin: input.origin || "",
    treatment: input.treatment || "",
    weightCarat: input.weightCarat ?? undefined,
    weightRatti: input.weightRatti ?? undefined,
    color: input.color || "",
    shape: input.shape || "",
    clarity: input.clarity || "",
    cut: input.cut || "",
    dimensions: input.dimensions || "",
    pricing: {
      type: input.pricing?.type || "FIXED",
      amount: Number(input.pricing?.amount || 0),
      currency: input.pricing?.currency || "INR",
    },
    priceState: input.priceState || "PUBLIC_PRICE",
    inventory: Number(input.inventory || 0),
    isUnique: Boolean(input.isUnique),
    status: input.status || "DRAFT",
    images: cleanImages(input.images || []),
    seoTitle: input.seoTitle || "",
    seoDescription: input.seoDescription || "",
  };

  if (options.dryRun) {
    return {
      action: existing ? "would-skip" : "would-create",
      type: "product",
      key: sku,
    };
  }
  if (existing && !options.updateExisting)
    return { action: "skipped", type: "product", key: sku };
  if (existing) {
    await Product.updateOne(
      { _id: existing._id },
      { $set: payload },
      { runValidators: true },
    );
    return { action: "updated", type: "product", key: sku };
  }
  await Product.create(payload);
  return { action: "created", type: "product", key: sku };
}

function printSummary(results) {
  const totals = results.reduce((acc, result) => {
    const key = `${result.type}:${result.action}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  // eslint-disable-next-line no-console
  console.table(totals);
}

async function run() {
  const file = resolveSeedFile(argValue("--file"));
  const options = {
    dryRun: hasArg("--dry-run"),
    updateExisting: hasArg("--update-existing"),
  };

  // eslint-disable-next-line no-console
  console.log(
    `Source: ${file.label}${options.dryRun ? " (dry run — nothing will be written)" : ""}`,
  );

  const data = await import(file.url.href);
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const products = Array.isArray(data.products) ? data.products : [];

  await connectDB(env.mongodbUri);
  try {
    const results = [];
    // Categories first: products reference them by slug. Parents must be listed
    // before their children, so the declared set is built up as we go.
    const declaredCategorySlugs = new Set();
    for (const category of categories) {
      results.push(
        await importCategory(category, { ...options, declaredCategorySlugs }),
      );
      if (category?.slug)
        declaredCategorySlugs.add(String(category.slug).toLowerCase());
    }
    for (const product of products)
      results.push(await importProduct(product, options));
    printSummary(results);
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
